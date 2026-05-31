import { prisma } from '@/lib/db/prisma';
import type { Post } from '@/types/post';

export async function getViewCount(slug: string): Promise<number> {
  try {
    const row = await prisma.articleView.findUnique({ where: { slug } });
    return row?.count ?? 0;
  } catch {
    return 0;
  }
}

export async function getViewCounts(slugs: string[]): Promise<Map<string, number>> {
  if (slugs.length === 0) return new Map();
  try {
    const rows = await prisma.articleView.findMany({
      where: { slug: { in: slugs } },
    });
    const map = new Map<string, number>();
    for (const r of rows) {
      map.set(r.slug, r.count);
    }
    return map;
  } catch {
    return new Map();
  }
}

export async function incrementViewCount(slug: string): Promise<number> {
  try {
    const row = await prisma.articleView.upsert({
      where: { slug },
      create: { slug, count: 1 },
      update: { count: { increment: 1 } },
    });
    return row.count;
  } catch {
    return 0;
  }
}

/** 为文章列表批量填充阅读次数 */
export async function withViewCounts(posts: Post[]): Promise<Post[]> {
  if (posts.length === 0) return posts;
  const slugs = posts.map((p) => p.slug);
  const counts = await getViewCounts(slugs);
  return posts.map((p) => ({ ...p, viewCount: counts.get(p.slug) ?? 0 }));
}

/** 为单篇文章填充阅读次数 */
export async function withViewCount(post: Post): Promise<Post> {
  const count = await getViewCount(post.slug);
  return { ...post, viewCount: count };
}
