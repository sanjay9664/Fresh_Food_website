'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (email: string, role?: 'customer' | 'admin', name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Default to true so site is open to all visitors
  const [user, setUser] = useState<UserProfile | null>({
    email: 'guest@freshvana.com',
    name: 'Guest',
    role: 'customer'
  });

  useEffect(() => {
    const savedAuth = localStorage.getItem('freshvana_auth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setIsLoggedIn(parsed.isLoggedIn);
        setUser(parsed.user);
      } catch (e) {
        console.error('Failed to parse auth from local storage', e);
      }
    }
  }, []);

  const login = (email: string, role: 'customer' | 'admin' = 'customer', customName?: string) => {
    let displayName = customName && customName.trim() ? customName.trim() : '';

    if (!displayName) {
      const emailPrefix = email.split('@')[0] || 'User';
      displayName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }

    const profile: UserProfile = {
      email,
      name: displayName,
      role
    };

    setIsLoggedIn(true);
    setUser(profile);

    localStorage.setItem(
      'freshvana_auth',
      JSON.stringify({ isLoggedIn: true, user: profile })
    );

    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser({ email: 'guest@freshvana.com', name: 'Guest', role: 'customer' });
    localStorage.removeItem('freshvana_auth');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
