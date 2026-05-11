'use client';

import { useState, useEffect, useRef } from 'react';

export function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    function updateProgress() {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = undefined;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const maxScroll = docHeight - winHeight;

        if (maxScroll <= 0) {
          setProgress(100);
          return;
        }

        setProgress(Math.min(100, Math.floor((scrollTop / maxScroll) * 100)));
      });
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => {
      window.removeEventListener('scroll', updateProgress);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return progress;
}
