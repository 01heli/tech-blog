import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { getAllTags } from '@/lib/posts';
import { SITE } from '@/constants/site';

export const metadata: Metadata = {
  title: '标签',
  description: `浏览 ${SITE.name} 所有文章标签`,
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="section-padding">
      <Container>
        <AnimatedSection>
          <h1 className="text-4xl font-bold tracking-tight mb-2">标签</h1>
          <p className="text-muted mb-12">
            共 {tags.size} 个标签
          </p>
        </AnimatedSection>

        {tags.size === 0 ? (
          <div className="py-12 text-center text-muted">
            暂无标签。
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {Array.from(tags).map(([tag, count]) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="group px-4 py-2 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all duration-200"
              >
                <span className="text-sm font-medium">{tag}</span>
                <span className="ml-2 text-xs text-muted bg-secondary px-1.5 py-0.5 rounded">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
