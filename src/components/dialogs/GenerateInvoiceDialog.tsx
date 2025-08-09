import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus } from 'lucide-react';

interface GenerateInvoiceDialogProps {
  mode: 'single' | 'bulk';
  onSuccess?: () => void;
}

const GenerateInvoiceDialog: React.FC<GenerateInvoiceDialogProps> = ({ mode, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    tenant_name: '',
    house_number: '',
    rent_amount: '',
    electricity: '',
    water: '',
    garbage: '',
    other_utilities: '',
    billing_month: new Date().toISOString().slice(0, 10)
  });
  const [houses, setHouses] = useState<{ house_number: string; tenant_name: string | null }[]>([]);

  useEffect(() => {
    if (!open) {
      setFormData({ tenant_name: '', house_number: '', rent_amount: '', electricity: '', water: '', garbage: '', other_utilities: '', billing_month: new Date().toISOString().slice(0, 10) });
      return;
    }
    const load = async () => {
      const { data } = await supabase.from('tenants').select('tenant_name, house_number').order('tenant_name', { ascending: true });
      setHouses(data || []);
    };
    load();
  }, [open]);

  useEffect(() => {
    const applyPrefill = async () => {
      if (!formData.house_number) return;
      const match = houses.find((h) => h.house_number === formData.house_number);
      const { data: unit } = await supabase
        .from('units')
        .select('rent_amount')
        .eq('house_number', formData.house_number)
        .maybeSingle();
      setFormData((prev) => ({
        ...prev,
        tenant_name: match?.tenant_name || '',
        rent_amount: unit?.rent_amount != null ? String(unit.rent_amount) : prev.rent_amount,
      }));
    };
    applyPrefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.house_number]);

  const generateSingle = async () => {
    const payload = {
      tenant_name: formData.tenant_name || null,
      house_number: formData.house_number || null,
      rent_amount: formData.rent_amount ? parseFloat(formData.rent_amount) : 0,
      electricity: formData.electricity ? parseFloat(formData.electricity) : 0,
      water: formData.water ? parseFloat(formData.water) : 0,
      garbage: formData.garbage ? parseFloat(formData.garbage) : 0,
      other_utilities: formData.other_utilities ? parseFloat(formData.other_utilities) : 0,
      billing_month: formData.billing_month,
      payment_status: 'Unpaid'
    };
    const { error } = await supabase.from('invoices').insert([payload]);
    if (error) throw error;
  };

  const generateBulk = async () => {
    // Pull tenants and units (to get rent_amount)
    const { data: tenants } = await supabase.from('tenants').select('tenant_name, house_number');
    const { data: units } = await supabase.from('units').select('house_number, rent_amount');

    const rentByHouse = new Map<string, number>();
    (units || []).forEach(u => {
      if (u.house_number) rentByHouse.set(u.house_number, Number(u.rent_amount || 0));
    });

    const records = (tenants || [])
      .filter(t => !!t.house_number)
      .map(t => ({
        tenant_name: t.tenant_name,
        house_number: t.house_number,
        rent_amount: rentByHouse.get(t.house_number as string) || 0,
        electricity: 0,
        water: 0,
        garbage: 0,
        other_utilities: 0,
        billing_month: formData.billing_month,
        payment_status: 'Unpaid'
      }));

    if (records.length === 0) return;

    const { error } = await supabase.from('invoices').insert(records);
    if (error) throw error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'single') await generateSingle();
      else await generateBulk();

      toast({ title: 'Invoices Generated', description: mode === 'single' ? 'Invoice created.' : 'Bulk invoices created.' });
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error('Invoice generation error:', err);
      toast({ title: 'Failed to Generate', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {mode === 'single' ? 'Generate Invoice' : 'Generate Invoices (Bulk)'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'single' ? 'Generate Invoice' : 'Generate Invoices (Bulk)'}</DialogTitle>
          <DialogDescription>
            {mode === 'single' ? 'Create an invoice for a specific tenant/unit.' : 'Create invoices for all current tenants for a specific month.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'single' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tenant_name">Tenant Name</Label>
                  <Input id="tenant_name" value={formData.tenant_name} disabled placeholder="Auto-filled" />
                </div>
                <div>
                  <Label htmlFor="house_number">House Number</Label>
                  <Select value={formData.house_number} onValueChange={(v) => setFormData({ ...formData, house_number: v })}>
                    <SelectTrigger><SelectValue placeholder="Select occupied unit" /></SelectTrigger>
                    <SelectContent>
                      {houses.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">No occupied units</div>
                      ) : (
                        houses.map((h) => (
                          <SelectItem key={h.house_number} value={h.house_number}>{h.house_number}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rent_amount">Rent (KSh)</Label>
                  <Input id="rent_amount" type="number" value={formData.rent_amount} onChange={(e) => setFormData({ ...formData, rent_amount: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="electricity">Electricity (KSh)</Label>
                  <Input id="electricity" type="number" value={formData.electricity} onChange={(e) => setFormData({ ...formData, electricity: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="water">Water (KSh)</Label>
                  <Input id="water" type="number" value={formData.water} onChange={(e) => setFormData({ ...formData, water: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="garbage">Garbage (KSh)</Label>
                  <Input id="garbage" type="number" value={formData.garbage} onChange={(e) => setFormData({ ...formData, garbage: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="other_utilities">Other (KSh)</Label>
                  <Input id="other_utilities" type="number" value={formData.other_utilities} onChange={(e) => setFormData({ ...formData, other_utilities: e.target.value })} />
                </div>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="billing_month">Billing Month</Label>
            <Input id="billing_month" type="date" value={formData.billing_month} onChange={(e) => setFormData({ ...formData, billing_month: e.target.value })} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? 'Processing...' : (mode === 'single' ? 'Create Invoice' : 'Create Invoices')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateInvoiceDialog;
