'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { searchPosts } from '@/lib/search';
import { useDebounce } from '@/hooks/useDebounce';
import type { SearchIndexEntry } from '@/lib/search';

interface SearchDialogProps {
  index: SearchIndexEntry[];
}

export function SearchDialog({ index }: SearchDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 200);

  const results = useMemo(
    () => searchPosts(debouncedQuery, index),
    [debouncedQuery, index]
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const selectResult = useCallback(
    (slug: string) => {
      setOpen(false);
      router.push(`/articles/${slug}`);
    },
    [router]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIdx]) {
      selectResult(results[selectedIdx].slug);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[61] w-full max-w-lg"
          >
            <div className="glass rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden">
              <div className="flex items-center border-b border-black/5 dark:border-white/10 px-4">
                <Search className="w-4 h-4 text-muted/40 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="搜索文章..."
                  className="flex-1 h-12 px-3 bg-transparent text-sm placeholder:text-muted/40 focus:outline-none"
                  role="combobox"
                  aria-expanded={results.length > 0}
                  aria-controls="search-results"
                  aria-activedescendant={results[selectedIdx] ? `search-result-${selectedIdx}` : undefined}
                />
                <button
                  onClick={() => setOpen(false)}
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-muted/60 hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {results.length > 0 && (
                <div className="max-h-80 overflow-y-auto p-2" role="listbox" id="search-results">
                  {results.map((result, i) => (
                    <button
                      key={result.slug}
                      id={`search-result-${i}`}
                      role="option"
                      aria-selected={i === selectedIdx}
                      onClick={() => selectResult(result.slug)}
                      onMouseEnter={() => setSelectedIdx(i)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                        i === selectedIdx
                          ? 'bg-blue-500/10 dark:bg-blue-500/20'
                          : 'hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="primary">{result.category}</Badge>
                        <span className="text-xs text-muted/50">
                          {formatDate(result.date)}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{result.title}</p>
                      <p className="text-xs text-muted/60 line-clamp-1 mt-0.5">
                        {result.description}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {query && results.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted">未找到相关文章</p>
                </div>
              )}

              {!query && (
                <div className="py-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted/40">
                    <span className="flex items-center gap-1">
                      <CornerDownLeft className="w-3 h-3" />
                      选择
                    </span>
                    <span>上下键导航</span>
                    <span>Esc 关闭</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
