'use client';

import { AdminNav } from './AdminNav';

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="pl-64 p-8">
        {children}
      </main>
    </div>
  );
}
