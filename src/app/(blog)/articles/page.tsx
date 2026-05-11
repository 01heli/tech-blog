import type { Metadata } from 'next';
import { ArticleGrid } from '@/components/home/ArticleGrid';
import { Container } from '@/components/layout/Container';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { getAllPosts } from '@/lib/posts';
import { SITE } from '@/constants/site';

export const metadata: Metadata = {
  title: '所有文章',
  description: `${SITE.name} 所有技术文章列表`,
};

export default function ArticlesPage() {
  const posts = getAllPosts();

  return (
    <div className="section-padding">
      <Container>
        <AnimatedSection>
          <h1 className="text-4xl font-bold tracking-tight mb-2">文章</h1>
          <p className="text-muted mb-12">
            共 {posts.length} 篇文章，涵盖后端、数据库、容器化与云原生技术
          </p>
        </AnimatedSection>

        <ArticleGrid posts={posts} />
      </Container>
    </div>
  );
}
