import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddPaymentDialogProps {
  onSuccess?: () => void;
}

const AddPaymentDialog: React.FC<AddPaymentDialogProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tenantName: '',
    houseNumber: '',
    amountPaid: '',
    paymentMethod: '',
    invoiceId: '',
    paymentDate: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('payments')
        .insert([{
          tenant_name: formData.tenantName,
          house_number: formData.houseNumber,
          amount_paid: parseFloat(formData.amountPaid),
          payment_method: formData.paymentMethod,
          invoice_id: formData.invoiceId || null,
          payment_date: formData.paymentDate
        }]);

      if (error) throw error;

      toast({
        title: "Payment Recorded",
        description: `Payment of KSh ${parseFloat(formData.amountPaid).toLocaleString()} has been recorded successfully.`
      });
      
      setOpen(false);
      setFormData({
        tenantName: '',
        houseNumber: '',
        amountPaid: '',
        paymentMethod: '',
        invoiceId: '',
        paymentDate: new Date().toISOString().split('T')[0]
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
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
          Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record New Payment</DialogTitle>
          <DialogDescription>
            Record a payment received from a tenant
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tenantName">Tenant Name</Label>
              <Input
                id="tenantName"
                value={formData.tenantName}
                onChange={(e) => setFormData({...formData, tenantName: e.target.value})}
                required
              />
            </div>
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
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amountPaid">Amount Paid (KSh)</Label>
              <Input
                id="amountPaid"
                type="number"
                step="0.01"
                value={formData.amountPaid}
                onChange={(e) => setFormData({...formData, amountPaid: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="invoiceId">Invoice ID (Optional)</Label>
              <Input
                id="invoiceId"
                value={formData.invoiceId}
                onChange={(e) => setFormData({...formData, invoiceId: e.target.value})}
                placeholder="INV-001"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentDialog;