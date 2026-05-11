'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    <html>
      <body className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-bg))] text-[rgb(var(--color-fg))]">
        <div className="text-center px-6">
          <h2 className="text-xl font-semibold mb-2">出错了</h2>
          <p className="text-neutral-500 mb-6">抱歉，发生了严重错误。</p>
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-medium"
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
