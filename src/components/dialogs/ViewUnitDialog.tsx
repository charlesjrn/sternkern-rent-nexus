import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Home } from 'lucide-react';

interface Unit {
  id: number;
  house_number: string;
  bedrooms: number;
  rent_amount: number;
  occupancy_status: string;
}

interface ViewUnitDialogProps {
  unit: Unit;
}

const ViewUnitDialog: React.FC<ViewUnitDialogProps> = ({ unit }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">View Details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unit {unit.house_number} Details</DialogTitle>
          <DialogDescription>Overview of unit information</DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Bedrooms</span>
              </div>
              <span className="font-medium">{unit.bedrooms}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Rent</span>
              </div>
              <span className="font-medium">KSh {Number(unit.rent_amount || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Status</span>
              <span className="font-medium">{unit.occupancy_status}</span>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUnitDialog;
