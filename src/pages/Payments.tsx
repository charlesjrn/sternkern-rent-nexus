import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Calendar, DollarSign, User, Plus } from 'lucide-react';

const Payments = () => {
  const payments = [
    { 
      id: 1, 
      tenant: 'John Doe',
      unit: 'A1',
      amount: 25000,
      method: 'M-Pesa',
      reference: 'MP240115001',
      date: '2024-01-15',
      status: 'Confirmed'
    },
    { 
      id: 2, 
      tenant: 'Jane Smith',
      unit: 'B1',
      amount: 35000,
      method: 'Bank Transfer',
      reference: 'BT240120001',
      date: '2024-01-20',
      status: 'Pending'
    },
    { 
      id: 3, 
      tenant: 'Bob Wilson',
      unit: 'C2',
      amount: 15000,
      method: 'Cash',
      reference: 'CASH240122001',
      date: '2024-01-22',
      status: 'Confirmed'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payments Management</h1>
          <p className="text-muted-foreground">Track and manage tenant payments</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Record Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {payments.map((payment) => (
          <Card key={payment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <CardTitle>{payment.reference}</CardTitle>
                </div>
                <Badge 
                  variant={payment.status === 'Confirmed' ? 'default' : 'secondary'}
                >
                  {payment.status}
                </Badge>
              </div>
              <CardDescription>{payment.tenant} - Unit {payment.unit}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Amount</span>
                  </div>
                  <span className="font-medium">KSh {payment.amount.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Method</span>
                  </div>
                  <span className="text-sm">{payment.method}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Date</span>
                  </div>
                  <span className="text-sm">{payment.date}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Receipt
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Send Confirmation
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Payments;