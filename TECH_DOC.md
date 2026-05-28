# 鹤唳 · 技术博客 — 技术文档

## 项目概述

"鹤唳"是一套基于 Next.js 14 的 MDX 驱动个人技术博客，支持深色模式、全文搜索、手机号验证码登录、后台文章管理，使用 Docker + Nginx 部署。

- 线上地址：https://blog.01heli.top
- GitHub：https://github.com/01heli/tech-blog

---

## 技术栈

| 层面 | 技术 | 说明 |
|------|------|------|
| 框架 | Next.js 14 (App Router) | React Server Components + streaming |
| 内容 | MDX (gray-matter + remark/rehype) | 文章以 `.mdx` 文件存储在 `content/articles/` |
| 样式 | Tailwind CSS 3.4 + next-themes | class 策略暗色模式，自定义 CSS 变量颜色体系 |
| 动画 | framer-motion + CSS keyframes | 入场动画、浮动效果、滚动进度条 |
| 搜索 | fuse.js | 前端模糊搜索，支持文章标题和内容匹配 |
| 认证 | iron-session v8 | 加密 session 存储于 HttpOnly cookie |
| 数据库 | Prisma 5 + SQLite | 文件型数据库，零运维，存储用户和短信验证码 |
| 短信 | 阿里云 SMS SDK | 动态 import 绕过 webpack 构建时解析 |
| 部署 | Docker + Nginx | 多阶段构建，standalone 输出，Nginx 反向代理 + SSL |
| 包管理 | npm | 依赖锁定用 package-lock.json |

---

## 项目架构

### 路由结构

```
/                          → 首页（精选文章 + 分类导航）
/articles                  → 全量文章列表
/articles/[slug]           → 文章详情页（MDX 渲染 + TOC 侧边栏 + 上下篇导航）
/categories                → 分类聚合页
/categories/[category]     → 分类文章列表
/search                    → 全文搜索页
/about                     → 关于页面
/admin                     → 管理后台首页（需 ADMIN 角色）
/admin/articles            → 文章列表管理
/admin/articles/new        → 新建文章
/admin/articles/[slug]/edit → 编辑文章
/api/auth/send-code        → 发送短信验证码
/api/auth/verify-code      → 验证码登录/注册
/api/auth/logout           → 登出
/api/auth/me               → 获取当前用户
/api/admin/articles        → 文章 CRUD API
/api/admin/articles/[slug] → 单篇文章 CRUD
/feed.xml                  → RSS Feed
```

### 认证流程

```
用户输入手机号
    │
    ▼
POST /api/auth/send-code
    │
    ├── 验证手机号格式 + 限频检查（60s）
    ├── 生成 6 位数字验证码
    ├── 写入 SmsCode 表（5 分钟过期）
    └── 阿里云发送短信（或 Mock 模式打印到控制台）
    │
    ▼
用户输入验证码
    │
    ▼
POST /api/auth/verify-code
    │
    ├── 查询 SmsCode 表验证（未使用 + 未过期）
    ├── 标记验证码为已使用
    ├── User.upsert（新用户自动注册为 READER）
    ├── 创建 iron-session cookie（7 天有效）
    └── 返回 redirectTo（ADMIN → /admin，READER → /）
```

### 权限模型

| 角色 | 权限 |
|------|------|
| READER | 浏览博客、登录/登出（为后续评论/收藏预留）|
| ADMIN | 以上全部 + 管理后台（文章 CRUD）|

- Admin 用户通过 `prisma/seed.ts` 预置，手机号由环境变量 `ADMIN_PHONE` 指定
- 双层路由保护：middleware（cookie 存在性检查）+ layout.tsx（session 验证 + role 检查）

### 数据流

**前端博客页面（SSG/SSR）：**
```
文件系统 (content/articles/*.mdx)
    │
    ▼
src/lib/posts.ts (gray-matter 解析 frontmatter + 内容)
    │
    ▼
React Server Components（直接读取文件系统，无需 API）
    │
    ▼
next-mdx-remote → MDX 渲染（含自定义组件：CodeBlock、Callout）
```

**后台管理：**
```
Client Component (ArticleEditor/ArticleList)
    │
    ▼
fetch() → /api/admin/articles
    │
    ▼
src/lib/admin/articles.ts（文件系统读写 .mdx 文件）
```

**认证：**
```
Client Component (AuthProvider/LoginModal)
    │
    ▼
fetch() → /api/auth/*
    │
    ▼
iron-session cookie ↔ Prisma/SQLite (User + SmsCode)
```

---

## 核心模块设计

### 1. 文章系统

