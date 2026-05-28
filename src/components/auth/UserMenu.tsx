'use client';

import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Shield } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  onLoginClick: () => void;
}

export function UserMenu({ onLoginClick }: UserMenuProps) {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />;
  }

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className="text-sm font-medium text-muted hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
      >
        登录
      </button>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm font-medium',
          open
            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
            : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
        )}
      >
        {user.phone.slice(-2)}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl py-1 z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <p className="text-sm font-medium truncate">{user.phone}</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {user.role === 'ADMIN' ? '管理员' : '普通用户'}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {user.role === 'ADMIN' && (
              <a
                href="/admin"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Shield className="w-4 h-4" />
                管理后台
              </a>
            )}
            <button
              onClick={() => { setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <User className="w-4 h-4" />
              个人中心
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1">
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
