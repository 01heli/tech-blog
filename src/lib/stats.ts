import { cache } from 'react';
import { getAllPosts, getAllTags } from './posts';
import { getAllProjects } from './projects';

export interface SiteStats {
  articleCount: number;
  totalWords: number;
  projectCount: number;
  tagCount: number;
}

function countWords(content: string): number {
  const chineseChars = (content.match(/[一-鿿]/g) || []).length;
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
  return chineseChars + englishWords;
}

export const getSiteStats = cache((): SiteStats => {
  const posts = getAllPosts();
  const projects = getAllProjects();
  const tags = getAllTags();

  const totalWords = posts.reduce((sum, p) => sum + countWords(p.content), 0);

  return {
    articleCount: posts.length,
    totalWords,
    projectCount: projects.length,
    tagCount: tags.size,
  };
});
