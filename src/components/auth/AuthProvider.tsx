'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { SessionData } from '@/types/auth'

interface AuthContextType {
  user: SessionData | null
  isLoading: boolean
  login: (phone: string, code: string) => Promise<{ success: boolean; redirectTo?: string; error?: string }>
  logout: () => Promise<void>
  sendCode: (phone: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.data)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const sendCode = useCallback(async (phone: string) => {
    const res = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    return res.json()
  }, [])

  const login = useCallback(async (phone: string, code: string) => {
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    })
    const data = await res.json()
    if (data.success) {
      setUser({
        userId: data.data.userId,
        phone: data.data.phone,
        role: data.data.role,
      })
    }
    return data
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, sendCode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
