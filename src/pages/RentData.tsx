import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';

interface Row {
  house_number: string;
  tenant_name: string;
  contact: string;
  previous_arrears: number;
  current_rent: number;
  latest_paid_amount: number;
  latest_payment_method: string;
  balance: number;
}

const RentData: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: units } = await supabase
          .from('units')
          .select('house_number, rent_amount, occupancy_status')
          .eq('occupancy_status', 'Occupied');
        const houses = (units || []).map((u: any) => u.house_number);

        const [{ data: tenants }, { data: payments }, { data: invoices }] = await Promise.all([
          supabase.from('tenants').select('house_number, tenant_name, contact_number').in('house_number', houses),
          supabase
            .from('payments')
            .select('house_number, payment_method, amount_paid, payment_date')
            .in('house_number', houses)
            .order('payment_date', { ascending: false }),
          supabase
            .from('invoices')
            .select('house_number, amount_due, billing_month')
            .in('house_number', houses),
        ]);

        const monthStart = new Date();
        monthStart.setDate(1);
        const monthStartStr = monthStart.toISOString().slice(0, 10);

        const latestPayByHouse = new Map<string, any>();
        (payments || []).forEach((p: any) => {
          if (!latestPayByHouse.has(p.house_number)) latestPayByHouse.set(p.house_number, p);
        });

        const arrearsByHouse = new Map<string, number>();
        (invoices || []).forEach((inv: any) => {
          const beforeCurrent = (inv.billing_month || '') < monthStartStr;
          if (beforeCurrent && Number(inv.amount_due || 0) > 0) {
            arrearsByHouse.set(
              inv.house_number,
              (arrearsByHouse.get(inv.house_number) || 0) + Number(inv.amount_due)
            );
          }
        });

        const rowsBuilt: Row[] = (units || []).map((u: any) => {
          const t = (tenants || []).find((x: any) => x.house_number === u.house_number);
          const latest = latestPayByHouse.get(u.house_number);
          const arrears = arrearsByHouse.get(u.house_number) || 0;
          const latestAmt = Number(latest?.amount_paid || 0);
          const currentRent = Number(u.rent_amount || 0);
          const balance = arrears + currentRent - latestAmt;
          return {
            house_number: u.house_number,
            tenant_name: t?.tenant_name || '—',
            contact: t?.contact_number || '—',
            previous_arrears: arrears,
            current_rent: currentRent,
            latest_paid_amount: latestAmt,
            latest_payment_method: latest?.payment_method || '—',
            balance,
          } as Row;
        });
        setRows(rowsBuilt);
      } catch (e) {
        console.error('Failed to load rent data', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rent Data</h1>
          <p className="text-muted-foreground">Overview of arrears, current rent, latest payments and balances</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Houses Summary</CardTitle>
          <CardDescription>House number, tenant details and balances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>House #</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Prev. Arrears (KSh)</TableHead>
                  <TableHead className="text-right">Current Rent (KSh)</TableHead>
                  <TableHead className="text-right">Latest Paid (KSh)</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Balance (KSh)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">Loading...</TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">No data found.</TableCell>
                  </TableRow>
                ) : (
                  rows.map((r) => (
                    <TableRow key={r.house_number}>
                      <TableCell>{r.house_number}</TableCell>
                      <TableCell>{r.tenant_name}</TableCell>
                      <TableCell>{r.contact}</TableCell>
                      <TableCell className="text-right">{r.previous_arrears.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.current_rent.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.latest_paid_amount.toLocaleString()}</TableCell>
                      <TableCell>{r.latest_payment_method}</TableCell>
                      <TableCell className="text-right font-medium">{r.balance.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentData;
