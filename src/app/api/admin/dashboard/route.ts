import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// GET: Dashboard stats (real counts from Supabase)
export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const admin = createAdminClient();
        const { data: isAdmin } = await admin.from('admin_users').select('id').eq('id', user.id).single();
        if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        // Optimized: 2 queries instead of 5
        // - get_dashboard_stats() returns revenue, order counts, product count in 1 DB call
        // - Recent orders is a simple LIMIT 5 query
        const [statsRes, recentRes] = await Promise.all([
            admin.rpc('get_dashboard_stats'),
            admin.from('orders')
                .select(`
                    id, status, total_amount, created_at,
                    guest_info
                `)
                .order('created_at', { ascending: false })
                .limit(5),
        ]);

        // Parse stats from database RPC function
        const stats = statsRes.data || { total_revenue: 0, total_orders: 0, pending_orders: 0, total_products: 0 };
        const totalProducts = stats.total_products || 0;
        const totalOrders = stats.total_orders || 0;
        const pendingOrders = stats.pending_orders || 0;
        const revenue = Number(stats.total_revenue) || 0;

        // Shape recent orders
        const recentOrders = (recentRes.data || []).map((o: Record<string, unknown>) => {
            const guest = o.guest_info as Record<string, string> | null;
            return {
                id: o.id,
                customer: guest?.name || 'Registered User',
                total: `₹${Number(o.total_amount).toLocaleString('en-IN')}`,
                status: o.status,
                date: getRelativeTime(o.created_at as string),
            };
        });

        return NextResponse.json({
            totalProducts,
            totalOrders,
            pendingOrders,
            revenue,
            recentOrders,
        });
    } catch (err) {
        console.error('Error fetching dashboard:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

function getRelativeTime(dateStr: string): string {
    const now = Date.now();
    const diff = now - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
}
