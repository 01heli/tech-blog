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
    name: 'Linux',
    slug: 'linux',
    description: '操作系统原理、Shell 脚本与服务器运维',
    color: 'from-stone-500 to-neutral-500',
  },
  {
    name: 'Go',
    slug: 'go',
    description: 'Go 语言高性能编程、并发模式与框架实践',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    name: 'Python',
    slug: 'python',
    description: 'Python 后端开发、数据处理与自动化工具',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    name: 'Kubernetes',
    slug: 'kubernetes',
    description: '云原生架构、K8s 编排与微服务治理',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    name: 'System Design',
    slug: 'system-design',
    description: '分布式系统、架构设计与技术选型',
    color: 'from-violet-500 to-purple-500',
  },
  {
    name: 'DevOps',
    slug: 'devops',
    description: 'CI/CD 流水线、监控体系与自动化运维',
    color: 'from-emerald-500 to-green-500',
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
