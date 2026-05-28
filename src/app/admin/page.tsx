import { getCurrentUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'

export default async function AdminPage() {
  const user = await getCurrentUser()
  const userCount = await prisma.user.count()

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8 py-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">管理后台</h1>
        <p className="text-muted mt-2">欢迎回来，{user?.phone}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-black/5 dark:border-white/10 p-6">
          <p className="text-3xl font-bold">{userCount}</p>
          <p className="text-muted text-sm mt-1">注册用户数</p>
        </div>

        <div className="rounded-2xl border border-black/5 dark:border-white/10 p-6">
          <p className="text-3xl font-bold">6</p>
          <p className="text-muted text-sm mt-1">文章数量</p>
        </div>

        <div className="rounded-2xl border border-black/5 dark:border-white/10 p-6">
          <p className="text-3xl font-bold">READER / ADMIN</p>
          <p className="text-muted text-sm mt-1">角色体系</p>
        </div>
      </div>
    </div>
  )
}
