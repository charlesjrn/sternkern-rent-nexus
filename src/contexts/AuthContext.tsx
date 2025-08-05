import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: number;
  username: string;
  role: 'landlord' | 'caretaker' | 'tenant';
  contact?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    console.log('AuthContext: Checking for stored user...');
    const storedUser = localStorage.getItem('sternkern-user');
    if (storedUser) {
      console.log('AuthContext: Found stored user:', JSON.parse(storedUser));
      setUser(JSON.parse(storedUser));
    } else {
      console.log('AuthContext: No stored user found');
    }
    setLoading(false);
    console.log('AuthContext: Loading complete');
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log('AuthContext: Attempting login with:', { username, password });
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      console.log('AuthContext: Supabase response:', { data, error });

      if (error || !data) {
        console.log('AuthContext: Login failed - no data or error:', error);
        return { success: false, error: 'Invalid username or password' };
      }

      const userData: User = {
        id: data.id,
        username: data.username,
        role: data.role as 'landlord' | 'caretaker' | 'tenant',
        contact: data.contact
      };

      setUser(userData);
      localStorage.setItem('sternkern-user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sternkern-user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};