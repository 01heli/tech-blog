export type ProjectStatus = '进行中' | '已完成' | '维护中' | '已暂停' | '已取消';

export interface WorkEntry {
  date: string;
  content: string;
}

export interface ProjectFrontmatter {
  title: string;
  description?: string;
  date: string;
  status: ProjectStatus;
  techStack?: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  coverImage?: string;
}

export interface Project {
  slug: string;
  frontmatter: ProjectFrontmatter;
  timeline: WorkEntry[];
}
