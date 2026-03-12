-- Migration: Add detailed product attributes
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS dimensions TEXT,
ADD COLUMN IF NOT EXISTS material TEXT,
ADD COLUMN IF NOT EXISTS filling_material TEXT,
ADD COLUMN IF NOT EXISTS construction_details TEXT,
ADD COLUMN IF NOT EXISTS care_instructions TEXT,
ADD COLUMN IF NOT EXISTS usage_recommendations TEXT;

-- Update the existing complete schema file to reflect these changes for future installs
-- (This will be done via replace_file_content in the next step)
