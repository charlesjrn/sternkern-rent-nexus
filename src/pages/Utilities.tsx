import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Droplets, Trash2 } from 'lucide-react';
import BackButton from '@/components/Layout/BackButton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';


interface UtilityRec {
  id: number;
  house_number: string | null;
  tenant_name: string | null;
  electricity: number | null;
  water: number | null;
  garbage: number | null;
  other_utilities: number | null;
  billing_month: string | null;
}

const Utilities = () => {
  const [utilities, setUtilities] = useState<UtilityRec[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUtilities = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('id, house_number, tenant_name, electricity, water, garbage, other_utilities, billing_month')
        .order('billing_month', { ascending: false });
      if (error) throw error;
      setUtilities(data || []);
    } catch (err) {
      console.error('Fetch utilities error:', err);
      toast({ title: 'Error', description: 'Failed to fetch utilities', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilities();
  }, []);

  return (
    <div className="space-y-6">
      <BackButton />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Utilities Management</h1>
          <p className="text-muted-foreground">Track and manage utility costs for each unit</p>
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
          {utilities.map((utility) => (
            <Card key={utility.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Unit {utility.house_number || '-'}</CardTitle>
                <CardDescription>{utility.tenant_name || '—'} • {utility.billing_month}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Electricity</span>
                    </div>
                    <span className="font-medium">KSh {(utility.electricity || 0).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Water</span>
                    </div>
                    <span className="font-medium">KSh {(utility.water || 0).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trash2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Garbage</span>
                    </div>
                    <span className="font-medium">KSh {(utility.garbage || 0).toLocaleString()}</span>
                  </div>

                  {(utility.other_utilities || 0) > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Other</span>
                      <span className="font-medium">KSh {(utility.other_utilities || 0).toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total</span>
                      <span>KSh {(((utility.electricity || 0) + (utility.water || 0) + (utility.garbage || 0) + (utility.other_utilities || 0))).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Utilities;
