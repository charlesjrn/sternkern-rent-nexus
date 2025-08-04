import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import LandlordDashboard from '@/components/Dashboard/LandlordDashboard';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading STERNKERN Property Management...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <DashboardLayout>
      {user.role === 'landlord' && <LandlordDashboard />}
      {user.role === 'caretaker' && (
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Caretaker Dashboard</h1>
          <p className="text-muted-foreground">View-only access to property information</p>
        </div>
      )}
      {user.role === 'tenant' && (
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Tenant Portal</h1>
          <p className="text-muted-foreground">View your invoices and submit maintenance requests</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Index;
