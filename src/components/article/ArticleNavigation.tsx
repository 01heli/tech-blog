import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Post } from '@/types/post';

interface ArticleNavigationProps {
  prev: Post | null;
  next: Post | null;
}

export function ArticleNavigation({ prev, next }: ArticleNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto px-6 pt-8 pb-16">
      {prev ? (
        <Link
          href={`/articles/${prev.slug}`}
          className="group glass-card p-5 hover:scale-[1.01] transition-all"
        >
          <span className="flex items-center gap-1 text-xs text-muted/50 mb-2">
            <ArrowLeft className="w-3 h-3" />
            上一篇
          </span>
          <span className="text-sm font-medium line-clamp-2 group-hover:text-blue-500 transition-colors">
            {prev.frontmatter.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/articles/${next.slug}`}
          className="group glass-card p-5 hover:scale-[1.01] transition-all text-right"
        >
          <span className="flex items-center justify-end gap-1 text-xs text-muted/50 mb-2">
            下一篇
            <ArrowRight className="w-3 h-3" />
          </span>
          <span className="text-sm font-medium line-clamp-2 group-hover:text-blue-500 transition-colors">
            {next.frontmatter.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
