-- Add columns for return and cancellation processes
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS cancel_reason TEXT,
ADD COLUMN IF NOT EXISTS return_reason TEXT,
ADD COLUMN IF NOT EXISTS return_is_packaged BOOLEAN,
ADD COLUMN IF NOT EXISTS return_is_unused BOOLEAN;

-- Update the CHECK constraint for the status column to allow the new statuses
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('Awaiting Payment', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Cancellation Requested', 'Return Requested'));
