import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'

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

  return <>{children}</>
}
