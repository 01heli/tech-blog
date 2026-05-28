'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, Plus, LogOut, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/auth/AuthProvider'

export function AdminNav() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const links = [
    { href: '/admin', label: '文章管理', icon: FileText },
    { href: '/admin/articles/new', label: '新建文章', icon: Plus },
  ]

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-zinc-50 dark:bg-zinc-950 border-r border-black/5 dark:border-white/10 flex flex-col">
      <div className="p-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight hover:text-blue-600 transition-colors"
        >
          鹤唳 · Admin
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white'
                : 'text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-black/5 dark:border-white/10 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <Home className="w-4 h-4" />
          返回首页
        </Link>
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:bg-black/5 dark:hover:bg-white/5 transition-colors w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>
    </aside>
  )
}
