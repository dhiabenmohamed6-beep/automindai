'use client';

import { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const hero = canvas.parentElement;
    if (!hero) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W: number, H: number;
    let nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    let mouse = { x: -9999, y: -9999 };

    function size() {
      if (!canvas || !hero) return;
      W = canvas.width = hero.offsetWidth * devicePixelRatio;
      H = canvas.height = hero.offsetHeight * devicePixelRatio;
      canvas.style.width = hero.offsetWidth + 'px';
      canvas.style.height = hero.offsetHeight + 'px';
    }

    function init() {
      size();
      const count = window.innerWidth < 720 ? 26 : 46;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        r: (Math.random() * 1.4 + 1) * devicePixelRatio,
      }));
    }

    function step() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160 * devicePixelRatio) {
          n.x += dx * 0.0009 * devicePixelRatio;
          n.y += dy * 0.0009 * devicePixelRatio;
        }
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 150 * devicePixelRatio;
          if (dist < maxDist) {
            const mdist = Math.min(Math.sqrt((mouse.x - (a.x + b.x) / 2) ** 2 + (mouse.y - (a.y + b.y) / 2) ** 2), 9999);
            const near = mdist < 200 * devicePixelRatio;
            ctx.strokeStyle = near
              ? `rgba(0,87,255,${0.22 * (1 - dist / maxDist) + 0.12})`
              : `rgba(0,87,255,${0.10 * (1 - dist / maxDist)})`;
            ctx.lineWidth = devicePixelRatio * 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, 7);
        ctx.fillStyle = 'rgba(0,87,255,0.55)';
        ctx.fill();
      });
      if (!reduced) requestAnimationFrame(step);
    }

    const onResize = () => init();
    const onMouseMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) * devicePixelRatio;
      mouse.y = (e.clientY - r.top) * devicePixelRatio;
    };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onVisibility = () => { if (!document.hidden && !reduced) requestAnimationFrame(step); };

    window.addEventListener('resize', onResize);
    hero.addEventListener('mousemove', onMouseMove);
    hero.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('visibilitychange', onVisibility);

    init();
    if (!reduced) step();

    return () => {
      window.removeEventListener('resize', onResize);
      hero.removeEventListener('mousemove', onMouseMove);
      hero.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} id="network" className="absolute inset-0 w-full h-full" />;
}
