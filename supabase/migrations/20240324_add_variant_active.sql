-- Migration to add enable/disable functionality for product variants
ALTER TABLE public.product_variants 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

COMMENT ON COLUMN public.product_variants.is_active IS 'Enables or disables a specific variant from being shown or purchased.';
