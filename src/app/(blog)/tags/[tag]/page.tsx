import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleGrid } from '@/components/home/ArticleGrid';
import { Container } from '@/components/layout/Container';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { getPostsByTag, getAllTags } from '@/lib/posts';
import { withViewCounts } from '@/lib/views';
import { SITE } from '@/constants/site';

export const revalidate = 300;

interface PageProps {
  params: { tag: string };
}

export function generateStaticParams() {
  return Array.from(getAllTags().keys()).map((tag) => ({ tag }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const tag = decodeURIComponent(params.tag);
  return {
    title: `标签: ${tag}`,
    description: `浏览 ${SITE.name} 中标记为「${tag}」的所有文章`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const tag = decodeURIComponent(params.tag);
  const posts = await withViewCounts(getPostsByTag(tag));

  if (posts.length === 0) notFound();

  return (
    <div className="section-padding">
      <Container>
        <Link
          href="/tags"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors mb-6"
        >
          ← 所有标签
        </Link>
        <AnimatedSection>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            {tag}
          </h1>
          <p className="text-muted mb-12">
            共 {posts.length} 篇文章
          </p>
        </AnimatedSection>

        <ArticleGrid posts={posts} />
      </Container>
    </div>
  );
}
