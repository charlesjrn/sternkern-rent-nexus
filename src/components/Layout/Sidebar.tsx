import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Building, 
  Users, 
  FileText, 
  Wrench, 
  CreditCard, 
  BarChart3, 
  Home,
  Settings,
  Zap,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  roles: string[];
}

const navigationItems: NavItem[] = [
  { label: 'Dashboard', icon: Home, href: '/', roles: ['landlord', 'caretaker', 'tenant'] },
  { label: 'Units', icon: Building, href: '/units', roles: ['landlord', 'caretaker'] },
  { label: 'Tenants', icon: Users, href: '/tenants', roles: ['landlord', 'caretaker'] },
  { label: 'Inventory', icon: Package, href: '/inventory', roles: ['landlord', 'caretaker'] },
  { label: 'Invoices', icon: FileText, href: '/invoices', roles: ['landlord', 'caretaker', 'tenant'] },
  { label: 'Utilities', icon: Zap, href: '/utilities', roles: ['landlord', 'caretaker'] },
  { label: 'Maintenance', icon: Wrench, href: '/maintenance', roles: ['landlord', 'caretaker', 'tenant'] },
  { label: 'Payments', icon: CreditCard, href: '/payments', roles: ['landlord', 'caretaker', 'tenant'] },
  { label: 'Reports', icon: BarChart3, href: '/reports', roles: ['landlord'] },
  { label: 'Settings', icon: Settings, href: '/settings', roles: ['landlord'] },
];

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [activeItem, setActiveItem] = React.useState(window.location.pathname);

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const handleItemClick = (href: string) => {
    setActiveItem(href);
    window.location.href = href;
    if (onClose) onClose();
  };

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
              STERNKERN
            </h1>
            <p className="text-xs text-muted-foreground">Property Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.href;
            
            return (
              <li key={item.href}>
                <button
                  onClick={() => handleItemClick(item.href)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                    isActive 
                      ? "bg-gradient-primary text-white shadow-card" 
                      : "text-foreground hover:bg-accent/10 hover:text-accent"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground")} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user?.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.username}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;