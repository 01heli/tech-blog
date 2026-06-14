import type { Heading } from './post';

export interface TopicChapterFrontmatter {
  title: string;
  description: string;
  order: number;
}

export interface TopicChapter {
  slug: string;
  topic: string;
  frontmatter: TopicChapterFrontmatter;
  content: string;
  headings: Heading[];
}

export interface TopicMeta {
  slug: string;
  title: string;
  description: string;
  icon: string;
  chapterCount: number;
}

export interface Topic {
  meta: TopicMeta;
  chapters: TopicChapter[];
}
