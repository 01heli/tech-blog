import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug, getAdjacentPosts } from '@/lib/posts';
import { withViewCount } from '@/lib/views';
import { SITE } from '@/constants/site';
import { ArticleHeader } from '@/components/article/ArticleHeader';
import { ArticleContent } from '@/components/article/ArticleContent';
import { ArticleSidebar } from '@/components/article/ArticleSidebar';
import { ArticleNavigation } from '@/components/article/ArticleNavigation';
import { ReadingProgress } from '@/components/layout/ReadingProgress';
import { Container } from '@/components/layout/Container';
import { AdminEditButton } from '@/components/admin/AdminEditButton';
import { ViewTracker } from '@/components/shared/ViewTracker';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Not Found' };

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: 'article',
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
      siteName: SITE.name,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const enrichedPost = await withViewCount(post);
  const { prev, next } = getAdjacentPosts(params.slug);

  return (
    <>
      <ReadingProgress />
      <div className="section-padding pb-0">
        <Container>
          <Link
            href="/articles"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors"
          >
            ← 返回文章列表
          </Link>
        </Container>
      </div>
      <article>
        <ArticleHeader post={enrichedPost} />

        <Container>
          <div className="lg:flex lg:gap-12">
            <ArticleSidebar headings={post.headings} />
            <div className="flex-1 min-w-0 max-w-3xl pb-16">
              <ArticleContent content={post.content} />
            </div>
          </div>
        </Container>

        <ArticleNavigation prev={prev} next={next} />
      </article>
      <AdminEditButton slug={params.slug} />
      <ViewTracker slug={params.slug} />
    </>
  );
}
