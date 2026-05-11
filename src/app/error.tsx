'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">出错了</h2>
        <p className="text-muted mb-6">抱歉，页面发生了一些问题。</p>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium"
        >
          重试
        </button>
      </div>
    </div>
  );
}
