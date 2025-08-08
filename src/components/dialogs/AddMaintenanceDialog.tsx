import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddMaintenanceDialogProps {
  onSuccess?: () => void;
}

const AddMaintenanceDialog: React.FC<AddMaintenanceDialogProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    house_number: '',
    description: '',
    status: 'Pending',
    contractor_name: '',
    cost: '',
    date_of_maintenance: new Date().toISOString().slice(0, 10)
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
        house_number: formData.house_number || null,
        description: formData.description || null,
        status: formData.status,
        contractor_name: formData.contractor_name || null,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        date_of_maintenance: formData.date_of_maintenance || null,
      };

      const { error } = await supabase.from('maintenance').insert([payload]);
      if (error) throw error;

      toast({ title: 'Request Added', description: 'Maintenance request recorded successfully.' });
      setOpen(false);
      setFormData({ house_number: '', description: '', status: 'Pending', contractor_name: '', cost: '', date_of_maintenance: new Date().toISOString().slice(0, 10) });
      onSuccess?.();
    } catch (err) {
      console.error('Error adding maintenance:', err);
      toast({ title: 'Failed to Save', description: 'Could not save maintenance request.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Request
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Maintenance Request</DialogTitle>
          <DialogDescription>Log a new maintenance task for a unit.</DialogDescription>
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
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contractor_name">Contractor (optional)</Label>
              <Input id="contractor_name" value={formData.contractor_name} onChange={(e) => setFormData({ ...formData, contractor_name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cost">Cost (KSh)</Label>
              <Input id="cost" type="number" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} />
            </div>
          </div>

          <div>
            <Label htmlFor="date_of_maintenance">Date</Label>
            <Input id="date_of_maintenance" type="date" value={formData.date_of_maintenance} onChange={(e) => setFormData({ ...formData, date_of_maintenance: e.target.value })} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Request'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMaintenanceDialog;
