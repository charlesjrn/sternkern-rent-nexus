import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, DollarSign, Users, Building, FileText, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StatItem {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Reports = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [unitsRes, tenantsRes, paymentsRes, invoicesRes] = await Promise.all([
          supabase.from('units').select('id, occupancy_status'),
          supabase.from('tenants').select('id'),
          supabase.from('payments').select('amount_paid, payment_date'),
          supabase.from('invoices').select('amount_due'),
        ]);

        const totalUnits = unitsRes.data?.length || 0;
        const occupiedUnits = (unitsRes.data || []).filter(u => u.occupancy_status === 'Occupied').length;
        const occupancyRate = totalUnits ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
        const activeTenants = tenantsRes.data?.length || 0;
        const totalRevenue = (paymentsRes.data || []).reduce((s: number, p: any) => s + Number(p.amount_paid || 0), 0);
        const outstanding = (invoicesRes.data || []).reduce((s: number, inv: any) => s + Number(inv.amount_due || 0), 0);

        setStats([
          { title: 'Total Revenue', value: `KSh ${totalRevenue.toLocaleString()}`, change: '', icon: DollarSign },
          { title: 'Occupancy Rate', value: `${occupancyRate}%`, change: '', icon: Building },
          { title: 'Active Tenants', value: activeTenants, change: '', icon: Users },
          { title: 'Outstanding', value: `KSh ${outstanding.toLocaleString()}`, change: '', icon: TrendingUp },
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const generateCsv = (rows: Array<Record<string, any>>, filename: string) => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerateReport = async () => {
    try {
      // Example: revenue by month (last 6 months)
      const { data } = await supabase
        .from('payments')
        .select('amount_paid, payment_date')
        .order('payment_date', { ascending: true });

      const byMonth: Record<string, number> = {};
      (data || []).forEach((p: any) => {
        const key = (p.payment_date || '').slice(0, 7);
        byMonth[key] = (byMonth[key] || 0) + Number(p.amount_paid || 0);
      });
      const rows = Object.entries(byMonth).map(([month, revenue]) => ({ Month: month, Revenue: revenue }));
      generateCsv(rows, 'monthly_revenue.csv');
    } catch (e) {
      console.error('Failed to generate report', e);
    }
  };

  const handleDownload = async (name: string) => {
    if (name.includes('Tenant Statement')) {
      const { data } = await supabase
        .from('payments')
        .select('tenant_name, house_number, amount_paid, payment_date')
        .order('payment_date', { ascending: true });
      generateCsv(data || [], 'tenant_statements.csv');
    } else if (name.includes('Maintenance Costs')) {
      const { data } = await supabase
        .from('maintenance')
        .select('house_number, description, cost, date_of_maintenance, status')
        .order('date_of_maintenance', { ascending: true });
      generateCsv(data || [], 'maintenance_costs.csv');
    } else if (name.includes('Occupancy')) {
      const { data } = await supabase.from('units').select('house_number, occupancy_status, bedrooms, rent_amount');
      generateCsv(data || [], 'occupancy_analysis.csv');
    } else {
      await handleGenerateReport();
    }
  };

  const reports = [
    { name: 'Monthly Revenue Report', description: 'Revenue breakdown by month and unit' },
    { name: 'Tenant Statement', description: 'Individual tenant payment history' },
    { name: 'Maintenance Costs', description: 'Maintenance expenses by category' },
    { name: 'Occupancy Analysis', description: 'Unit occupancy trends and patterns' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Financial insights and property performance</p>
        </div>
        <Button onClick={handleGenerateReport}>
          <FileText className="w-4 h-4 mr-2" />
          Generate Report (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(loading ? [1,2,3,4] : stats).map((stat: any, index: number) => {
          const Icon = loading ? BarChart3 : stat.icon;
          return (
            <Card key={index} className={loading ? 'animate-pulse' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>{loading ? 'Loading...' : stat.title}</CardDescription>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '—' : stat.value}</div>
                {!loading && stat.change && (
                  <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Generate or download reports and analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" onClick={() => handleDownload(report.name)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
