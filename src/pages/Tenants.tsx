import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Mail, Phone, Home, Plus } from 'lucide-react';

const Tenants = () => {
  const tenants = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      phone: '+254 700 123 456', 
      unit: 'A1', 
      status: 'Active',
      arrears: 0
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      phone: '+254 700 789 012', 
      unit: 'B1', 
      status: 'Active',
      arrears: 5000
    },
    { 
      id: 3, 
      name: 'Bob Wilson', 
      email: 'bob@example.com', 
      phone: '+254 700 345 678', 
      unit: 'C2', 
      status: 'Late Payment',
      arrears: 15000
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tenants Management</h1>
          <p className="text-muted-foreground">Manage tenant information and communication</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <CardTitle>{tenant.name}</CardTitle>
                </div>
                <Badge 
                  variant={
                    tenant.status === 'Active' ? 'default' : 
                    tenant.status === 'Late Payment' ? 'destructive' : 'secondary'
                  }
                >
                  {tenant.status}
                </Badge>
              </div>
              <CardDescription>Tenant in Unit {tenant.unit}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{tenant.email}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{tenant.phone}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Unit {tenant.unit}</span>
                </div>
              </div>

              {tenant.arrears > 0 && (
                <div className="bg-destructive/10 p-3 rounded-md">
                  <p className="text-sm font-medium text-destructive">
                    Arrears: KSh {tenant.arrears.toLocaleString()}
                  </p>
                </div>
              )}
              
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Send Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tenants;