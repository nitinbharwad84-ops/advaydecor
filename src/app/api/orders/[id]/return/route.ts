import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// POST: Request return for an order (authenticated user only)
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { reason, isPackaged, isUnused } = body;

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // Ignored in server context
                        }
                    },
                },
            }
        );

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Fetch the order to ensure it belongs to the user and can be returned
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('id, status')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.status !== 'Delivered') {
            return NextResponse.json({ error: 'Only delivered orders can be returned' }, { status: 400 });
        }

        // Update the order status to Return Requested and save the fields
        const { error: updateError } = await supabase
            .from('orders')
            .update({ 
                status: 'Return Requested',
                return_reason: reason,
                return_is_packaged: isPackaged,
                return_is_unused: isUnused
            })
            .eq('id', id)
            .eq('user_id', user.id);

        if (updateError) {
            return NextResponse.json({ error: 'Failed to return order' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Return requested successfully' });
    } catch (err) {
        console.error('Error returning order:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
