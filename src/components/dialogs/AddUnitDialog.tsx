import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddUnitDialogProps {
  onSuccess?: () => void;
}

const AddUnitDialog: React.FC<AddUnitDialogProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    houseNumber: '',
    bedrooms: '',
    rentAmount: '',
    status: 'Unoccupied'
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('units')
        .insert([{
          house_number: formData.houseNumber,
          bedrooms: parseInt(formData.bedrooms),
          rent_amount: parseFloat(formData.rentAmount),
          occupancy_status: formData.status
        }]);

      if (error) throw error;

      toast({
        title: "Unit Added",
        description: `Unit ${formData.houseNumber} has been added successfully.`
      });
      
      setOpen(false);
      setFormData({ houseNumber: '', bedrooms: '', rentAmount: '', status: 'Unoccupied' });
      onSuccess?.();
    } catch (error) {
      console.error('Error adding unit:', error);
      toast({
        title: "Error",
        description: "Failed to add unit. Please try again.",
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
          Add Unit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Unit</DialogTitle>
          <DialogDescription>
            Create a new rental unit in your property
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="houseNumber">House Number</Label>
            <Input
              id="houseNumber"
              value={formData.houseNumber}
              onChange={(e) => setFormData({...formData, houseNumber: e.target.value})}
              placeholder="A1, B2, etc."
              required
            />
          </div>
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Select value={formData.bedrooms} onValueChange={(value) => setFormData({...formData, bedrooms: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4">4+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="rentAmount">Rent Amount (KSh)</Label>
            <Input
              id="rentAmount"
              type="number"
              value={formData.rentAmount}
              onChange={(e) => setFormData({...formData, rentAmount: e.target.value})}
              placeholder="25000"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Unit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUnitDialog;