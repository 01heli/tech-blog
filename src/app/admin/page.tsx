import Link from 'next/link';
import { FileText, Users } from 'lucide-react';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { listArticles } from '@/lib/admin/articles';
import { Container } from '@/components/layout/Container';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getSession();
  const [articleCount, userCount] = await Promise.all([
    Promise.resolve(listArticles().length),
    prisma.user.count(),
  ]);

  return (
    <Container>
      <div className="py-12">
        <h1 className="text-2xl font-bold mb-2">管理后台</h1>
        <p className="text-zinc-500 mb-8">欢迎回来，{session.phone}</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/admin/articles"
            className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-colors group"
          >
            <FileText className="w-8 h-8 text-zinc-400 group-hover:text-blue-500 transition-colors mb-3" />
            <p className="text-lg font-semibold">文章管理</p>
            <p className="text-sm text-zinc-500">共 {articleCount} 篇文章</p>
          </Link>
          <Link
            href="/admin/users"
            className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-colors group"
          >
            <Users className="w-8 h-8 text-zinc-400 group-hover:text-blue-500 transition-colors mb-3" />
            <p className="text-lg font-semibold">用户管理</p>
            <p className="text-sm text-zinc-500">共 {userCount} 个用户</p>
          </Link>
        </div>
      </div>
    </Container>
  );
}
