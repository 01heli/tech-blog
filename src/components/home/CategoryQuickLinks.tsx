import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';

export function CategoryQuickLinks() {
  return (
    <div className="relative">
      <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2 -mx-6 px-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-muted hover:text-foreground hover:scale-105 transition-all"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${cat.color}`}
            />
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
