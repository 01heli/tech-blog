import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleGrid } from '@/components/home/ArticleGrid';
import { Container } from '@/components/layout/Container';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { getPostsByCategory } from '@/lib/posts';
import { CATEGORIES, getCategoryBySlug } from '@/constants/categories';
import { SITE } from '@/constants/site';

interface PageProps {
  params: { category: string };
}

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const cat = getCategoryBySlug(params.category);
  if (!cat) return { title: 'Not Found' };

  return {
    title: cat.name,
    description: `${cat.description} - ${SITE.name}`,
  };
}

export default function CategoryPage({ params }: PageProps) {
  const cat = getCategoryBySlug(params.category);
  if (!cat) notFound();

  const posts = getPostsByCategory(params.category);

  return (
    <div className="section-padding">
      <Container>
        <Link
          href="/categories"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors mb-6"
        >
          ← 所有分类
        </Link>
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`w-3 h-3 rounded-full bg-gradient-to-r ${cat.color}`}
            />
            <h1 className="text-4xl font-bold tracking-tight">{cat.name}</h1>
          </div>
          <p className="text-muted mb-2">{cat.description}</p>
          <p className="text-sm text-muted/50 mb-12">
            共 {posts.length} 篇文章
          </p>
        </AnimatedSection>

        {posts.length > 0 ? (
          <ArticleGrid posts={posts} />
        ) : (
          <AnimatedSection>
            <div className="text-center py-20">
              <p className="text-muted">这个分类下还没有文章</p>
            </div>
          </AnimatedSection>
        )}
      </Container>
    </div>
  );
}
