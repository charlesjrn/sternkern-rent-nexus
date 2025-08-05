-- Create inventory table for property items
CREATE TABLE public.inventory (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  item_category VARCHAR(100) NOT NULL,
  house_number VARCHAR(50),
  quantity INTEGER NOT NULL DEFAULT 1,
  condition VARCHAR(50) DEFAULT 'Good',
  purchase_date DATE,
  purchase_price DECIMAL(10,2),
  warranty_expiry DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Create policy for landlord access
CREATE POLICY "Landlord can manage inventory" 
ON public.inventory 
FOR ALL 
USING (auth.role() = 'authenticated'::text)
WITH CHECK (auth.role() = 'authenticated'::text);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON public.inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_inventory_updated_at();