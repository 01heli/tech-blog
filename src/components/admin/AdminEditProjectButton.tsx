'use client'

import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'

export function AdminEditProjectButton({ slug }: { slug: string }) {
  const { user } = useAuth()

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <Link
        href={`/admin/projects/${slug}/edit`}
        className="flex items-center gap-2 px-4 h-11 rounded-full bg-blue-600 text-white text-sm font-medium shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Pencil className="w-4 h-4" />
        编辑此项目
      </Link>
    </div>
  )
}
