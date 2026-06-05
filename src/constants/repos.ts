export interface RepoItem {
  /** 仓库全名，如 "codecrafters-io/build-your-own-x" */
  fullName: string;
  /** 简短描述 */
  description: string;
  /** GitHub 仓库 URL */
  url: string;
  /** Star 数量（用于展示，非实时） */
  stars: number;
  /** 主要语言 */
  language?: string;
  /** 标签 */
  topics?: string[];
}

export const REPOS: RepoItem[] = [
  {
    fullName: 'codecrafters-io/build-your-own-x',
    description:
      '精心策划的"造轮子"教程索引，涵盖操作系统、数据库、编译器、编程语言、Web 服务器、3D 渲染器、神经网络等 30+ 技术领域的上百个分步指南——从零构建你自己的技术栈。',
    url: 'https://github.com/codecrafters-io/build-your-own-x',
    stars: 512000,
    language: 'Markdown',
    topics: ['tutorial', 'programming', 'computer-science', 'awesome-list'],
  },
  {
    fullName: 'awesome-selfhosted/awesome-selfhosted',
    description:
      '精心整理的自由软件网络服务与 Web 应用清单，涵盖分析、自动化、博客、通信、邮件、文件共享、媒体流、监控、密码管理器、VPN 等 100+ 分类——自托管替代 SaaS 的终极索引。',
    url: 'https://github.com/awesome-selfhosted/awesome-selfhosted',
    stars: 290000,
    language: 'Markdown',
    topics: ['self-hosted', 'awesome-list', 'devops', 'privacy', 'foss'],
  },
  {
    fullName: 'trimstray/the-book-of-secret-knowledge',
    description:
      '系统管理员与 DevOps 工程师的"秘密知识之书"——涵盖 Shell 一行命令、CLI 工具、网络管理、安全渗透、数据库、Web 服务器等领域的速查表、教程和最佳实践合集，命令行玩家的必备手册。',
    url: 'https://github.com/trimstray/the-book-of-secret-knowledge',
    stars: 250000,
    language: 'Markdown',
    topics: ['linux', 'command-line', 'devops', 'security', 'networking', 'cheatsheet'],
  },
  {
    fullName: 'GrowingGit/GitHub-Chinese-Top-Charts',
    description:
      'GitHub 中文排行榜，按总榜、增速榜、新秀榜三个维度排名，覆盖 Python、Java、Go、JavaScript、Vue、Rust 等 30+ 编程语言，区分软件与资料类——发现优秀中文开源项目的一站式导航。每周更新。',
    url: 'https://github.com/GrowingGit/GitHub-Chinese-Top-Charts',
    stars: 122000,
    language: 'JavaScript',
    topics: ['github', 'ranking', 'chinese', 'open-source', 'awesome-list'],
  },
  {
    fullName: 'sindresorhus/awesome',
    description:
      'awesome 系列的总入口——"关于有趣主题的精选 awesome 列表"，覆盖编程语言、框架、工具、开发环境、设计等数百个主题，衍生出 1500+ 子仓库，是 GitHub 上最经典的资源导航项目。',
    url: 'https://github.com/sindresorhus/awesome',
    stars: 470000,
    language: 'Markdown',
    topics: ['awesome-list', 'curated-list', 'resources', 'open-source'],
  },
  {
    fullName: 'freeCodeCamp/freeCodeCamp',
    description:
      '完全免费的全栈编程学习平台，涵盖 Web 开发、数学、计算机科学、Python、数据科学等课程，含交互式编码练习与项目实战，已帮助成千上万开发者从零入行——GitHub 上 Star 最高的 TypeScript 项目。',
    url: 'https://github.com/freeCodeCamp/freeCodeCamp',
    stars: 446000,
    language: 'TypeScript',
    topics: ['education', 'programming', 'web-development', 'free', 'curriculum'],
  },
];
