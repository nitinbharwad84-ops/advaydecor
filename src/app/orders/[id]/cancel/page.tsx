'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, FileText, CheckCircle, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserAuthStore } from '@/lib/auth-store';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function CancelOrderPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    const { isAuthenticated } = useUserAuthStore();
    
    const [order, setOrder] = useState<Order | null>(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;

        fetch(`/api/orders/${orderId}`)
            .then(res => {
                if (!res.ok) throw new Error('Order not found');
                return res.json();
            })
            .then(data => {
                if (data.error) throw new Error(data.error);
                setOrder(data);
            })
            .catch(err => {
                toast.error(err.message);
                router.push('/profile');
            })
            .finally(() => setPageLoading(false));
    }, [orderId, isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            toast.error('Please provide a reason for cancellation');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'Failed to request cancellation');
            
            setSuccess(true);
            toast.success('Your cancellation request has been submitted.');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div style={{ minHeight: '100vh', paddingTop: 'var(--nav-height, 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdfbf7' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: '#00b4d8' }} />
            </div>
        );
    }

    if (!order) return null;

    return (
        <div style={{ minHeight: '100vh', paddingTop: 'var(--nav-height, 80px)', background: '#fdfbf7' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem' }}>
                <Link href={`/orders/${orderId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64648b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, marginBottom: '2rem' }}>
                    <ArrowLeft size={16} /> Back to Order Details
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2rem' }}>
                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ background: '#fff', borderRadius: '1.25rem', padding: 'clamp(1.5rem, 5vw, 2.5rem)', border: '1px solid #f0ece4', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
                    >
                        {success ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ width: '64px', height: '64px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    <CheckCircle size={32} />
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a23', marginBottom: '1rem' }}>Cancellation Requested</h2>
                                <p style={{ color: '#64648b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                                    We have received your reason for cancellation. Our team will review your request and process it shortly.
                                </p>
                                <Link href={`/orders/${orderId}`} style={{ display: 'inline-block', padding: '0.875rem 2rem', background: '#0a0a23', color: '#fff', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: 600 }}>
                                    View Order Details
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div style={{ marginBottom: '2rem' }}>
                                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a23', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <FileText size={24} style={{ color: '#ef4444' }} />
                                        Cancel Order
                                    </h1>
                                    <p style={{ color: '#64648b', fontSize: '0.9rem' }}>
                                        Please tell us why you wish to cancel this order. We'll review your request to proceed.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0a0a23', marginBottom: '0.5rem' }}>
                                            Reason for Cancellation
                                        </label>
                                        <textarea
                                            value={reason}
                                            onChange={e => setReason(e.target.value)}
                                            placeholder="e.g. Purchased by mistake, found a better price elsewhere..."
                                            rows={4}
                                            style={{
                                                width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #d4d0c8',
                                                background: '#fcfbfa', fontSize: '0.95rem', color: '#0a0a23', resize: 'vertical',
                                                outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
                                            }}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !reason.trim()}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                            padding: '1rem', background: '#ef4444', color: '#fff', border: 'none',
                                            borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                                            opacity: loading || !reason.trim() ? 0.7 : 1, transition: 'all 0.2s',
                                            marginTop: '1rem'
                                        }}
                                    >
                                        {loading ? <Loader2 size={20} className="animate-spin" /> : 'Submit Request'}
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>

                    {/* Order Details Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                        <div style={{ background: '#fff', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid #f0ece4', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0a0a23', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShoppingBag size={18} style={{ color: '#00b4d8' }} /> Order Overview
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {order.items?.map((item) => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f0ece4' }}>
                                        <div>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0a0a23', marginBottom: '0.2rem' }}>{item.product_title}</p>
                                            <p style={{ fontSize: '0.8rem', color: '#64648b' }}>Qty: {item.quantity} {item.variant_name ? `• ${item.variant_name}` : ''}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0a0a23' }}>{formatCurrency(item.total_price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #f0ece4', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#0a0a23' }}>Total Amount</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00b4d8' }}>{formatCurrency(order.total_amount)}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
