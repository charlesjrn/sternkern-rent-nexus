import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, Calendar, DollarSign, User, Plus } from 'lucide-react';

const Maintenance = () => {
  const requests = [
    { 
      id: 1, 
      unit: 'A1', 
      tenant: 'John Doe',
      description: 'Leaking kitchen faucet',
      status: 'Completed',
      contractor: 'Mike\'s Plumbing',
      cost: 2500,
      date: '2024-01-15'
    },
    { 
      id: 2, 
      unit: 'B1', 
      tenant: 'Jane Smith',
      description: 'Broken window in bedroom',
      status: 'In Progress',
      contractor: 'Glass Masters',
      cost: 4500,
      date: '2024-01-20'
    },
    { 
      id: 3, 
      unit: 'C2', 
      tenant: 'Bob Wilson',
      description: 'Electrical outlet not working',
      status: 'Pending',
      contractor: null,
      cost: null,
      date: '2024-01-22'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Management</h1>
          <p className="text-muted-foreground">Track maintenance requests and repairs</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Request
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Wrench className="w-5 h-5 text-primary" />
                  <CardTitle>Unit {request.unit}</CardTitle>
                </div>
                <Badge 
                  variant={
                    request.status === 'Completed' ? 'default' : 
                    request.status === 'In Progress' ? 'secondary' : 'destructive'
                  }
                >
                  {request.status}
                </Badge>
              </div>
              <CardDescription>{request.tenant}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">{request.description}</p>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Reported: {request.date}</span>
                </div>
                
                {request.contractor && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{request.contractor}</span>
                  </div>
                )}
                
                {request.cost && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">KSh {request.cost.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Update Status
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Maintenance;