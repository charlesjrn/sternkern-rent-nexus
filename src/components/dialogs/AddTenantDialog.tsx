import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddTenantDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    unit: '',
    leaseStart: '',
    idNumber: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add to database
    toast({
      title: "Tenant Added",
      description: `${formData.name} has been added successfully.`
    });
    setOpen(false);
    setFormData({ name: '', phone: '', email: '', unit: '', leaseStart: '', idNumber: '' });
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
                <SelectItem value="A1">A1</SelectItem>
                <SelectItem value="A2">A2</SelectItem>
                <SelectItem value="B1">B1</SelectItem>
                <SelectItem value="B2">B2</SelectItem>
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
            <Button type="submit">Add Tenant</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTenantDialog;