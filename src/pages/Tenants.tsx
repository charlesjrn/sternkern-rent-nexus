import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Mail, Phone, Home } from 'lucide-react';
import BackButton from '@/components/Layout/BackButton';
import AddTenantDialog from '@/components/dialogs/AddTenantDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Tenant {
  id: number;
  tenant_name: string;
  email: string | null;
  contact_number: string | null;
  house_number: string | null;
  arrears: number | null;
}

const Tenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('tenant_name');

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tenants",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackButton />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tenants Management</h1>
          <p className="text-muted-foreground">Manage tenant information and communication</p>
        </div>
        <AddTenantDialog onSuccess={fetchTenants} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <CardTitle>{tenant.tenant_name}</CardTitle>
                </div>
                <Badge 
                  variant={
                    (tenant.arrears || 0) === 0 ? 'default' : 
                    (tenant.arrears || 0) > 10000 ? 'destructive' : 'secondary'
                  }
                >
                  {(tenant.arrears || 0) === 0 ? 'Active' : 
                   (tenant.arrears || 0) > 10000 ? 'Late Payment' : 'Active'}
                </Badge>
              </div>
              <CardDescription>Tenant in Unit {tenant.house_number}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {tenant.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{tenant.email}</span>
                  </div>
                )}
                
                {tenant.contact_number && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{tenant.contact_number}</span>
                  </div>
                )}
                
                {tenant.house_number && (
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Unit {tenant.house_number}</span>
                  </div>
                )}
              </div>

              {(tenant.arrears || 0) > 0 && (
                <div className="bg-destructive/10 p-3 rounded-md">
                  <p className="text-sm font-medium text-destructive">
                    Arrears: KSh {(tenant.arrears || 0).toLocaleString()}
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