所有文章以 MDX 文件存储在 `content/articles/`，命名格式 `YYYY-MM-DD-slug.mdx`。

- `src/lib/posts.ts` — 使用 React `cache()` 包装，同一请求内多次调用只读一次文件系统
- `src/lib/admin/articles.ts` — 后台文章 CRUD，直接操作文件系统
- 文章解析使用 `gray-matter` 分离 frontmatter 和内容
- MDX 渲染使用 `next-mdx-remote`，支持自定义组件注入（代码块、Callout 等）

### 2. 目录导航 (TOC)

- `useTableOfContents` hook 使用 `IntersectionObserver` 监听文章标题，实时高亮当前阅读位置
- 侧边栏 `ArticleSidebar` 独立滚动（`overflow-y-auto` + `max-h-[calc(100vh-7rem)]`）
- `scrollIntoView({ block: 'nearest' })` 实现目录自动跟随文章滚动

### 3. 搜索系统

- 使用 `fuse.js` 实现前端模糊搜索
- `SearchProvider` 通过 Context 全局提供搜索框 + 搜索弹窗
- `Ctrl/Cmd + K` 快捷键唤起搜索（在页面任何位置可用）

### 4. 认证系统

| 模块 | 文件 | 职责 |
|------|------|------|
| Session 管理 | `src/lib/auth/session.ts` | iron-session 封装：创建/销毁/读取 session |
| 短信发送 | `src/lib/auth/sms.ts` | 阿里云 SMS SDK 封装，支持 Mock 模式 |
| 限频 | `src/lib/auth/rate-limit.ts` | 内存 Map 实现，60 秒冷却 |
| AuthContext | `src/components/auth/AuthProvider.tsx` | 前端认证状态管理 |
| 登录弹窗 | `src/components/auth/LoginModal.tsx` | 两步式（手机号 → 验证码）登录 |
| 用户菜单 | `src/components/auth/UserMenu.tsx` | 登录/登出按钮 + Admin 入口 |
| 中间件 | `src/middleware.ts` | /admin 路由 cookie 检查 |
| Admin 布局 | `src/app/admin/layout.tsx` | Server Component 完整 session + role 验证 |

### 5. 暗色模式

- `next-themes` + `ThemeProvider`（class 策略）
- 颜色系统基于 CSS 自定义属性（`--color-bg`、`--color-fg`、`--color-muted` 等）
- Tailwind 使用 `rgb(var(--color-*) / <alpha-value>)` 模式引用

---

## 遇到的问题与解决方案

### 问题 1：阿里云 SMS SDK 在 Next.js 构建时报模块未找到

**现象**：`@alicloud/dysmsapi20170525` 和 `@alicloud/openapi-client` 在 webpack 构建时解析失败，即使安装了也会报错。

**原因**：Next.js 的 webpack 配置在服务端构建时会静态分析所有 `import` 语句，阿里云 SDK 的某些依赖模块在 Node.js 环境下无法被 webpack 正确打包。

**解决方案**：使用 `new Function('m', 'return import(m)')('@alicloud/dysmsapi20170525')` 替代直接 `import`，绕过 webpack 的静态分析，将模块解析推迟到运行时。

```ts
// 不要这样写：
import Dysmsapi from '@alicloud/dysmsapi20170525';

// 而是这样写：
const smsModule: any = await (new Function('m', 'return import(m)'))('@alicloud/dysmsapi20170525');
```

### 问题 2：iron-session 在 Next.js 14 App Router 中的适配

**现象**：iron-session v8 的 API 与 Pages Router 时代不同，需要适配 `cookies()` 函数。

**原因**：Next.js App Router 使用 `next/headers` 的 `cookies()` 来管理 cookie。

**解决方案**：使用 `getIronSession(cookieStore, sessionOptions)` 的新版 API，封装在 `src/lib/auth/session.ts` 中。

```ts
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export async function getSession() {
  const cookieStore = cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
```

### 问题 3：TOC 侧边栏鼠标滚动穿透

**现象**：鼠标在左侧目录上滚轮，却是右侧文章内容在滚动。

**原因**：TOC 所在的 `aside` 元素和文章内容在同一个滚动容器中，目录没有独立的滚动区域。

**解决方案**：给 TOC 的 `<nav>` 元素添加 `max-h-[calc(100vh-7rem)] overflow-y-auto`，使其成为一个独立的可滚动区域。

### 问题 4：TOC 不跟随文章滚动

**现象**：文章滚动到底部了，目录还停留在顶部，看不到当前阅读位置对应的目录项。

**原因**：缺少将当前活跃的 TOC 项滚动到可见区域的逻辑。

