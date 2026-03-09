'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, RotateCcw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReturnOrderPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    
    const [reason, setReason] = useState('');
    const [isPackaged, setIsPackaged] = useState(false);
    const [isUnused, setIsUnused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            toast.error('Please provide a reason for the return.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/orders/${orderId}/return`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason, isPackaged, isUnused })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'Failed to request return');
            
            setSuccess(true);
            toast.success('Your return request has been submitted.');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: 'var(--nav-height, 80px)', background: '#fdfbf7' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 1.5rem' }}>
                <Link href={`/orders/${orderId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64648b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, marginBottom: '2rem' }}>
                    <ArrowLeft size={16} /> Back to Order Details
                </Link>

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
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a23', marginBottom: '1rem' }}>Return Requested</h2>
                            <p style={{ color: '#64648b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                                We have received your return request. Our admin team will review your reasons and the product usage status. You will be notified shortly.
                            </p>
                            <Link href={`/orders/${orderId}`} style={{ display: 'inline-block', padding: '0.875rem 2rem', background: '#0a0a23', color: '#fff', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: 600 }}>
                                View Order Details
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '2rem' }}>
                                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a23', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <RotateCcw size={24} style={{ color: '#d97706' }} />
                                    Return Order
                                </h1>
                                <p style={{ color: '#64648b', fontSize: '0.9rem' }}>
                                    Provide details regarding your return request for Admin review.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0a0a23', marginBottom: '0.5rem' }}>
                                        Reason for Return
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={e => setReason(e.target.value)}
                                        placeholder="e.g. Product damaged, item not as described..."
                                        rows={4}
                                        style={{
                                            width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #d4d0c8',
                                            background: '#fcfbfa', fontSize: '0.95rem', color: '#0a0a23', resize: 'vertical',
                                            outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
                                        }}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f5f0e8', padding: '1rem', borderRadius: '0.75rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={isPackaged}
                                            onChange={e => setIsPackaged(e.target.checked)}
                                            style={{ width: '1.25rem', height: '1.25rem', accentColor: '#0a0a23' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', color: '#0a0a23', fontWeight: 500 }}>I have the original packaging intact.</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={isUnused}
                                            onChange={e => setIsUnused(e.target.checked)}
                                            style={{ width: '1.25rem', height: '1.25rem', accentColor: '#0a0a23' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', color: '#0a0a23', fontWeight: 500 }}>The product is unused, unworn, and clean.</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !reason.trim()}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        padding: '1rem', background: '#d97706', color: '#fff', border: 'none',
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
            </div>
        </div>
    );
}
