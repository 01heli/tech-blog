# 鹤唳 · Tech Blog

个人技术博客，基于 Next.js 14 App Router 构建，MDX 驱动内容管理。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **内容**: MDX + gray-matter + next-mdx-remote
- **样式**: Tailwind CSS + Framer Motion
- **认证**: 短信验证码登录
- **数据库**: SQLite (Prisma ORM)
- **部署**: Docker

## 功能

- MDX 文章 & 项目时间线
- 标签系统 & 分类过滤
- 全文搜索
- 管理后台 (在线编辑 MDX)
- 站点地图 & RSS
- 友链页面
- 深色模式

## 本地开发

```bash
npm install
cp .env.example .env    # 编辑 .env 填写配置
npx prisma db push
npm run dev
```

打开 http://localhost:3000 查看。

## Docker 部署

```bash
docker build -t tech-blog .
docker run -p 3000:3000 --env-file .env tech-blog
```

## 目录结构

```
content/          # MDX 文章和项目
src/
  app/            # Next.js App Router 页面
  components/     # UI 组件
  constants/      # 站点配置、友链
  lib/            # 数据读取、工具函数
  types/          # TypeScript 类型
prisma/           # 数据库 Schema
```
