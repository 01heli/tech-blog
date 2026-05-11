import { Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types/post';

interface ArticleHeaderProps {
  post: Post;
}

export function ArticleHeader({ post }: ArticleHeaderProps) {
  const { frontmatter, readingTime } = post;

  return (
    <header className="text-center pt-16 pb-8">
      <div className="max-w-3xl mx-auto px-6">
        <Badge variant="primary" size="md" className="mb-6">
          {frontmatter.category}
        </Badge>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-balance mb-6">
          {frontmatter.title}
        </h1>

        <p className="text-lg text-muted mb-6 max-w-xl mx-auto leading-relaxed">
          {frontmatter.description}
        </p>

        <div className="flex items-center justify-center gap-4 text-sm text-muted/60">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(frontmatter.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {readingTime} min read
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 mt-5">
          {frontmatter.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <hr className="mt-8 border-border" />
      </div>
    </header>
  );
}
