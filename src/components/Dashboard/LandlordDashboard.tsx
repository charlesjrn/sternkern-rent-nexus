import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, FileText, TrendingUp, AlertTriangle, DollarSign, Wrench } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUnits: number;
  occupiedUnits: number;
  totalTenants: number;
  monthlyRevenue: number;
  pendingMaintenance: number;
  totalArrears: number;
}

interface ActivityItem {
  type: 'payment' | 'maintenance' | 'tenant';
  title: string;
  description: string;
  timestamp: string; // ISO string
  color: string;
}

interface UpcomingItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  colorClasses: string;
}

const LandlordDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUnits: 0,
    occupiedUnits: 0,
    totalTenants: 0,
    monthlyRevenue: 0,
    pendingMaintenance: 0,
    totalArrears: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Units
        const { data: units } = await supabase.from('units').select('house_number, occupancy_status');
        const totalUnits = units?.length || 0;
        const occupiedUnits = (units || []).filter(u => u.occupancy_status === 'Occupied').length;

        // Tenants
        const { data: tenants } = await supabase.from('tenants').select('id, arrears');
        const totalTenants = tenants?.length || 0;
        const totalArrears = (tenants || []).reduce((sum: number, t: any) => sum + Number(t.arrears || 0), 0);

        // Monthly revenue = sum of payments in current month
        const start = new Date();
        start.setDate(1);
        const monthStart = start.toISOString().slice(0, 10);
        const nextMonthStart = new Date(start.getFullYear(), start.getMonth() + 1, 1).toISOString().slice(0, 10);
        const { data: monthPayments } = await supabase
          .from('payments')
          .select('amount_paid')
          .gte('payment_date', monthStart)
          .lt('payment_date', nextMonthStart);
        const monthlyRevenue = (monthPayments || []).reduce((sum: number, p: any) => sum + Number(p.amount_paid || 0), 0);

        // Pending maintenance
        const { data: maint } = await supabase.from('maintenance').select('id').eq('status', 'Pending');
        const pendingMaintenance = maint?.length || 0;

        setStats({ totalUnits, occupiedUnits, totalTenants, monthlyRevenue, pendingMaintenance, totalArrears });

        // Recent Activities (combine payments + maintenance)
        const [paymentsRes, maintenanceRes] = await Promise.all([
          supabase
            .from('payments')
            .select('tenant_name, house_number, amount_paid, payment_date')
            .order('payment_date', { ascending: false })
            .limit(5),
          supabase
            .from('maintenance')
            .select('house_number, description, date_of_maintenance, status')
            .order('date_of_maintenance', { ascending: false })
            .limit(5),
        ]);

        const paymentActs: ActivityItem[] = (paymentsRes.data || []).map((p: any) => ({
          type: 'payment',
          title: 'Payment received',
          description: `${p.house_number || '—'} - KSh ${Number(p.amount_paid || 0).toLocaleString()}`,
          timestamp: p.payment_date || new Date().toISOString(),
          color: 'bg-green-500',
        }));
        const maintActs: ActivityItem[] = (maintenanceRes.data || []).map((m: any) => ({
          type: 'maintenance',
          title: 'Maintenance update',
          description: `${m.house_number || '—'} - ${m.description || 'Maintenance'}`,
          timestamp: m.date_of_maintenance || new Date().toISOString(),
          color: 'bg-yellow-500',
        }));

        const allActs = [...paymentActs, ...maintActs].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ).slice(0, 6);
        setActivities(allActs);

        // Upcoming: overdue invoices, generate invoices, vacant units
        const { data: overdue } = await supabase
          .from('invoices')
          .select('id')
          .lt('billing_month', monthStart)
          .gt('amount_due', 0);
        const overdueCount = overdue?.length || 0;

        const vacantCount = Math.max(totalUnits - occupiedUnits, 0);

        const upcomingItems: UpcomingItem[] = [
          {
            icon: AlertTriangle,
            title: 'Overdue Rent',
            description: `${overdueCount} tenant(s) have overdue payments`,
            colorClasses: 'border-red-200 bg-red-50 text-red-700',
          },
          {
            icon: FileText,
            title: 'Generate Invoices',
            description: `Prepare monthly invoices for ${new Date().toLocaleString('default', { month: 'long' })}`,
            colorClasses: 'border-yellow-200 bg-yellow-50 text-yellow-700',
          },
          {
            icon: Building,
            title: 'Vacant Units',
            description: `${vacantCount} unit(s) available for rent`,
            colorClasses: 'border-blue-200 bg-blue-50 text-blue-700',
          },
        ];
        setUpcoming(upcomingItems);
      } catch (e) {
        console.error('Error loading dashboard:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const occupancyRate = useMemo(() => {
    if (!stats.totalUnits) return 0;
    return Math.round((stats.occupiedUnits / stats.totalUnits) * 100);
  }, [stats.totalUnits, stats.occupiedUnits]);

  const statsCards = [
    { title: 'Total Units', value: stats.totalUnits, description: `${stats.occupiedUnits} occupied`, icon: Building, color: 'bg-gradient-primary' },
    { title: 'Active Tenants', value: stats.totalTenants, description: 'Current residents', icon: Users, color: 'bg-gradient-accent' },
    { title: 'Monthly Revenue', value: `KES ${stats.monthlyRevenue.toLocaleString()}`, description: 'Payments this month', icon: DollarSign, color: 'bg-green-500' },
    { title: 'Total Arrears', value: `KES ${stats.totalArrears.toLocaleString()}`, description: 'Outstanding balance', icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'Pending Maintenance', value: stats.pendingMaintenance, description: 'Requires attention', icon: Wrench, color: 'bg-yellow-500' },
    { title: 'Occupancy Rate', value: `${occupancyRate}%`, description: `${stats.occupiedUnits}/${stats.totalUnits} units`, icon: TrendingUp, color: 'bg-blue-500' },
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's your property overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="overflow-hidden hover:shadow-card transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold mt-2 truncate">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest property management activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              )}
              {activities.map((a, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.color}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{a.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {new Date(a.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Actions</CardTitle>
            <CardDescription>Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcoming.map((u, idx) => (
                <div key={idx} className={`flex items-center space-x-3 p-3 rounded-lg border ${u.colorClasses.replace('text-', 'border-')}`}>
                  <u.icon className={`w-4 h-4 ${u.colorClasses.split(' ').find(c => c.startsWith('text-'))} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${u.colorClasses.split(' ').find(c => c.startsWith('text-'))}`}>{u.title}</p>
                    <p className={`text-xs ${u.colorClasses.split(' ').find(c => c.startsWith('text-'))?.replace('700', '600')}`}>{u.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandlordDashboard;
