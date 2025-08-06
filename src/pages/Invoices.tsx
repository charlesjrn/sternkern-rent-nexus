import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, DollarSign, Plus } from 'lucide-react';

const Invoices = () => {
  const invoices = [
    { 
      id: 'INV-001', 
      tenant: 'John Doe', 
      unit: 'A1', 
      amount: 25000, 
      dueDate: '2024-01-31',
      status: 'Paid',
      billingMonth: 'January 2024'
    },
    { 
      id: 'INV-002', 
      tenant: 'Jane Smith', 
      unit: 'B1', 
      amount: 35000, 
      dueDate: '2024-01-31',
      status: 'Overdue',
      billingMonth: 'January 2024'
    },
    { 
      id: 'INV-003', 
      tenant: 'Bob Wilson', 
      unit: 'C2', 
      amount: 28000, 
      dueDate: '2024-02-29',
      status: 'Pending',
      billingMonth: 'February 2024'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoices Management</h1>
          <p className="text-muted-foreground">Generate and track tenant invoices</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Generate Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <CardTitle>{invoice.id}</CardTitle>
                </div>
                <Badge 
                  variant={
                    invoice.status === 'Paid' ? 'default' : 
                    invoice.status === 'Overdue' ? 'destructive' : 'secondary'
                  }
                >
                  {invoice.status}
                </Badge>
              </div>
              <CardDescription>{invoice.tenant} - Unit {invoice.unit}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">KSh {invoice.amount.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Due: {invoice.dueDate}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{invoice.billingMonth}</span>
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
    </div>
  );
};

export default Invoices;