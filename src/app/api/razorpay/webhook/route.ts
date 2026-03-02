import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase-admin';

/**
 * Razorpay Webhook Handler
 * ========================
 * This endpoint is called DIRECTLY by Razorpay's servers (not by our frontend).
 * It catches payments even if the customer closes their browser tab.
 * 
 * Security:
 * - Verifies the webhook signature using RAZORPAY_WEBHOOK_SECRET
 * - This secret is DIFFERENT from RAZORPAY_KEY_SECRET
 * - A fake webhook without the correct signature is instantly rejected
 * 
 * Setup in Razorpay Dashboard:
 * 1. Go to Settings → Webhooks
 * 2. Add webhook URL: https://yourdomain.com/api/razorpay/webhook
 * 3. Select events: payment.captured
 * 4. Copy the webhook secret into your .env as RAZORPAY_WEBHOOK_SECRET
 */
export async function POST(request: Request) {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('RAZORPAY_WEBHOOK_SECRET is not configured');
            return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
        }

        // Read the raw body for signature verification
        const rawBody = await request.text();
        const receivedSignature = request.headers.get('x-razorpay-signature');

        if (!receivedSignature) {
            console.warn('Webhook received without signature header — REJECTED');
            return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
        }

        // ========================================================
        // SIGNATURE VERIFICATION (Anti-Fake Protection)
        // ========================================================
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(rawBody)
            .digest('hex');

        const isValid = crypto.timingSafeEqual(
            Buffer.from(expectedSignature, 'hex'),
            Buffer.from(receivedSignature, 'hex')
        );

        if (!isValid) {
            console.warn('Webhook signature mismatch — FAKE WEBHOOK REJECTED');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // Parse the verified payload
        const event = JSON.parse(rawBody);
        const eventType = event.event;

        console.log(`Razorpay webhook received: ${eventType}`);

        // We only care about successful payments
        if (eventType === 'payment.captured') {
            const payment = event.payload?.payment?.entity;

            if (!payment) {
                console.warn('Webhook: payment entity missing from payload');
                return NextResponse.json({ received: true });
            }

            const razorpayOrderId = payment.order_id;
            const razorpayPaymentId = payment.id;

            if (!razorpayOrderId) {
                console.warn('Webhook: no order_id in payment entity');
                return NextResponse.json({ received: true });
            }

            // Find our internal order by Razorpay order ID
            const admin = createAdminClient();
            const { data: order } = await admin
                .from('orders')
                .select('id, status')
                .eq('razorpay_order_id', razorpayOrderId)
                .single();

            if (!order) {
                // This can happen if the client-side flow completed before the webhook
                // or if the order_id wasn't linked properly. Log it for admin review.
                console.warn(`Webhook: no order found for razorpay_order_id=${razorpayOrderId}`);
                return NextResponse.json({ received: true });
            }

            // If order is still "Awaiting Payment", confirm it
            if (order.status === 'Awaiting Payment') {
                console.log(`Webhook: confirming order ${order.id} via payment ${razorpayPaymentId}`);

                // Call our confirm-payment logic internally
                const confirmUrl = new URL('/api/orders/confirm-payment', request.url);
                await fetch(confirmUrl.toString(), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        order_id: order.id,
                        razorpay_payment_id: razorpayPaymentId,
                    }),
                });

                console.log(`Webhook: order ${order.id} confirmed successfully`);
            } else {
                console.log(`Webhook: order ${order.id} already confirmed (status: ${order.status})`);
            }
        }

        // Always return 200 to Razorpay (otherwise it retries)
        return NextResponse.json({ received: true });
    } catch (err) {
        console.error('Webhook processing error:', err);
        // Return 200 to prevent Razorpay from retrying on our errors
        return NextResponse.json({ received: true });
    }
}
