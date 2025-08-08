import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, Calendar, DollarSign, Plus } from 'lucide-react';
import BackButton from '@/components/Layout/BackButton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AddMaintenanceDialog from '@/components/dialogs/AddMaintenanceDialog';

interface MaintRec {
  id: number;
  house_number: string | null;
  contractor_name: string | null;
  date_of_maintenance: string | null;
  cost: number | null;
  description: string | null;
  status: string | null;
}

const Maintenance = () => {
  const [requests, setRequests] = useState<MaintRec[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase.from('maintenance').select('*').order('date_of_maintenance', { ascending: false });
      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('Fetch maintenance error:', err);
      toast({ title: 'Error', description: 'Failed to fetch maintenance', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const markCompleted = async (id: number) => {
    try {
      const { error } = await supabase.from('maintenance').update({ status: 'Completed' }).eq('id', id);
      if (error) throw error;
      toast({ title: 'Updated', description: 'Status set to Completed.' });
      fetchRequests();
    } catch (err) {
      console.error('Update status error:', err);
      toast({ title: 'Failed', description: 'Could not update status.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <BackButton />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Management</h1>
          <p className="text-muted-foreground">Track maintenance requests and repairs</p>
        </div>
        <AddMaintenanceDialog onSuccess={fetchRequests} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <Wrench className="w-5 h-5 text-primary" />
                    <CardTitle>Unit {request.house_number || '-'}</CardTitle>
                  </div>
                  <Badge 
                    variant={request.status === 'Completed' ? 'default' : request.status === 'In Progress' ? 'secondary' : 'destructive'}
                  >
                    {request.status}
                  </Badge>
                </div>
                <CardDescription>{request.date_of_maintenance || ''}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">{request.description}</p>
                  {request.contractor_name && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Contractor:</span>
                      <span className="text-sm">{request.contractor_name}</span>
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
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => markCompleted(request.id)}>
                    Mark Completed
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

export default Maintenance;
