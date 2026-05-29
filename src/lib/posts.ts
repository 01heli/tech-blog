import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import matter from 'gray-matter';
import type { Post, PostFrontmatter } from '@/types/post';
import { calculateReadingTime, extractHeadings, normalizeCategorySlug } from './utils';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

export const getAllPosts = cache((): Post[] => {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'));

  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), 'utf-8');
    const { data, content } = matter(raw);

    const frontmatter = data as PostFrontmatter;
    const readingTime = frontmatter.readingTime || calculateReadingTime(content);
    const headings = extractHeadings(content);

    return {
      slug: filename.replace(/\.mdx$/, ''),
      frontmatter,
      content,
      readingTime,
      headings,
    } as Post;
  });

  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
});

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = data as PostFrontmatter;

  return {
    slug,
    frontmatter,
    content,
    readingTime: frontmatter.readingTime || calculateReadingTime(content),
    headings: extractHeadings(content),
  } as Post;
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter(
    (p) => normalizeCategorySlug(p.frontmatter.category) === category
  );
}

export function getFeaturedPosts(limit = 4): Post[] {
  const featured = getAllPosts().filter((p) => p.frontmatter.featured);
  if (featured.length > 0) return featured.slice(0, limit);
  return getAllPosts().slice(0, limit);
}

export function getAdjacentPosts(slug: string): {
  prev: Post | null;
  next: Post | null;
} {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.tags?.includes(tag));
}

export function getAllTags(): Map<string, number> {
  const tagMap = new Map<string, number>();
  getAllPosts().forEach((post) => {
    post.frontmatter.tags?.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });
  return new Map(Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]));
}
