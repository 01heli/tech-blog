import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import GithubSlugger from 'github-slugger';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const chineseChars = (content.match(/[一-鿿]/g) || []).length;
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
  const totalWords = chineseChars + englishWords;
  return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
}

export function normalizeCategorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

export function extractHeadings(content: string) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { level: number; text: string; id: string }[] = [];
  const slugger = new GithubSlugger();
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2].trim();
    headings.push({
      level: match[1].length,
      text,
      id: slugger.slug(text),
    });
  }
  return headings;
}
