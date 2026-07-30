'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, role: 'customer' | 'admin', name?: string, phone?: string) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAdmin: false
});

const AUTH_STORAGE_KEY = 'tablevibe_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          // Default demo customer
          setUser({
            id: 'usr-1',
            name: 'Alex Wright',
            email: 'alex.wright@example.com',
            phone: '+1 (555) 234-5678',
            role: 'customer'
          });
        }
      } else {
        // Default customer session
        const defaultUser: UserProfile = {
          id: 'usr-1',
          name: 'Alex Wright',
          email: 'alex.wright@example.com',
          phone: '+1 (555) 234-5678',
          role: 'customer'
        };
        setUser(defaultUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
      }
    }
  }, []);

  const login = (email: string, role: 'customer' | 'admin', name?: string, phone?: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || (role === 'admin' ? 'Restaurant Manager' : email.split('@')[0]),
      email,
      phone: phone || '+1 (555) 019-2831',
      role
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
