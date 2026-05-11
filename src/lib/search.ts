import type { Post } from '@/types/post';

export interface SearchIndexEntry {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
}

export function buildSearchIndex(posts: Post[]): SearchIndexEntry[] {
  return posts.map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    category: post.frontmatter.category,
    tags: post.frontmatter.tags,
    date: post.frontmatter.date,
  }));
}

export function searchPosts(
  query: string,
  index: SearchIndexEntry[]
): SearchIndexEntry[] {
  if (!query.trim()) return index.slice(0, 8);

  const q = query.toLowerCase();
  const scored = index
    .map((entry) => {
      let score = 0;
      if (entry.title.toLowerCase().includes(q)) score += 10;
      if (entry.description.toLowerCase().includes(q)) score += 5;
      if (entry.category.toLowerCase().includes(q)) score += 3;
      if (entry.tags.some((t) => t.toLowerCase().includes(q))) score += 4;

      const words = q.split(/\s+/);
      const titleWords = entry.title.toLowerCase().split(/\s+/);
      if (words.every((w) => titleWords.some((tw) => tw.includes(w)))) score += 8;

      return { entry, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((s) => s.entry);
}
