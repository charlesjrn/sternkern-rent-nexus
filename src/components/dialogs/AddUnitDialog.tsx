import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddUnitDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    houseNumber: '',
    bedrooms: '',
    rentAmount: '',
    status: 'Unoccupied'
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add to database
    toast({
      title: "Unit Added",
      description: `Unit ${formData.houseNumber} has been added successfully.`
    });
    setOpen(false);
    setFormData({ houseNumber: '', bedrooms: '', rentAmount: '', status: 'Unoccupied' });
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
            <Button type="submit">Add Unit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUnitDialog;