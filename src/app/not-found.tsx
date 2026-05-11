'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center"
      >
        <p className="text-8xl font-bold tracking-tight gradient-text mb-4">
          404
        </p>
        <h2 className="text-xl font-semibold mb-2">页面未找到</h2>
        <p className="text-muted mb-8 max-w-sm mx-auto">
          你访问的页面可能已经被移动、删除，或者从未存在过。
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            返回首页
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm font-medium hover:scale-105 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            后退
          </button>
        </div>
      </motion.div>
    </div>
  );
}
