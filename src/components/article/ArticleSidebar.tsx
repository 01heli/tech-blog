'use client';

import { useEffect, useRef } from 'react';
import { useTableOfContents } from '@/hooks/useTableOfContents';
import { cn } from '@/lib/utils';
import type { Heading } from '@/types/post';

interface ArticleSidebarProps {
  headings: Heading[];
}

export function ArticleSidebar({ headings }: ArticleSidebarProps) {
  const activeId = useTableOfContents(headings);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!activeId || !navRef.current) return;
    const link = navRef.current.querySelector<HTMLAnchorElement>(`a[href="#${CSS.escape(activeId)}"]`);
    if (link) {
      link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeId]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden lg:block w-56 flex-shrink-0">
      <nav ref={navRef} className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
        <h4 className="text-xs font-semibold tracking-widest uppercase text-muted/50 mb-4">
          目录
        </h4>
        <ul className="space-y-1">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={cn(
                  'block text-sm py-1.5 transition-colors border-l-2 -ml-px',
                  h.level === 3 ? 'pl-5' : 'pl-3',
                  activeId === h.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-medium'
                    : 'border-transparent text-muted/60 hover:text-muted hover:border-border'
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
