import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session.userId) {
    redirect('/?login=true');
  }

  if (session.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-400">403</h1>
          <p className="text-zinc-500 mt-2">你没有权限访问此页面</p>
        </div>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