**解决方案**：在 `ArticleSidebar` 中添加 `useRef` + `useEffect`，监听 `activeId` 变化后用 `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` 自动滚动。

### 问题 5：Prisma Role 枚举类型与 TypeScript 字面量类型冲突

**现象**：`createSession(user.role)` 报类型错误，Prisma 生成的 `Role` 枚举无法直接赋值给 `'ADMIN' | 'READER'`。

**原因**：Prisma Client 生成的枚举类型与 TypeScript 字符串字面量联合类型不完全兼容。

**解决方案**：使用类型断言 `user.role as 'ADMIN' | 'READER'`。

### 问题 6：TypeScript Map 迭代需要 downlevelIteration

**现象**：`for (const [key, value] of store)` 在 TypeScript 编译时报错，要求启用 `downlevelIteration`。

**原因**：TypeScript 的迭代器降级编译在 target 不高的情况下需要这个选项。

**解决方案**：改用 `store.forEach((time, key) => { ... })` 替代 `for...of` 循环，避免需要额外的编译选项。

### 问题 7：SQLite 在 Docker 中的持久化

**现象**：每次 Docker 重启后数据库数据丢失。

**原因**：SQLite 数据文件默认存在容器内，容器重建时会丢失。

**解决方案**：
- `docker-compose.yml` 中挂载 named volume `blog-data:/app/prisma/data`
- `Dockerfile` 中创建 `/app/prisma/data` 目录并赋予 `blog` 用户写入权限
- 容器启动时执行 `npx prisma migrate deploy` 确保表结构存在

### 问题 8：后台侧边栏缺失导致无法管理文章

**现象**：用户反馈"管理后台怎么不能对每篇文章进行编辑修改了"。

**原因**：admin layout 直接把 `{children}` 放在普通 div 中渲染，没有引入 `AdminNav` 侧边栏组件；`/admin/articles` 路由页面也缺失。

**解决方案**：
1. 创建 `AdminShell` 组件，组合 `AdminNav` 侧边栏 + 主内容区
2. 创建 `/admin/articles/page.tsx` 渲染已有的 `ArticleList` 组件
3. 更新 `AdminNav` 的登出逻辑，使用 `router.push('/')` 跳转

---

## Docker 部署

### 构建与运行

```bash
docker compose up -d --build
```

### 架构

```
┌──────────────────────────────────────┐
│  Nginx (:80/:443)                     │
│  ├─ 反向代理 → blog:3000              │
│  ├─ SSL 证书（./nginx/certs）         │
│  └─ 静态资源缓存                      │
├──────────────────────────────────────┤
│  Next.js (blog:3000)                  │
│  ├─ standalone 构建产出               │
│  ├─ Prisma + SQLite                   │
│  └─ 启动时自动 migrate deploy         │
├──────────────────────────────────────┤
│  Volume: blog-data                    │
│  └─ /app/prisma/data/blog.db          │
└──────────────────────────────────────┘
```

### 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| `DATABASE_URL` | SQLite 文件路径 | 是 |
| `SESSION_SECRET` | iron-session 加密密钥（≥32 字符）| 是 |
| `ADMIN_PHONE` | 管理员手机号（seed 脚本用）| 是 |
| `ALIBABA_ACCESS_KEY_ID` | 阿里云 AccessKey | 生产环境必填 |
| `ALIBABA_ACCESS_KEY_SECRET` | 阿里云 AccessKey Secret | 生产环境必填 |
| `ALIBABA_SMS_SIGN_NAME` | 短信签名 | 生产环境必填 |
| `ALIBABA_SMS_TEMPLATE_CODE` | 短信模板代码 | 生产环境必填 |
| `SMS_MOCK` | 设为 `true` 跳过真实短信发送 | 开发环境推荐 |

---

## 本地开发

```bash
# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 初始化数据库
npx prisma migrate dev --name init

# 预置管理员用户（需配置 ADMIN_PHONE 环境变量）
npx prisma db seed

# 启动开发服务器
npm run dev
```

开发环境下 `SMS_MOCK=true` 会将验证码打印到终端控制台，无需配置阿里云短信。

### 新建文章

在 `content/articles/` 下创建 `YYYY-MM-DD-slug.mdx` 文件：

```mdx
---
title: '文章标题'
description: '文章描述'
date: '2026-05-28'
category: '数据库'
tags: ['MySQL', 'PostgreSQL']
featured: true
---

文章内容（Markdown + JSX）...
```

---

## 更新日志

| 日期 | 更新内容 |
|------|----------|
| 2026-05-28 | 初始技术文档，涵盖 v0.1.0 所有功能模块 |
