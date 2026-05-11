import type { Post } from '@/types/post';
import { ArticleCard } from './ArticleCard';
import { AnimatedSection } from '@/components/shared/AnimatedSection';

interface ArticleGridProps {
  posts: Post[];
}

export function ArticleGrid({ posts }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, i) => (
        <AnimatedSection key={post.slug} delay={i * 0.08}>
          <ArticleCard post={post} />
        </AnimatedSection>
      ))}
    </div>
  );
}
