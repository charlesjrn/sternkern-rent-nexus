import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddTenantDialogProps {
  onSuccess?: () => void;
}

const AddTenantDialog: React.FC<AddTenantDialogProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    unit: '',
    leaseStart: '',
    idNumber: ''
  });
const { toast } = useToast();
const [availableUnits, setAvailableUnits] = useState<string[]>([]);

React.useEffect(() => {
  const loadUnits = async () => {
    const { data, error } = await supabase
      .from('units')
      .select('house_number')
      .eq('occupancy_status', 'Unoccupied')
      .order('house_number', { ascending: true });
    if (!error) {
      setAvailableUnits((data || []).map(u => u.house_number).filter(Boolean) as string[]);
    }
  };
  loadUnits();
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Insert tenant
      const { error: insertError } = await supabase
        .from('tenants')
        .insert([{ 
          tenant_name: formData.name,
          contact_number: formData.phone,
          email: formData.email,
          house_number: formData.unit
        }]);
      if (insertError) throw insertError;

      // Mark unit as occupied
      const { error: unitError } = await supabase
        .from('units')
        .update({ occupancy_status: 'Occupied' })
        .eq('house_number', formData.unit);
      if (unitError) throw unitError;

      toast({
        title: "Tenant Added",
        description: `${formData.name} has been added successfully.`
      });
      
      setOpen(false);
      setFormData({ name: '', phone: '', email: '', unit: '', leaseStart: '', idNumber: '' });
      onSuccess?.();
    } catch (error) {
      console.error('Error adding tenant:', error);
      toast({
        title: "Error",
        description: "Failed to add tenant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Tenant
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Tenant</DialogTitle>
          <DialogDescription>
            Register a new tenant for your property
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="idNumber">ID Number</Label>
            <Input
              id="idNumber"
              value={formData.idNumber}
              onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {availableUnits.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No vacant units</div>
                ) : (
                  availableUnits.map((hn) => (
                    <SelectItem key={hn} value={hn}>{hn}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="leaseStart">Lease Start Date</Label>
            <Input
              id="leaseStart"
              type="date"
              value={formData.leaseStart}
              onChange={(e) => setFormData({...formData, leaseStart: e.target.value})}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Tenant'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTenantDialog;