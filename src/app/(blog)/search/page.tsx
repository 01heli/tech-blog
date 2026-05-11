import type { Metadata } from 'next';
import { SearchView } from './SearchView';
import { getAllPosts } from '@/lib/posts';
import { buildSearchIndex } from '@/lib/search';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = {
  title: '搜索',
  description: '搜索博客文章',
};

export default function SearchPage() {
  const posts = getAllPosts();
  const index = buildSearchIndex(posts);

  return (
    <div className="section-padding">
      <Container size="small">
        <SearchView index={index} />
      </Container>
    </div>
  );
}
