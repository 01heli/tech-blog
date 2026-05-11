'use client';

import { useEffect, useRef } from 'react';

const MAX_PARTICLES = 80;
const CONNECT_DISTANCE = 160;

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx!.scale(dpr, dpr);
    }

    function createParticles() {
      const count = Math.min(
        MAX_PARTICLES,
        Math.floor((window.innerWidth * window.innerHeight) / 18000)
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 1.8 + 0.4,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Spatial grid for O(n*k) instead of O(n^2) distance checks
      const cellSize = CONNECT_DISTANCE;
      const grid = new Map<string, number[]>();
      particles.forEach((p, i) => {
        const key = `${Math.floor(p.x / cellSize)},${Math.floor(p.y / cellSize)}`;
        const cell = grid.get(key);
        if (cell) cell.push(i);
        else grid.set(key, [i]);
      });

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(148, 163, 184, 0.15)';
        ctx!.fill();

        // Check only neighboring grid cells
        const cx = Math.floor(p.x / cellSize);
        const cy = Math.floor(p.y / cellSize);
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const key = `${cx + dx},${cy + dy}`;
            const cell = grid.get(key);
            if (!cell) continue;
            for (const j of cell) {
              if (j <= i) continue;
              const q = particles[j];
              const diffX = p.x - q.x;
              const diffY = p.y - q.y;
              const dist = Math.sqrt(diffX * diffX + diffY * diffY);
              if (dist < CONNECT_DISTANCE) {
                ctx!.beginPath();
                ctx!.moveTo(p.x, p.y);
                ctx!.lineTo(q.x, q.y);
                ctx!.strokeStyle = `rgba(148, 163, 184, ${0.06 * (1 - dist / CONNECT_DISTANCE)})`;
                ctx!.lineWidth = 0.5;
                ctx!.stroke();
              }
            }
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    const onResize = () => {
      resize();
      createParticles();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
