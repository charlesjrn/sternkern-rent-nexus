-- Fix RLS policies for users table to allow authentication
CREATE POLICY "Allow public read access to users for authentication" 
ON public.users 
FOR SELECT 
USING (true);

-- Fix search path for inventory function
CREATE OR REPLACE FUNCTION public.update_inventory_updated_at()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;