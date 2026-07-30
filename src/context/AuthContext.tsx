'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'customer' | 'manager' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  assignedRestaurantId?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password?: string, name?: string) => UserProfile;
  signUp: (email: string, password?: string, name?: string, phone?: string) => UserProfile;
  logout: () => void;
  managers: UserProfile[];
  addManagerAccess: (name: string, email: string, assignedRestaurantId?: string) => void;
  removeManagerAccess: (id: string) => void;
  isCustomer: boolean;
  isManager: boolean;
  isAdmin: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => ({ id: '', name: '', email: '', phone: '', role: 'customer' }),
  signUp: () => ({ id: '', name: '', email: '', phone: '', role: 'customer' }),
  logout: () => {},
  managers: [],
  addManagerAccess: () => {},
  removeManagerAccess: () => {},
  isCustomer: true,
  isManager: false,
  isAdmin: false,
  isInitialized: false
});

const AUTH_STORAGE_KEY = 'tablevibe_auth_user';
const MANAGERS_STORAGE_KEY = 'tablevibe_managers';

export const INITIAL_MANAGERS: UserProfile[] = [
  {
    id: 'm-101',
    name: 'Sarah Jenkins',
    email: 'manager@lumina.com',
    phone: '+1 (555) 392-1002',
    role: 'manager',
    assignedRestaurantId: 'rest-1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'm-102',
    name: 'Marcus Vance',
    email: 'marcus@steakhouse.com',
    phone: '+1 (555) 839-4410',
    role: 'manager',
    assignedRestaurantId: 'rest-2',
    createdAt: new Date().toISOString()
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [managers, setManagers] = useState<UserProfile[]>(INITIAL_MANAGERS);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load current user
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          setUser(null);
        }
      }

      // Load manager accounts
      const storedManagers = localStorage.getItem(MANAGERS_STORAGE_KEY);
      if (storedManagers) {
        try {
          setManagers(JSON.parse(storedManagers));
        } catch (e) {
          setManagers(INITIAL_MANAGERS);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Standard Login with Role Auto-Resolution
  const login = (email: string, password?: string, name?: string): UserProfile => {
    const cleanEmail = email.trim().toLowerCase();

    // Check if super admin
    let role: UserRole = 'customer';
    let resolvedName = name || cleanEmail.split('@')[0];

    if (cleanEmail.includes('admin@') || cleanEmail === 'admin@lumina.com') {
      role = 'admin';
      resolvedName = 'Super Admin';
    } else {
      // Check if provisioned manager
      const foundManager = managers.find((m) => m.email.toLowerCase() === cleanEmail);
      if (foundManager) {
        role = 'manager';
        resolvedName = foundManager.name;
      }
    }

    const authenticatedUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: resolvedName,
      email: cleanEmail,
      phone: '+1 (555) 234-5678',
      role
    };

    setUser(authenticatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
    }
    return authenticatedUser;
  };

  // Standard Customer Sign Up
  const signUp = (email: string, password?: string, name?: string, phone?: string): UserProfile => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0],
      email: email.trim().toLowerCase(),
      phone: phone || '+1 (555) 987-6543',
      role: 'customer'
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    }
    return newUser;
  };

  // Admin provisioning new manager
  const addManagerAccess = (name: string, email: string, assignedRestaurantId = 'rest-1') => {
    const newManager: UserProfile = {
      id: `mgr-${Date.now()}`,
      name,
      email: email.trim().toLowerCase(),
      phone: '+1 (555) 444-9988',
      role: 'manager',
      assignedRestaurantId,
      createdAt: new Date().toISOString()
    };

    const updated = [newManager, ...managers];
    setManagers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(MANAGERS_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const removeManagerAccess = (id: string) => {
    const updated = managers.filter((m) => m.id !== id);
    setManagers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(MANAGERS_STORAGE_KEY, JSON.stringify(updated));
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
        signUp,
        logout,
        managers,
        addManagerAccess,
        removeManagerAccess,
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
