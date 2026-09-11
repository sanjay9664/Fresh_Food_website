'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, setTokens, clearTokens, getAccessToken, getRefreshToken } from '@/services/api';

export interface UserProfile {
  id?: string;
  email: string;
  name: string;
  role: 'customer' | 'admin' | 'vendor' | string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export interface UserAccount extends UserProfile {
  password?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  loading: boolean;
  login: (
    identifier: string,
    password?: string,
    targetRole?: 'customer' | 'admin' | 'vendor',
    customName?: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    name: string,
    emailOrPhone: string,
    password?: string,
    role?: 'customer' | 'admin' | 'vendor'
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  registeredUsers: UserAccount[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Restore current session on mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const token = getAccessToken();
      if (token) {
        const res = await authApi.getCurrentUser();
        if (res.success && res.data) {
          const u = res.data;
          const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email;
          setUser({
            id: u.id,
            email: u.email,
            name,
            firstName: u.firstName,
            lastName: u.lastName,
            role: u.role || 'customer',
            phone: u.phone,
          });
          setIsLoggedIn(true);
          setLoading(false);
          return;
        }
      }

      // Check local storage fallback for demo vendor/admin/customer session
      const savedAuth = localStorage.getItem('freshvana_auth');
      if (savedAuth) {
        try {
          const parsed = JSON.parse(savedAuth);
          if (parsed?.isLoggedIn && parsed?.user) {
            setUser(parsed.user);
            setIsLoggedIn(true);
            setLoading(false);
            return;
          }
        } catch (e) {
          // invalid JSON
        }
      }

      // A local profile is only a cache, never proof of authentication.
      clearTokens();
      localStorage.removeItem('freshvana_auth');
      setIsLoggedIn(false);
      setUser(null);
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (
    identifier: string,
    password?: string,
    targetRole: 'customer' | 'admin' | 'vendor' = 'customer',
    customName?: string
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    const cleanId = identifier.trim();
    const inputPass = password ? password.trim() : '';

    if (!cleanId) {
      setLoading(false);
      return { success: false, message: 'Please enter your email or phone number.' };
    }
    if (!inputPass) {
      setLoading(false);
      return { success: false, message: 'Please enter your password.' };
    }

    // 1. Attempt Real Backend API Login
    const res = await authApi.login({
      emailOrPhone: cleanId,
      password: inputPass,
    });

    if (res.success && res.data && res.data.accessToken) {
      const { user: backendUser, accessToken, refreshToken } = res.data;
      setTokens(accessToken, refreshToken);

      const displayName = `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim() || backendUser.email;

      const authUser: UserProfile = {
        id: backendUser.id,
        email: backendUser.email,
        name: displayName,
        firstName: backendUser.firstName,
        lastName: backendUser.lastName,
        role: backendUser.role || targetRole || 'customer',
        phone: backendUser.phone,
      };

      setIsLoggedIn(true);
      setUser(authUser);
      localStorage.setItem('freshvana_auth', JSON.stringify({ isLoggedIn: true, user: authUser }));
      setLoading(false);

      const roleStr = String(authUser.role).toLowerCase();
      if (roleStr.includes('admin')) {
        router.push('/admin');
      } else if (roleStr.includes('vendor') || targetRole === 'vendor') {
        router.push('/vendor/dashboard');
      } else {
        router.push('/');
      }
      return { success: true };
    }

    setLoading(false);
    return {
      success: false,
      message: res.message || 'Login failed. Please check your credentials.',
    };
  };

  const register = async (
    name: string,
    emailOrPhone: string,
    password?: string,
    _role: 'customer' | 'admin' | 'vendor' = 'customer'
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    const cleanId = emailOrPhone.trim();
    const cleanName = name.trim();
    const cleanPass = password ? password.trim() : '';

    if (!cleanId || !cleanName || !cleanPass) {
      setLoading(false);
      return { success: false, message: 'Please fill in all required fields.' };
    }

    const nameParts = cleanName.split(' ');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || 'Customer';

    const isEmail = cleanId.includes('@');
    const email = isEmail ? cleanId : `${cleanId.replace(/\D/g, '')}@freshvana.com`;
    const phone = !isEmail ? cleanId : undefined;

    // Attempt Real Backend Signup
    const res = await authApi.signup({
      firstName,
      lastName,
      email,
      phone,
      password: cleanPass,
    });

    if (res.success) {
      setLoading(false);
      return { success: true, message: 'Account created. Please verify your email before signing in.' };
    }

    setLoading(false);
    return { success: false, message: res.message || 'Unable to create your account.' };
  };

  const logout = async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => null);
    }
    clearTokens();
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('freshvana_auth');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        login,
        register,
        logout,
        registeredUsers: [],
      }}
    >
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
