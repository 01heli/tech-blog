import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types/post';

interface FeaturedArticleProps {
  post: Post;
}

export function FeaturedArticle({ post }: FeaturedArticleProps) {
  const { slug, frontmatter, readingTime } = post;

  return (
    <Link href={`/articles/${slug}`} className="group block">
      <article className="glass-card overflow-hidden relative">
        <div className="p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="primary">{frontmatter.category}</Badge>
            <span className="text-sm text-muted/60">{formatDate(frontmatter.date)}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-4 group-hover:text-blue-500 transition-colors">
            {frontmatter.title}
          </h2>

          <p className="text-muted leading-relaxed mb-6 max-w-2xl">
            {frontmatter.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-sm text-muted/50">
                <Clock className="w-3.5 h-3.5" />
                {readingTime} min read
              </span>
              <div className="flex gap-1.5">
                {frontmatter.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-blue-500 group-hover:gap-2 transition-all">
              阅读全文
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
