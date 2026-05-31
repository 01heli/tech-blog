'use client';

import { useEffect, useRef } from 'react';

interface ViewTrackerProps {
  slug: string;
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    // StrictMode 下 useEffect 会执行两次，用 ref 防止重复计数
    if (tracked.current) return;
    tracked.current = true;

    fetch(`/api/views/${slug}`, { method: 'POST' }).catch(() => {
      // 静默失败，不影响页面体验
    });
  }, [slug]);

  return null;
}
