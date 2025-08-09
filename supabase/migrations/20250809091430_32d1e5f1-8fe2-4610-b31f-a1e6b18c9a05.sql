-- Add amount tracking to invoices
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS amount_paid numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS amount_due numeric NOT NULL DEFAULT 0;

-- Backfill amount_due from total_due
UPDATE public.invoices
SET amount_due = COALESCE(total_due, 0)
WHERE true;

-- Ensure invoice_id is set on insert and initialize status/amounts
CREATE OR REPLACE FUNCTION public.set_invoice_identifier()
RETURNS trigger AS $$
BEGIN
  IF NEW.invoice_id IS NULL THEN
    NEW.invoice_id := 'INV-' || NEW.id::text;
  END IF;
  IF NEW.amount_due IS NULL OR NEW.amount_due = 0 THEN
    NEW.amount_due := COALESCE(NEW.total_due, 0);
  END IF;
  IF NEW.payment_status IS NULL THEN
    NEW.payment_status := 'Unpaid';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

DROP TRIGGER IF EXISTS trg_invoices_set_identifier ON public.invoices;
CREATE TRIGGER trg_invoices_set_identifier
BEFORE INSERT ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.set_invoice_identifier();

-- Set missing invoice_id for existing rows
UPDATE public.invoices
SET invoice_id = 'INV-' || id::text
WHERE invoice_id IS NULL;

-- Recompute allocation across invoices for a house
CREATE OR REPLACE FUNCTION public.recompute_invoices_for_house(p_house text)
RETURNS void AS $$
DECLARE
  p RECORD;
  inv RECORD;
  remaining numeric;
BEGIN
  IF p_house IS NULL THEN
    RETURN;
  END IF;

  -- Reset invoices for this house
  UPDATE public.invoices
  SET amount_paid = 0,
      amount_due = COALESCE(total_due, 0),
      payment_status = CASE WHEN COALESCE(total_due,0) = 0 THEN 'Paid' ELSE 'Unpaid' END
  WHERE house_number = p_house;

  -- Apply payments oldest to newest invoices (oldest billing_month first)
  FOR p IN
    SELECT id, COALESCE(amount_paid,0) AS paid, payment_date
    FROM public.payments
    WHERE house_number = p_house
    ORDER BY payment_date ASC, id ASC
  LOOP
    remaining := COALESCE(p.paid, 0);

    FOR inv IN
      SELECT id, amount_due
      FROM public.invoices
      WHERE house_number = p_house AND amount_due > 0
      ORDER BY billing_month ASC, id ASC
    LOOP
      EXIT WHEN remaining <= 0;

      IF remaining >= inv.amount_due THEN
        -- Pay off this invoice fully
        UPDATE public.invoices
        SET amount_paid = amount_paid + inv.amount_due,
            amount_due = 0,
            payment_status = 'Paid'
        WHERE id = inv.id;
        remaining := remaining - inv.amount_due;
      ELSE
        -- Partial payment
        UPDATE public.invoices
        SET amount_paid = amount_paid + remaining,
            amount_due = amount_due - remaining,
            payment_status = 'Partial'
        WHERE id = inv.id;
        remaining := 0;
      END IF;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Trigger to recompute on payments changes
CREATE OR REPLACE FUNCTION public.on_payments_change()
RETURNS trigger AS $$
DECLARE
  house text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    house := NEW.house_number;
  ELSIF TG_OP = 'UPDATE' THEN
    house := COALESCE(NEW.house_number, OLD.house_number);
  ELSE
    house := OLD.house_number;
  END IF;

  IF house IS NOT NULL THEN
    PERFORM public.recompute_invoices_for_house(house);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

DROP TRIGGER IF EXISTS trg_payments_recompute_aiud ON public.payments;
CREATE TRIGGER trg_payments_recompute_aiud
AFTER INSERT OR UPDATE OR DELETE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.on_payments_change();

-- Helpful indices
CREATE INDEX IF NOT EXISTS idx_invoices_house_status ON public.invoices (house_number, payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_house_date ON public.payments (house_number, payment_date);
