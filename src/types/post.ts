export type Category =
  | 'MySQL'
  | 'Redis'
  | 'Docker'
  | 'Linux'
  | 'Go'
  | 'Python'
  | 'Kubernetes'
  | 'System Design'
  | 'DevOps'
  | 'Frontend';

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  category: Category;
  tags: string[];
  readingTime?: number;
  featured?: boolean;
  coverImage?: string;
}

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: number;
  headings: Heading[];
}
