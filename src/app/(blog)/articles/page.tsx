import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleGrid } from '@/components/home/ArticleGrid';
import { Container } from '@/components/layout/Container';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { getAllPosts } from '@/lib/posts';
import { SITE } from '@/constants/site';

const PER_PAGE = 6;

export const metadata: Metadata = {
  title: '所有文章',
  description: `${SITE.name} 所有技术文章列表`,
};

export default function ArticlesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / PER_PAGE);
  const currentPage = Math.min(
    Math.max(1, parseInt(searchParams.page || '1') || 1),
    totalPages || 1
  );
  const posts = allPosts.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  return (
    <div className="section-padding">
      <Container>
        <AnimatedSection>
          <h1 className="text-4xl font-bold tracking-tight mb-2">文章</h1>
          <p className="text-muted mb-12">
            共 {allPosts.length} 篇文章
            {totalPages > 1 && ` · 第 ${currentPage}/${totalPages} 页`}
          </p>
        </AnimatedSection>

        <ArticleGrid posts={posts} />

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-border">
            {currentPage > 1 && (
              <Link
                href={`/articles${currentPage === 2 ? '' : `?page=${currentPage - 1}`}`}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
              >
                ← 上一页
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/articles${page === 1 ? '' : `?page=${page}`}`}
                className={`w-9 h-9 rounded-lg text-sm flex items-center justify-center transition-colors ${
                  page === currentPage
                    ? 'bg-foreground text-background font-medium'
                    : 'border border-border hover:bg-secondary'
                }`}
              >
                {page}
              </Link>
            ))}
            {currentPage < totalPages && (
              <Link
                href={`/articles?page=${currentPage + 1}`}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
              >
                下一页 →
              </Link>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
