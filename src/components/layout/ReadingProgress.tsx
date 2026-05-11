'use client';

import { useReadingProgress } from '@/hooks/useReadingProgress';

export function ReadingProgress() {
  const progress = useReadingProgress();

  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-[3px] bg-black/5 dark:bg-white/5">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
