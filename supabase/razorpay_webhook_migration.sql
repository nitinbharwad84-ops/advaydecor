-- =====================================================================
-- AdvayDecor — Razorpay Webhook Migration
-- =====================================================================
-- Adds columns to track Razorpay order/payment IDs on our orders table.
-- This connects our internal order to the Razorpay payment lifecycle.
--
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- =====================================================================

-- Add Razorpay tracking columns to existing orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;

-- Index for fast webhook lookups (Razorpay sends us the order_id)
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id
    ON public.orders (razorpay_order_id)
    WHERE razorpay_order_id IS NOT NULL;
