'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'customer' | 'manager' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, role: UserRole, name?: string, phone?: string) => void;
  logout: () => void;
  isCustomer: boolean;
  isManager: boolean;
  isAdmin: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isCustomer: true,
  isManager: false,
  isAdmin: false,
  isInitialized: false
});

const AUTH_STORAGE_KEY = 'tablevibe_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          setUser(null);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  const login = (email: string, role: UserRole, name?: string, phone?: string) => {
    const defaultName =
      role === 'admin'
        ? 'Super Admin Monitor'
        : role === 'manager'
        ? 'Floor Layout Manager'
        : email.split('@')[0];

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || defaultName,
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
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isCustomer: !user || user.role === 'customer',
        isManager: user?.role === 'manager' || user?.role === 'admin',
        isAdmin: user?.role === 'admin',
        isInitialized
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
