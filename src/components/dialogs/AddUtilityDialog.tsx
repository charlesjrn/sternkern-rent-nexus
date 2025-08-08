import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddUtilityDialogProps {
  onSuccess?: () => void;
}

const AddUtilityDialog: React.FC<AddUtilityDialogProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    tenant_name: '',
    house_number: '',
    electricity: '',
    water: '',
    garbage: '',
    other_utilities: '',
    billing_month: new Date().toISOString().slice(0, 10)
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchUnits = async () => {
      const { data, error } = await supabase.from('units').select('house_number').order('house_number');
      if (!error) setUnits((data || []).map(u => u.house_number));
    };
    fetchUnits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        tenant_name: formData.tenant_name || null,
        house_number: formData.house_number || null,
        electricity: formData.electricity ? parseFloat(formData.electricity) : 0,
        water: formData.water ? parseFloat(formData.water) : 0,
        garbage: formData.garbage ? parseFloat(formData.garbage) : 0,
        other_utilities: formData.other_utilities ? parseFloat(formData.other_utilities) : 0,
        billing_month: formData.billing_month,
      };

      const { error } = await supabase.from('utilities').insert([payload]);
      if (error) throw error;

      toast({ title: 'Utility Added', description: 'Utility record saved successfully.' });
      setOpen(false);
      setFormData({ tenant_name: '', house_number: '', electricity: '', water: '', garbage: '', other_utilities: '', billing_month: new Date().toISOString().slice(0, 10) });
      onSuccess?.();
    } catch (err) {
      console.error('Error adding utility:', err);
      toast({ title: 'Failed to Save', description: 'Could not save utility record.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Utility Record
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Utility</DialogTitle>
          <DialogDescription>Record utility charges for a unit and month.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="house_number">House Number</Label>
              <Select value={formData.house_number} onValueChange={(v) => setFormData({ ...formData, house_number: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((hn) => (
                    <SelectItem key={hn} value={hn}>{hn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tenant_name">Tenant Name (optional)</Label>
              <Input id="tenant_name" value={formData.tenant_name} onChange={(e) => setFormData({ ...formData, tenant_name: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="electricity">Electricity (KSh)</Label>
              <Input id="electricity" type="number" value={formData.electricity} onChange={(e) => setFormData({ ...formData, electricity: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="water">Water (KSh)</Label>
              <Input id="water" type="number" value={formData.water} onChange={(e) => setFormData({ ...formData, water: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="garbage">Garbage (KSh)</Label>
              <Input id="garbage" type="number" value={formData.garbage} onChange={(e) => setFormData({ ...formData, garbage: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="other_utilities">Other Utilities (KSh)</Label>
              <Input id="other_utilities" type="number" value={formData.other_utilities} onChange={(e) => setFormData({ ...formData, other_utilities: e.target.value })} />
            </div>
          </div>

          <div>
            <Label htmlFor="billing_month">Billing Month</Label>
            <Input id="billing_month" type="date" value={formData.billing_month} onChange={(e) => setFormData({ ...formData, billing_month: e.target.value })} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Utility'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUtilityDialog;
