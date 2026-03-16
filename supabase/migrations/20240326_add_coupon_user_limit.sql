-- Migration to add per-user usage limit to coupons
ALTER TABLE public.coupons 
ADD COLUMN IF NOT EXISTS user_limit INTEGER DEFAULT NULL;

COMMENT ON COLUMN public.coupons.user_limit IS 'Maximum number of times a single user can use this coupon. NULL means unlimited.';
