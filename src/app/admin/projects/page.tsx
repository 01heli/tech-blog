import Link from 'next/link'
import { ProjectList } from '@/components/admin/ProjectList'

export default function AdminProjectsPage() {
  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors mb-6"
      >
        ← 返回管理后台
      </Link>
      <ProjectList />
    </div>
  )
}
