'use client';

import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-14 h-7 rounded-full bg-black/5 dark:bg-white/10" />;
  }

  return (
    <button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full transition-colors duration-300 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"
      aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-black/10 dark:border-white/10 flex items-center justify-center transition-transform duration-300 ${
          isDark ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-blue-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </span>
    </button>
  );
}
