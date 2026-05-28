import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { AdminNav } from '@/components/admin/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/?login=true')
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold mb-4">403 - 无权限访问</h1>
        <p className="text-muted">您没有管理员权限</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <AdminNav />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
