export const SITE = {
  title: '鹤唳',
  name: '鹤唳',
  description: '一个探索技术深度的个人博客。分享关于后端架构、数据库优化、容器技术以及工程实践的一切。',
  url: 'http://8.161.226.136/',
  author: {
    name: 'Hu Lei',
    bio: '后端工程师，专注于高性能服务架构、数据库优化和云原生技术。热爱开源，追求代码之美。',
    avatar: '/images/avatar.webp',
    github: 'https://github.com/01heli',
  },
  social: {
    github: 'https://github.com/01heli',
    email: 'hello@devlog.dev',
  },
  navLinks: [
    { label: '文章', href: '/articles' },
    { label: '分类', href: '/categories' },
    { label: '标签', href: '/tags' },
    { label: '项目', href: '/projects' },
    { label: '友链', href: '/friends' },
    { label: '关于', href: '/about' },
    { label: '搜索', href: '/search' },
  ],
} as const;
