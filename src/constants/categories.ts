import type { Category } from '@/types/post';

export interface CategoryMeta {
  name: Category;
  slug: string;
  description: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    name: 'MySQL',
    slug: 'mysql',
    description: '数据库设计、查询优化、索引策略与性能调优',
    color: 'from-orange-500 to-amber-500',
  },
  {
    name: 'Redis',
    slug: 'redis',
    description: '缓存策略、数据结构选型与高可用架构',
    color: 'from-red-500 to-rose-500',
  },
  {
    name: 'Docker',
    slug: 'docker',
    description: '容器化部署、镜像优化与编排实践',
    color: 'from-sky-500 to-blue-500',
  },
  {
    name: 'Python',
    slug: 'python',
    description: 'Python 后端开发、数据处理与自动化工具',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    name: 'Network',
    slug: 'network',
    description: '网络协议、传输层优化与协议栈深度解析',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    name: 'System',
    slug: 'system',
    description: '操作系统、分布式架构与底层原理',
    color: 'from-violet-500 to-purple-500',
  },
  {
    name: 'AI',
    slug: 'ai',
    description: '大模型、机器学习与智能体技术',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Frontend',
    slug: 'frontend',
    description: '前端工程化、性能优化与现代框架实践',
    color: 'from-pink-500 to-rose-500',
  },
];

const categoryBySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return categoryBySlug.get(slug);
}
