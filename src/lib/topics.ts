import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import { extractHeadings } from '@/lib/utils';
import type { TopicMeta, Topic, TopicChapter, TopicChapterFrontmatter } from '@/types/topic';

const TOPICS_DIR = path.join(process.cwd(), 'content', 'topics');

function readJsonFile(filePath: string): Record<string, unknown> | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readTopicDir(topicSlug: string): fs.Dirent[] {
  const topicDir = path.join(TOPICS_DIR, topicSlug);
  try {
    return fs.readdirSync(topicDir, { withFileTypes: true });
  } catch {
    return [];
  }
}

export const getAllTopics = cache((): TopicMeta[] => {
  if (!fs.existsSync(TOPICS_DIR)) return [];

  const entries = fs.readdirSync(TOPICS_DIR, { withFileTypes: true });
  const topics: TopicMeta[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;

    // Read meta.json
    const meta = readJsonFile(path.join(TOPICS_DIR, slug, 'meta.json'));
    if (!meta) continue;

    // Count .mdx files
    const chapterFiles = fs
      .readdirSync(path.join(TOPICS_DIR, slug))
      .filter((f) => f.endsWith('.mdx'));

    topics.push({
      slug,
      title: (meta.title as string) || slug,
      description: (meta.description as string) || '',
      icon: (meta.icon as string) || 'book-open',
      chapterCount: chapterFiles.length,
    });
  }

  return topics;
});

export function getTopicBySlug(slug: string): Topic | null {
  const topicDir = path.join(TOPICS_DIR, slug);
  if (!fs.existsSync(topicDir)) return null;

  const meta = readJsonFile(path.join(topicDir, 'meta.json'));
  if (!meta) return null;

  const entries = readTopicDir(slug);
  const chapters: TopicChapter[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue;

    const filePath = path.join(topicDir, entry.name);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);

    const frontmatter = data as TopicChapterFrontmatter;

    // Derive chapter slug from filename (remove .mdx)
    const chapterSlug = entry.name.replace(/\.mdx$/, '');

    chapters.push({
      slug: chapterSlug,
      topic: slug,
      frontmatter: {
        title: frontmatter.title || chapterSlug,
        description: frontmatter.description || '',
        order: frontmatter.order || 0,
      },
      content,
      headings: extractHeadings(content),
    });
  }

  // Sort by order
  chapters.sort((a, b) => a.frontmatter.order - b.frontmatter.order);

  const topicMeta: TopicMeta = {
    slug,
    title: (meta.title as string) || slug,
    description: (meta.description as string) || '',
    icon: (meta.icon as string) || 'book-open',
    chapterCount: chapters.length,
  };

  return { meta: topicMeta, chapters };
}

export function getChapterBySlug(
  topicSlug: string,
  chapterSlug: string
): TopicChapter | null {
  const topicDir = path.join(TOPICS_DIR, topicSlug);
  if (!fs.existsSync(topicDir)) return null;

  const fileName = `${chapterSlug}.mdx`;
  const filePath = path.join(topicDir, fileName);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = data as TopicChapterFrontmatter;

  return {
    slug: chapterSlug,
    topic: topicSlug,
    frontmatter: {
      title: frontmatter.title || chapterSlug,
      description: frontmatter.description || '',
      order: frontmatter.order || 0,
    },
    content,
    headings: extractHeadings(content),
  };
}

export function getAdjacentChapters(
  topicSlug: string,
  chapterSlug: string
): {
  prev: TopicChapter | null;
  next: TopicChapter | null;
} {
  const topic = getTopicBySlug(topicSlug);
  if (!topic) return { prev: null, next: null };

  const idx = topic.chapters.findIndex((ch) => ch.slug === chapterSlug);
  if (idx === -1) return { prev: null, next: null };

  return {
    prev: idx > 0 ? topic.chapters[idx - 1] : null,
    next: idx < topic.chapters.length - 1 ? topic.chapters[idx + 1] : null,
  };
}
