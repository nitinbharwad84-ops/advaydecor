-- =====================================================================
-- AdvayDecor — Revenue Calculation RPC Functions
-- =====================================================================
-- RUN IN: Supabase Dashboard → SQL Editor → New Query → Paste → Run
--
-- These functions calculate revenue INSIDE the database (PostgreSQL),
-- returning a single number instead of sending ALL orders to the browser.
--
-- BEFORE: Fetch 50,000 rows → Sum in JavaScript → Slow + Heavy RAM
-- AFTER:  Database does SUM() → Returns 1 number → Instant + Zero RAM
--
-- ✅ SAFE to run multiple times (CREATE OR REPLACE)
-- ✅ No data is modified or deleted
-- =====================================================================


-- 1. Total revenue (all confirmed orders)
CREATE OR REPLACE FUNCTION public.get_total_revenue()
RETURNS NUMERIC AS $$
  SELECT COALESCE(SUM(total_amount), 0)
  FROM public.orders
  WHERE status NOT IN ('Cancelled', 'Returned', 'Awaiting Payment');
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- 2. Revenue for a specific date range (useful for future dashboard filters)
CREATE OR REPLACE FUNCTION public.get_revenue_by_range(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
)
RETURNS NUMERIC AS $$
  SELECT COALESCE(SUM(total_amount), 0)
  FROM public.orders
  WHERE status NOT IN ('Cancelled', 'Returned', 'Awaiting Payment')
    AND created_at >= start_date
    AND created_at <= end_date;
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- 3. Dashboard summary stats (all in one call — ultimate performance)
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS JSON AS $$
  SELECT json_build_object(
    'total_revenue', COALESCE((
      SELECT SUM(total_amount) 
      FROM public.orders 
      WHERE status NOT IN ('Cancelled', 'Returned', 'Awaiting Payment')
    ), 0),
    'total_orders', (SELECT COUNT(*) FROM public.orders),
    'pending_orders', (SELECT COUNT(*) FROM public.orders WHERE status = 'Pending'),
    'total_products', (SELECT COUNT(*) FROM public.products)
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;


SELECT '✅ Revenue RPC functions created successfully!' AS status;
