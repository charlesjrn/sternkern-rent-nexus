import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Unit {
  id: number;
  house_number: string;
  bedrooms: number;
  rent_amount: number;
  occupancy_status: string;
}

interface EditUnitDialogProps {
  unit: Unit;
  onSuccess?: () => void;
}

const EditUnitDialog: React.FC<EditUnitDialogProps> = ({ unit, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    bedrooms: unit.bedrooms,
    rent_amount: Number(unit.rent_amount || 0),
    occupancy_status: unit.occupancy_status || 'Unoccupied'
  });
  const [currentTenant, setCurrentTenant] = useState<string | null>(null);
  const [vacantUnits, setVacantUnits] = useState<string[]>([]);
  const [targetUnit, setTargetUnit] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    const loadData = async () => {
      const [{ data: tenant }, { data: units }] = await Promise.all([
        supabase.from('tenants').select('tenant_name').eq('house_number', unit.house_number).maybeSingle(),
        supabase.from('units').select('house_number').eq('occupancy_status', 'Unoccupied').order('house_number')
      ]);
      setCurrentTenant(tenant?.tenant_name || null);
      setVacantUnits((units || []).map((u: any) => u.house_number).filter(Boolean));
    };
    loadData();
  }, [open, unit.house_number]);

  const saveUnit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('units')
        .update({
          bedrooms: form.bedrooms,
          rent_amount: form.rent_amount,
          occupancy_status: form.occupancy_status
        })
        .eq('id', unit.id);
      if (error) throw error;
      toast({ title: 'Unit Updated', description: `Unit ${unit.house_number} updated.` });
      setOpen(false);
      onSuccess?.();
    } catch (e) {
      console.error(e);
      toast({ title: 'Update failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const shiftTenant = async () => {
    if (!currentTenant || !targetUnit) return;
    setLoading(true);
    try {
      // Move tenant record
      const { error: tErr } = await supabase
        .from('tenants')
        .update({ house_number: targetUnit })
        .eq('house_number', unit.house_number);
      if (tErr) throw tErr;
      // Update occupancy statuses
      await supabase.from('units').update({ occupancy_status: 'Unoccupied' }).eq('house_number', unit.house_number);
      await supabase.from('units').update({ occupancy_status: 'Occupied' }).eq('house_number', targetUnit);

      toast({ title: 'Tenant shifted', description: `${currentTenant} moved to ${targetUnit}.` });
      setOpen(false);
      onSuccess?.();
    } catch (e) {
      console.error(e);
      toast({ title: 'Shift failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Unit {unit.house_number}</DialogTitle>
          <DialogDescription>Update unit details or shift tenant.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Bedrooms</Label>
              <Input type="number" value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Rent (KSh)</Label>
              <Input type="number" value={form.rent_amount}
                onChange={(e) => setForm({ ...form, rent_amount: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.occupancy_status} onValueChange={(v) => setForm({ ...form, occupancy_status: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Occupied">Occupied</SelectItem>
                  <SelectItem value="Unoccupied">Unoccupied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={saveUnit} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </div>

        {currentTenant && (
          <div className="mt-4 border-t pt-4 space-y-3">
            <div className="text-sm text-muted-foreground">Shift tenant <span className="font-medium text-foreground">{currentTenant}</span> to another unit</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Label>Target Vacant Unit</Label>
                <Select value={targetUnit} onValueChange={setTargetUnit}>
                  <SelectTrigger><SelectValue placeholder="Select vacant unit" /></SelectTrigger>
                  <SelectContent>
                    {vacantUnits.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">No vacant units</div>
                    ) : (
                      vacantUnits.map((hn) => (
                        <SelectItem key={hn} value={hn}>{hn}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="secondary" className="w-full" onClick={shiftTenant} disabled={loading || !targetUnit}>
                  {loading ? 'Shifting...' : 'Shift Tenant'}
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export default EditUnitDialog;
