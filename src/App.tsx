import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Units from "./pages/Units";
import Tenants from "./pages/Tenants";
import Invoices from "./pages/Invoices";
import Utilities from "./pages/Utilities";
import Maintenance from "./pages/Maintenance";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import RentData from "./pages/RentData";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/units" element={<DashboardLayout><Units /></DashboardLayout>} />
            <Route path="/tenants" element={<DashboardLayout><Tenants /></DashboardLayout>} />
            <Route path="/inventory" element={<DashboardLayout><Inventory /></DashboardLayout>} />
            <Route path="/invoices" element={<DashboardLayout><Invoices /></DashboardLayout>} />
            <Route path="/utilities" element={<DashboardLayout><Utilities /></DashboardLayout>} />
            <Route path="/maintenance" element={<DashboardLayout><Maintenance /></DashboardLayout>} />
            <Route path="/payments" element={<DashboardLayout><Payments /></DashboardLayout>} />
            <Route path="/rent-data" element={<DashboardLayout><RentData /></DashboardLayout>} />
            <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;