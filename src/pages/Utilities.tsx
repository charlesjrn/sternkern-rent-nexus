import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Droplets, Trash2, Plus } from 'lucide-react';
import BackButton from '@/components/Layout/BackButton';

const Utilities = () => {
  const utilities = [
    { 
      id: 1, 
      unit: 'A1', 
      tenant: 'John Doe',
      electricity: 2500,
      water: 800,
      garbage: 300,
      month: 'January 2024'
    },
    { 
      id: 2, 
      unit: 'B1', 
      tenant: 'Jane Smith',
      electricity: 3200,
      water: 1200,
      garbage: 300,
      month: 'January 2024'
    },
    { 
      id: 3, 
      unit: 'C2', 
      tenant: 'Bob Wilson',
      electricity: 2800,
      water: 950,
      garbage: 300,
      month: 'January 2024'
    },
  ];

  return (
    <div className="space-y-6">
      <BackButton />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Utilities Management</h1>
          <p className="text-muted-foreground">Track and manage utility costs for each unit</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Utility Record
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {utilities.map((utility) => (
          <Card key={utility.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Unit {utility.unit}</CardTitle>
              <CardDescription>{utility.tenant} - {utility.month}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Electricity</span>
                  </div>
                  <span className="font-medium">KSh {utility.electricity.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Water</span>
                  </div>
                  <span className="font-medium">KSh {utility.water.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trash2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Garbage</span>
                  </div>
                  <span className="font-medium">KSh {utility.garbage.toLocaleString()}</span>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span>KSh {(utility.electricity + utility.water + utility.garbage).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Utilities;