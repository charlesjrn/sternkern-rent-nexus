import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, DollarSign } from 'lucide-react';
import BackButton from '@/components/Layout/BackButton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GenerateInvoiceDialog from '@/components/dialogs/GenerateInvoiceDialog';

interface InvoiceRec {
  id: number;
  tenant_name: string | null;
  house_number: string | null;
  total_due: number | null;
  billing_month: string | null;
  payment_status: string | null;
  invoice_id: string | null;
}

const Invoices = () => {
  const [invoices, setInvoices] = useState<InvoiceRec[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase.from('invoices').select('*').order('date_generated', { ascending: false });
      if (error) throw error;
      setInvoices(data || []);
    } catch (err) {
      console.error('Fetch invoices error:', err);
      toast({ title: 'Error', description: 'Failed to fetch invoices', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="space-y-6">
      <BackButton />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Invoices Management</h1>
          <p className="text-muted-foreground">Generate and track tenant invoices</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <GenerateInvoiceDialog mode="single" onSuccess={fetchInvoices} />
          <GenerateInvoiceDialog mode="bulk" onSuccess={fetchInvoices} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <CardTitle>{invoice.invoice_id || `INV-${invoice.id}`}</CardTitle>
                  </div>
                  <Badge 
                    variant={invoice.payment_status === 'Paid' ? 'default' : invoice.payment_status === 'Overdue' ? 'destructive' : 'secondary'}
                  >
                    {invoice.payment_status}
                  </Badge>
                </div>
                <CardDescription>{invoice.tenant_name || '—'} - Unit {invoice.house_number || '-'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">KSh {(invoice.total_due || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Billing Month: {invoice.billing_month || ''}</span>
                  </div>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Invoice
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Send Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invoices;
