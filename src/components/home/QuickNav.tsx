'use client';

import Link from 'next/link';
import {
  FileText,
  FolderTree,
  FolderKanban,
  BookOpen,
  GitFork,
  User,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';
import { AnimatedSection } from '@/components/shared/AnimatedSection';

interface QuickLink {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
}

const QUICK_LINKS: QuickLink[] = [
  {
    label: '文章',
    description: '所有技术文章',
    href: '/articles',
    icon: FileText,
    color: 'text-blue-500 bg-blue-500/10',
  },
  {
    label: '分类',
    description: '按类别浏览',
    href: '/categories',
    icon: FolderTree,
    color: 'text-emerald-500 bg-emerald-500/10',
  },

  {
    label: '项目',
    description: '实战项目记录',
    href: '/projects',
    icon: FolderKanban,
    color: 'text-purple-500 bg-purple-500/10',
  },
  {
    label: '专题',
    description: '系统性学习路径',
    href: '/topics',
    icon: BookOpen,
    color: 'text-rose-500 bg-rose-500/10',
  },
  {
    label: '求职',
    description: '岗位数据分析看板',
    href: '/jobs',
    icon: Briefcase,
    color: 'text-amber-500 bg-amber-500/10',
  },
  {
    label: '仓库',
    description: '开源代码库',
    href: '/repos',
    icon: GitFork,
    color: 'text-gray-600 bg-gray-500/10 dark:text-gray-400 dark:bg-gray-400/10',
  },
  {
    label: '关于',
    description: '关于我和本站',
    href: '/about',
    icon: User,
    color: 'text-cyan-500 bg-cyan-500/10',
  },
];

export function QuickNav() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      {QUICK_LINKS.map((item, i) => (
        <AnimatedSection key={item.href} delay={i * 0.04}>
          <Link
            href={item.href}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-primary/50 transition-all duration-300 group h-full"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium group-hover:text-primary transition-colors">
              {item.label}
            </span>
            <span className="text-[10px] text-muted/50 line-clamp-1 text-center">
              {item.description}
            </span>
          </Link>
        </AnimatedSection>
      ))}
    </div>
  );
}
