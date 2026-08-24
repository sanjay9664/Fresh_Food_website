'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  email: string;
  name: string;
  role: 'customer' | 'admin';
  phone?: string;
}

export interface UserAccount extends UserProfile {
  password: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (identifier: string, password?: string, targetRole?: 'customer' | 'admin', customName?: string) => { success: boolean; message?: string };
  register: (name: string, emailOrPhone: string, password?: string, role?: 'customer' | 'admin') => { success: boolean; message?: string };
  logout: () => void;
  registeredUsers: UserAccount[];
}

const DEFAULT_USERS: UserAccount[] = [
  {
    email: 'admin@freshvana.com',
    phone: '8707375679',
    name: 'Super Admin (Sanjay)',
    password: 'password123',
    role: 'admin'
  },
  {
    email: 'sanjay@freshvana.com',
    phone: '9876543210',
    name: 'Sanjay Kumar',
    password: 'password123',
    role: 'customer'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [users, setUsers] = useState<UserAccount[]>(DEFAULT_USERS);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile | null>({
    email: 'sanjay@freshvana.com',
    name: 'Sanjay',
    role: 'customer',
    phone: '8707375679'
  });

  // Load saved users database & current auth session from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('freshvana_users_db');
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          setUsers(parsedUsers);
        }
      } catch (e) {
        console.error('Failed to parse users DB from local storage', e);
      }
    } else {
      localStorage.setItem('freshvana_users_db', JSON.stringify(DEFAULT_USERS));
    }

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

  const login = (
    identifier: string,
    password?: string,
    targetRole: 'customer' | 'admin' = 'customer',
    customName?: string
  ): { success: boolean; message?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const inputPass = password ? password.trim() : '';

    // Find existing user in stored users database by email or phone
    const existing = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        (u.phone && u.phone.trim() === cleanId) ||
        (cleanId === 'admin' && u.role === 'admin')
    );

    let authUser: UserProfile;

    if (existing) {
      if (inputPass && existing.password && existing.password !== inputPass) {
        return { success: false, message: 'Incorrect password. Please check your credentials.' };
      }

      authUser = {
        email: existing.email,
        name: customName && customName.trim() ? customName.trim() : existing.name,
        role: targetRole === 'admin' ? 'admin' : existing.role,
        phone: existing.phone
      };
    } else {
      // Create new user entry on the fly if registering/logging in first time
      const emailVal = cleanId.includes('@') ? cleanId : `${cleanId}@freshvana.com`;
      const displayName = customName && customName.trim() ? customName.trim() : cleanId.split('@')[0];
      const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

      const newUser: UserAccount = {
        email: emailVal,
        phone: !cleanId.includes('@') ? cleanId : '',
        name: formattedName,
        password: inputPass || 'password123',
        role: targetRole
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('freshvana_users_db', JSON.stringify(updatedUsers));

      authUser = {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone
      };
    }

    setIsLoggedIn(true);
    setUser(authUser);

    localStorage.setItem(
      'freshvana_auth',
      JSON.stringify({ isLoggedIn: true, user: authUser })
    );

    if (authUser.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }

    return { success: true };
  };

  const register = (
    name: string,
    emailOrPhone: string,
    password?: string,
    role: 'customer' | 'admin' = 'customer'
  ): { success: boolean; message?: string } => {
    const cleanId = emailOrPhone.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPass = password ? password.trim() : 'password123';

    if (!cleanId || !cleanName) {
      return { success: false, message: 'Please provide valid name and email or phone number.' };
    }

    const emailVal = cleanId.includes('@') ? cleanId : `${cleanId}@freshvana.com`;
    const phoneVal = !cleanId.includes('@') ? cleanId : '';

    const newAccount: UserAccount = {
      email: emailVal,
      phone: phoneVal,
      name: cleanName,
      password: cleanPass,
      role
    };

    const updatedUsers = [...users.filter((u) => u.email !== emailVal), newAccount];
    setUsers(updatedUsers);
    localStorage.setItem('freshvana_users_db', JSON.stringify(updatedUsers));

    return login(emailVal, cleanPass, role, cleanName);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser({ email: 'guest@freshvana.com', name: 'Guest', role: 'customer' });
    localStorage.removeItem('freshvana_auth');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout, registeredUsers: users }}>
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
