'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { searchPosts } from '@/lib/search';
import { useDebounce } from '@/hooks/useDebounce';
import type { SearchIndexEntry } from '@/lib/search';

interface SearchViewProps {
  index: SearchIndexEntry[];
}

export function SearchView({ index }: SearchViewProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);

  const results = useMemo(
    () => searchPosts(debouncedQuery, index),
    [debouncedQuery, index]
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="py-8">
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted/40" />
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文章... (Cmd+K)"
          className="w-full h-14 pl-12 pr-12 rounded-2xl glass text-base placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4 text-muted/60" />
          </button>
        )}
      </div>

      {query && (
        <p className="text-sm text-muted/60 mb-6">
          找到 {results.length} 篇相关文章
        </p>
      )}

      {query && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted mb-2">未找到相关文章</p>
          <p className="text-sm text-muted/50">尝试使用不同的关键词搜索</p>
        </div>
      )}

      <div className="space-y-3">
        {results.map((result) => (
          <Link
            key={result.slug}
            href={`/articles/${result.slug}`}
            className="block glass-card p-5 hover:scale-[1.005] transition-all"
          >
            <div className="flex items-center gap-3 mb-1.5">
              <Badge variant="primary">{result.category}</Badge>
              <span className="text-xs text-muted/50">
                {formatDate(result.date)}
              </span>
            </div>
            <h3 className="text-base font-semibold mb-1">{result.title}</h3>
            <p className="text-sm text-muted line-clamp-1">
              {result.description}
            </p>
          </Link>
        ))}

        {!query && (
          <div className="text-center py-16">
            <p className="text-muted">输入关键词开始搜索</p>
            <p className="text-sm text-muted/50 mt-1">
              可按标题、描述、标签和分类搜索
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
