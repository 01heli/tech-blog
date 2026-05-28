'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { User, Shield, LogOut } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { cn } from '@/lib/utils'

function maskPhone(phone: string): string {
  return phone.replace(/(\+86)?(\d{3})\d{4}(\d{4})/, '+86 $2****$3')
}

export function UserMenu({ onLoginClick }: { onLoginClick: () => void }) {
  const { user, isLoading, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 animate-pulse" />
  }

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className="px-3.5 py-2 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        登录
      </button>
    )
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
          'hover:bg-black/5 dark:hover:bg-white/5'
        )}
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">{maskPhone(user.phone)}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-black/5 dark:border-white/10 py-1.5">
          {/* User info */}
          <div className="px-4 py-2 border-b border-black/5 dark:border-white/10">
            <p className="text-xs text-muted">{maskPhone(user.phone)}</p>
          </div>

          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Shield className="w-4 h-4" />
              管理后台
            </Link>
          )}

          <button
            onClick={() => {
              setOpen(false)
              logout()
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      )}
    </div>
  )
}
