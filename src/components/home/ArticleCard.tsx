import Link from 'next/link';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatDate, normalizeCategorySlug } from '@/lib/utils';
import { getCategoryBySlug } from '@/constants/categories';
import type { Post } from '@/types/post';

interface ArticleCardProps {
  post: Post;
}

export function ArticleCard({ post }: ArticleCardProps) {
  const { slug, frontmatter, viewCount } = post;
  const categoryMeta = getCategoryBySlug(normalizeCategorySlug(frontmatter.category));

  return (
    <Link href={`/articles/${slug}`} className="group block">
      <article className="glass-card p-0 overflow-hidden h-full flex flex-col">
        {frontmatter.coverImage && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={frontmatter.coverImage}
              alt={frontmatter.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            {categoryMeta && (
              <span
                className={`text-xs font-medium bg-gradient-to-r ${categoryMeta.color} bg-clip-text text-transparent`}
              >
                {categoryMeta.name}
              </span>
            )}
            <span className="text-xs text-muted/40" aria-hidden="true">
              ·
            </span>
            <span className="text-xs text-muted/60">{formatDate(frontmatter.date)}</span>
          </div>

          <h3 className="text-lg font-semibold leading-snug tracking-tight mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
            {frontmatter.title}
          </h3>

          <p className="text-sm text-muted leading-relaxed line-clamp-2 flex-1">
            {frontmatter.description}
          </p>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/5 dark:border-white/5">
            <div className="flex flex-wrap gap-1.5">
              {frontmatter.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
            <span className="flex items-center gap-1 text-xs text-muted/50 whitespace-nowrap ml-2">
              <Eye className="w-3 h-3" />
              {viewCount} 次阅读
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
