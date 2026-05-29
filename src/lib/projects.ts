import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import matter from 'gray-matter';
import type { Project, ProjectFrontmatter, WorkEntry } from '@/types/project';

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

const DATE_HEADING_RE = /^## (\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2}:\d{2})?)$/;

function parseTimeline(content: string): WorkEntry[] {
  const lines = content.split('\n');
  const entries: WorkEntry[] = [];
  let currentDate = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const match = line.match(DATE_HEADING_RE);
    if (match) {
      if (currentDate && currentContent.length > 0) {
        entries.push({ date: currentDate, content: currentContent.join('\n').trim() });
      }
      currentDate = match[1];
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentDate && currentContent.length > 0) {
    entries.push({ date: currentDate, content: currentContent.join('\n').trim() });
  }

  return entries.reverse();
}

function parseProjectFile(filename: string): Project | null {
  const filePath = path.join(PROJECTS_DIR, filename);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = data as ProjectFrontmatter;

  return {
    slug: filename.replace(/\.mdx$/, ''),
    frontmatter,
    timeline: parseTimeline(content),
  };
}

export const getAllProjects = cache((): Project[] => {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.mdx'));

  const projects = files
    .map((filename) => parseProjectFile(filename))
    .filter((p): p is Project => p !== null);

  return projects.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
});

export function getProjectBySlug(slug: string): Project | null {
  return parseProjectFile(`${slug}.mdx`);
}
