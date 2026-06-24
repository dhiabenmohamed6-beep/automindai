'use client';

import { useEffect, useRef } from 'react';

const TIPS = ['Need a hand?', 'Try the AI demo below ↓', 'I can fetch you an estimate', 'Ask AURA anything!', '24/7, just like our bots'];

export default function AutoPet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);
  const hasMouse = useRef(false);
  const pos = useRef<{ x: number; y: number; tx: number; ty: number }>({ x: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 0, y: 220, tx: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 0, ty: 220 });
  const tipIdx = useRef(0);
  const showBubble = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = containerRef.current;
    const body = bodyRef.current;
    const bubble = bubbleRef.current;
    if (!container || !body || !bubble) return;

    const move = (e: MouseEvent) => {
      hasMouse.current = true;
      pos.current.tx = Math.min(e.clientX + 36, window.innerWidth - 90);
      pos.current.ty = Math.min(e.clientY + 36, window.innerHeight - 90);
    };

    const loop = () => {
      pos.current.x += (pos.current.tx - pos.current.x) * 0.08;
      pos.current.y += (pos.current.ty - pos.current.y) * 0.08;
      container.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      if (!reduced.current) requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', move);

    if (!reduced.current) {
      loop();
      // blink every 3.4s
      const blinkIv = setInterval(() => {
        body.style.transform = 'scaleY(0.15)';
        setTimeout(() => { body.style.transform = ''; }, 140);
      }, 3400);
      // tip every 14s
      const tipIv = setInterval(() => {
        if (!hasMouse.current) return;
        tipIdx.current = (tipIdx.current + 1) % TIPS.length;
        bubble.textContent = TIPS[tipIdx.current];
        showBubble.current = true;
        requestAnimationFrame(() => { if (bubble) bubble.classList.add('show'); });
        setTimeout(() => {
          if (bubble) bubble.classList.remove('show');
          showBubble.current = false;
        }, 2600);
      }, 14000);

      // expose happy hook for contact form
      (window as any).petHappyHook = () => {
        body.classList.add('happy');
        bubble.textContent = 'Yay! 🎉';
        showBubble.current = true;
        if (bubble) bubble.classList.add('show');
        setTimeout(() => {
          body.classList.remove('happy');
          if (bubble) bubble.classList.remove('show');
          showBubble.current = false;
        }, 900);
      };

      return () => {
        window.removeEventListener('mousemove', move);
        clearInterval(blinkIv);
        clearInterval(tipIv);
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-[36px] h-[36px] md:w-[46px] md:h-[46px] z-[80] pointer-events-none">
      <div ref={bodyRef} className="pet-body w-full h-full relative floaty">
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
          <rect x="10" y="16" width="44" height="36" rx="16" fill="#fff" stroke="#0057FF" strokeWidth="2"/>
          <rect x="26" y="6" width="12" height="10" rx="4" fill="#fff" stroke="#0057FF" strokeWidth="2"/>
          <circle cx="32" cy="6" r="2" fill="#00A3FF"/>
          <rect x="20" y="29" width="8" height="10" rx="4" fill="#00A3FF"/>
          <rect x="36" y="29" width="8" height="10" rx="4" fill="#00A3FF"/>
          <path d="M26 45c2 2 10 2 12 0" stroke="#0057FF" strokeWidth="2" strokeLinecap="round"/>
          <rect x="2" y="30" width="6" height="4" rx="2" fill="#0057FF"/>
          <rect x="56" y="30" width="6" height="4" rx="2" fill="#0057FF"/>
        </svg>
        <div ref={bubbleRef} className="pet-bubble">Hi! I'm AUTO 👋</div>
      </div>
    </div>
  );
}
