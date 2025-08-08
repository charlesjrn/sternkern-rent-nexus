-- Relax RLS policies for development to allow public access (anon) so frontend can read/write
-- NOTE: For production, replace with proper authenticated policies

-- Units policies
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public can read units" ON public.units FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can insert units" ON public.units FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public can update units" ON public.units FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Public can delete units" ON public.units FOR DELETE USING (true);

-- Tenants policies
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public can read tenants" ON public.tenants FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can insert tenants" ON public.tenants FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public can update tenants" ON public.tenants FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Public can delete tenants" ON public.tenants FOR DELETE USING (true);

-- Inventory policies
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public can read inventory" ON public.inventory FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can insert inventory" ON public.inventory FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public can update inventory" ON public.inventory FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Public can delete inventory" ON public.inventory FOR DELETE USING (true);

-- Payments policies
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public can read payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can insert payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public can update payments" ON public.payments FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Public can delete payments" ON public.payments FOR DELETE USING (true);

-- Utilities policies
ALTER TABLE public.utilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public can read utilities" ON public.utilities FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can insert utilities" ON public.utilities FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public can update utilities" ON public.utilities FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Public can delete utilities" ON public.utilities FOR DELETE USING (true);

-- Maintenance policies
ALTER TABLE public.maintenance ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public can read maintenance" ON public.maintenance FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can insert maintenance" ON public.maintenance FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public can update maintenance" ON public.maintenance FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Public can delete maintenance" ON public.maintenance FOR DELETE USING (true);

-- Invoices policies
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public can read invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can insert invoices" ON public.invoices FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public can update invoices" ON public.invoices FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Public can delete invoices" ON public.invoices FOR DELETE USING (true);

-- Allow updating users table for password changes (development only)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public can update users" ON public.users FOR UPDATE USING (true) WITH CHECK (true);

-- Triggers
DROP TRIGGER IF EXISTS set_invoice_total_due ON public.invoices;
CREATE TRIGGER set_invoice_total_due
BEFORE INSERT OR UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.calculate_total_due();

DROP TRIGGER IF EXISTS update_inventory_updated_at ON public.inventory;
CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON public.inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_inventory_updated_at();