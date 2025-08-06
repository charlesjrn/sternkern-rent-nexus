import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Users, DollarSign, Plus } from 'lucide-react';

const Units = () => {
  const units = [
    { id: 1, houseNumber: 'A1', bedrooms: 2, rentAmount: 25000, status: 'Occupied', tenant: 'John Doe' },
    { id: 2, houseNumber: 'A2', bedrooms: 1, rentAmount: 18000, status: 'Unoccupied', tenant: null },
    { id: 3, houseNumber: 'B1', bedrooms: 3, rentAmount: 35000, status: 'Occupied', tenant: 'Jane Smith' },
    { id: 4, houseNumber: 'B2', bedrooms: 2, rentAmount: 25000, status: 'Under Maintenance', tenant: null },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Units Management</h1>
          <p className="text-muted-foreground">Manage your property units and occupancy</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Unit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <Card key={unit.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-primary" />
                  <CardTitle>Unit {unit.houseNumber}</CardTitle>
                </div>
                <Badge 
                  variant={
                    unit.status === 'Occupied' ? 'default' : 
                    unit.status === 'Unoccupied' ? 'secondary' : 'destructive'
                  }
                >
                  {unit.status}
                </Badge>
              </div>
              <CardDescription>{unit.bedrooms} bedroom unit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">KSh {unit.rentAmount.toLocaleString()}/month</span>
              </div>
              
              {unit.tenant && (
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{unit.tenant}</span>
                </div>
              )}
              
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Units;