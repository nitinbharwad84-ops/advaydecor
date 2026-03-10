'use client';

import { useState, useEffect, Fragment } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, ChevronDown, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const statusColors: Record<string, { bg: string; text: string }> = {
    Pending: { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706' },
    Processing: { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb' },
    Shipped: { bg: 'rgba(139, 92, 246, 0.1)', text: '#7c3aed' },
    Delivered: { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a' },
    Cancelled: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626' },
    Returned: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' },
};

const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

interface OrderData {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    total_amount: number;
    shipping_fee: number;
    shipping_address: {
        full_name: string;
        phone: string;
        address_line1: string;
        address_line2?: string;
        city: string;
        state: string;
        pincode: string;
    };
    status: string;
    payment_method: string;
    coupon_code: string | null;
    discount_amount: number;
    created_at: string;
    items: { id: string; product_title: string; variant_name: string | null; quantity: number; unit_price: number; total_price: number }[];
}

export default function AdminOrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);

    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/admin/orders')
            .then(res => {
                if (!res.ok) {
                    return res.json().then(d => { throw new Error(d.error || 'Failed to load orders'); });
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setOrders(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Admin orders fetch error:', err);
                setFetchError(err.message || 'Failed to load orders');
                setLoading(false);
            });
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, status: newStatus }),
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                toast.success(`Order status updated to ${newStatus}`);
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to update');
            }
        } catch {
            toast.error('Failed to update order status');
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                <div style={{ width: '32px', height: '32px', border: '3px solid rgba(0,180,216,0.2)', borderTop: '3px solid #00b4d8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
                <Eye size={40} style={{ margin: '0 auto 1rem', color: '#ef4444' }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0a0a23', marginBottom: '0.5rem' }}>Failed to Load Orders</h2>
                <p style={{ color: '#64648b', marginBottom: '1.5rem' }}>{fetchError}</p>
                <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1.5rem', background: '#0a0a23', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a23' }}>Orders</h1>
                <p style={{ fontSize: '0.875rem', color: '#9e9eb8', marginTop: '0.25rem' }}>Manage and track customer orders ({orders.length} total)</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: '1', maxWidth: '360px', minWidth: '200px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9e9eb8' }} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by order ID or customer..."
                        style={{
                            width: '100%', paddingLeft: '2.75rem', paddingRight: '1rem',
                            paddingTop: '0.625rem', paddingBottom: '0.625rem',
                            borderRadius: '0.75rem', border: '1px solid #e8e4dc',
                            background: '#ffffff', fontSize: '0.875rem',
                            outline: 'none', color: '#0a0a23',
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {statusOptions.map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            style={{
                                padding: '0.5rem 1rem', borderRadius: '9999px',
                                fontSize: '0.75rem', fontWeight: 600,
                                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                background: statusFilter === status ? '#0a0a23' : '#f5f0e8',
                                color: statusFilter === status ? '#ffffff' : '#64648b',
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ borderRadius: '1rem', background: '#ffffff', border: '1px solid #f0ece4', overflow: 'hidden' }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '750px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(245,240,232,0.5)' }}>
                                {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', ''].map((h) => (
                                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1.5rem', fontSize: '0.7rem', fontWeight: 600, color: '#9e9eb8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <Fragment key={order.id}>
                                    <tr
                                        style={{ borderBottom: '1px solid #f0ece4', cursor: 'pointer', transition: 'background 0.2s' }}
                                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                    >
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontFamily: 'monospace', fontWeight: 600, color: '#0a0a23' }}>
                                            {order.id.substring(0, 8)}...
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0a0a23' }}>{order.customer_name}</p>
                                            <p style={{ fontSize: '0.75rem', color: '#9e9eb8' }}>{order.customer_email}</p>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#64648b' }}>{order.items?.length || 0}</td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#0a0a23' }}>
                                            ₹{Number(order.total_amount).toLocaleString('en-IN')}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#64648b' }}>{order.payment_method}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
                                                background: statusColors[order.status]?.bg,
                                                color: statusColors[order.status]?.text,
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#9e9eb8' }}>
                                            {new Date(order.created_at).toLocaleDateString('en-IN')}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <ChevronDown size={16} style={{ color: '#9e9eb8', transition: 'transform 0.2s', transform: expandedOrder === order.id ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                                        </td>
                                    </tr>
                                    {expandedOrder === order.id && (
                                        <tr>
                                            <td colSpan={8} style={{ padding: '0', background: 'rgba(245,240,232,0.25)' }}>
                                                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                                    {/* Top Row: Order Meta + Customer Info */}
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>

                                                        {/* Order Info */}
                                                        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #f0ece4' }}>
                                                            <h4 style={{ fontSize: '0.72rem', fontWeight: 600, color: '#00b4d8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>Order Information</h4>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <span style={{ fontSize: '0.78rem', color: '#64648b' }}>Order ID</span>
                                                                    <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', fontWeight: 600, color: '#0a0a23' }}>{order.id.substring(0, 12)}…</span>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <span style={{ fontSize: '0.78rem', color: '#64648b' }}>Placed on</span>
                                                                    <span style={{ fontSize: '0.78rem', color: '#0a0a23' }}>{new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <span style={{ fontSize: '0.78rem', color: '#64648b' }}>Payment</span>
                                                                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: order.payment_method === 'COD' ? '#d97706' : '#16a34a' }}>{order.payment_method === 'COD' ? 'Cash on Delivery' : 'Razorpay (Online)'}</span>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <span style={{ fontSize: '0.78rem', color: '#64648b' }}>Status</span>
                                                                    <span style={{
                                                                        display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600,
                                                                        background: statusColors[order.status]?.bg || '#f3f4f6',
                                                                        color: statusColors[order.status]?.text || '#6b7280',
                                                                    }}>{order.status}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Customer Info */}
                                                        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #f0ece4' }}>
                                                            <h4 style={{ fontSize: '0.72rem', fontWeight: 600, color: '#00b4d8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>Customer Details</h4>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <span style={{ fontSize: '0.78rem', color: '#64648b' }}>Name</span>
                                                                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0a0a23' }}>{order.customer_name}</span>
                                                                </div>
                                                                {order.customer_email && (
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <span style={{ fontSize: '0.78rem', color: '#64648b' }}>Email</span>
                                                                        <span style={{ fontSize: '0.78rem', color: '#0a0a23' }}>{order.customer_email}</span>
                                                                    </div>
                                                                )}
                                                                {order.customer_phone && (
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <span style={{ fontSize: '0.78rem', color: '#64648b' }}>Phone</span>
                                                                        <span style={{ fontSize: '0.78rem', color: '#0a0a23' }}>{order.customer_phone}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Shipping Address */}
                                                        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #f0ece4' }}>
                                                            <h4 style={{ fontSize: '0.72rem', fontWeight: 600, color: '#00b4d8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>Shipping Address</h4>
                                                            <p style={{ fontSize: '0.85rem', color: '#0a0a23', lineHeight: 1.7, margin: 0 }}>
                                                                <strong>{order.shipping_address.full_name}</strong><br />
                                                                {order.shipping_address.address_line1}<br />
                                                                {order.shipping_address.address_line2 && <>{order.shipping_address.address_line2}<br /></>}
                                                                {order.shipping_address.city}, {order.shipping_address.state} — {order.shipping_address.pincode}<br />
                                                                📞 {order.shipping_address.phone}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Order Items Table */}
                                                    <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #f0ece4' }}>
                                                        <h4 style={{ fontSize: '0.72rem', fontWeight: 600, color: '#00b4d8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>Order Items ({order.items?.length || 0})</h4>
                                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                            <thead>
                                                                <tr style={{ borderBottom: '1px solid #f0ece4' }}>
                                                                    {['Product', 'Variant', 'Unit Price', 'Qty', 'Total'].map(h => (
                                                                        <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.7rem', fontWeight: 600, color: '#9e9eb8', textTransform: 'uppercase' }}>{h}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {order.items?.map(item => (
                                                                    <tr key={item.id} style={{ borderBottom: '1px solid #f8f5f0' }}>
                                                                        <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.85rem', fontWeight: 500, color: '#0a0a23' }}>{item.product_title}</td>
                                                                        <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.82rem', color: '#64648b' }}>{item.variant_name || '—'}</td>
                                                                        <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.82rem', color: '#64648b' }}>₹{Number(item.unit_price).toLocaleString('en-IN')}</td>
                                                                        <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.82rem', color: '#64648b' }}>{item.quantity}</td>
                                                                        <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.85rem', fontWeight: 600, color: '#0a0a23' }}>₹{Number(item.total_price).toLocaleString('en-IN')}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>

                                                        {/* Price Summary */}
                                                        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '2px solid #f0ece4', display: 'flex', flexDirection: 'column', gap: '0.3rem', maxWidth: '300px', marginLeft: 'auto' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <span style={{ fontSize: '0.82rem', color: '#64648b' }}>Subtotal</span>
                                                                <span style={{ fontSize: '0.82rem', color: '#0a0a23' }}>₹{(order.items?.reduce((sum, i) => sum + Number(i.total_price), 0) || 0).toLocaleString('en-IN')}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <span style={{ fontSize: '0.82rem', color: '#64648b' }}>Shipping</span>
                                                                <span style={{ fontSize: '0.82rem', color: '#0a0a23' }}>{Number(order.shipping_fee) > 0 ? `₹${Number(order.shipping_fee).toLocaleString('en-IN')}` : 'Free'}</span>
                                                            </div>
                                                            {order.coupon_code && (
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <span style={{ fontSize: '0.82rem', color: '#16a34a' }}>Discount ({order.coupon_code})</span>
                                                                    <span style={{ fontSize: '0.82rem', color: '#16a34a' }}>−₹{Number(order.discount_amount).toLocaleString('en-IN')}</span>
                                                                </div>
                                                            )}
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #f0ece4' }}>
                                                                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0a0a23' }}>Total</span>
                                                                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#00b4d8' }}>₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Update Status */}
                                                    <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #f0ece4', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                                        <h4 style={{ fontSize: '0.72rem', fontWeight: 600, color: '#00b4d8', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>Update Status</h4>
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                            style={{
                                                                padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                                                                border: '1px solid #d4d0c8', background: '#fff',
                                                                fontSize: '0.85rem', outline: 'none', color: '#0a0a23',
                                                                minWidth: '180px',
                                                            }}
                                                        >
                                                            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Cancellation Requested', 'Return Requested'].map(s => (
                                                                <option key={s} value={s}>{s}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <Eye size={40} style={{ margin: '0 auto', color: '#9e9eb8', marginBottom: '1rem' }} />
                        <p style={{ color: '#64648b' }}>No orders found</p>
                    </div>
                )}
            </motion.div>

            <style>{`
                .admin-order-detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; padding: 0.5rem; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
