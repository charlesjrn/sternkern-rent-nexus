import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, FileText, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUnits: number;
  occupiedUnits: number;
  totalTenants: number;
  monthlyRevenue: number;
  pendingMaintenance: number;
  totalArrears: number;
}

const LandlordDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUnits: 0,
    occupiedUnits: 0,
    totalTenants: 0,
    monthlyRevenue: 0,
    pendingMaintenance: 0,
    totalArrears: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch units data
      const { data: unitsData } = await supabase.from('units').select('*');
      const totalUnits = unitsData?.length || 0;
      const occupiedUnits = unitsData?.filter(unit => unit.occupancy_status === 'Occupied').length || 0;

      // Fetch tenants data
      const { data: tenantsData } = await supabase.from('tenants').select('*');
      const totalTenants = tenantsData?.length || 0;
      const totalArrears = tenantsData?.reduce((sum, tenant) => sum + (tenant.arrears || 0), 0) || 0;

      // Fetch current month revenue
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('total_due')
        .gte('billing_month', currentMonth + '-01')
        .lt('billing_month', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().slice(0, 10));
      
      const monthlyRevenue = invoicesData?.reduce((sum, invoice) => sum + (invoice.total_due || 0), 0) || 0;

      // Fetch pending maintenance
      const { data: maintenanceData } = await supabase
        .from('maintenance')
        .select('*')
        .eq('status', 'Pending');
      const pendingMaintenance = maintenanceData?.length || 0;

      setStats({
        totalUnits,
        occupiedUnits,
        totalTenants,
        monthlyRevenue,
        pendingMaintenance,
        totalArrears
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Units',
      value: stats.totalUnits,
      description: `${stats.occupiedUnits} occupied`,
      icon: Building,
      color: 'bg-gradient-primary'
    },
    {
      title: 'Active Tenants',
      value: stats.totalTenants,
      description: 'Current residents',
      icon: Users,
      color: 'bg-gradient-accent'
    },
    {
      title: 'Monthly Revenue',
      value: `KES ${stats.monthlyRevenue.toLocaleString()}`,
      description: 'Current month',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Arrears',
      value: `KES ${stats.totalArrears.toLocaleString()}`,
      description: 'Outstanding balance',
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      title: 'Pending Maintenance',
      value: stats.pendingMaintenance,
      description: 'Requires attention',
      icon: FileText,
      color: 'bg-yellow-500'
    },
    {
      title: 'Occupancy Rate',
      value: `${Math.round((stats.occupiedUnits / stats.totalUnits) * 100) || 0}%`,
      description: `${stats.occupiedUnits}/${stats.totalUnits} units`,
      icon: TrendingUp,
      color: 'bg-blue-500'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's your property overview.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="overflow-hidden hover:shadow-card transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold mt-2 truncate">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest property management activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Payment received</p>
                  <p className="text-xs text-muted-foreground truncate">House 12A - KES 45,000</p>
                </div>
                <span className="text-xs text-muted-foreground hidden sm:block">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Maintenance request</p>
                  <p className="text-xs text-muted-foreground truncate">House 8B - Plumbing issue</p>
                </div>
                <span className="text-xs text-muted-foreground hidden sm:block">5 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">New tenant</p>
                  <p className="text-xs text-muted-foreground truncate">House 15C - John Doe</p>
                </div>
                <span className="text-xs text-muted-foreground hidden sm:block">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Actions</CardTitle>
            <CardDescription>Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border border-red-200 bg-red-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-700">Overdue Rent</p>
                  <p className="text-xs text-red-600">3 tenants have overdue payments</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                <FileText className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-yellow-700">Generate Invoices</p>
                  <p className="text-xs text-yellow-600">Monthly invoices for January</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
                <Building className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-700">Vacant Units</p>
                  <p className="text-xs text-blue-600">{stats.totalUnits - stats.occupiedUnits} units available for rent</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandlordDashboard;