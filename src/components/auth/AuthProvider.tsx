'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface User {
  phone: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (phone: string, code: string) => Promise<{ success: boolean; message: string; redirectTo?: string }>;
  logout: () => Promise<void>;
  sendCode: (phone: string) => Promise<{ success: boolean; message: string }>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.loggedIn ? data.user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const sendCode = async (phone: string) => {
    const res = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    return res.json();
  };

  const login = async (phone: string, code: string) => {
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });
    const data = await res.json();
    if (data.success) await refresh();
    return data;
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, sendCode, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
