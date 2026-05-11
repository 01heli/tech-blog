export const SITE = {
  title: '鹤唳',
  name: '鹤唳',
  description: '一个探索技术深度的个人博客。分享关于后端架构、数据库优化、容器技术以及工程实践的一切。',
  url: 'https://devlog.dev',
  author: {
    name: 'Hu Lei',
    bio: '后端工程师，专注于高性能服务架构、数据库优化和云原生技术。热爱开源，追求代码之美。',
    avatar: '/images/avatar.webp',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
  },
  social: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    email: 'hello@devlog.dev',
  },
  navLinks: [
    { label: '文章', href: '/articles' },
    { label: '分类', href: '/categories' },
    { label: '关于', href: '/about' },
    { label: '搜索', href: '/search' },
  ],
} as const;
