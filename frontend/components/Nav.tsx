'use client';

import { useState, useEffect, useRef } from 'react';

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className="fixed top-3 left-0 right-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-[1080px] flex items-center justify-between bg-white/78 backdrop-blur-[16px] saturate-[160%] border border-[var(--line)] rounded-full px-4 py-2 shadow-[0_10px_30px_-16px_rgba(10,18,40,0.18)]">
        <a href="#top" className="flex items-center gap-2 font-display font-bold text-base">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            <path d="M4 24L13 7L17 15L21 7L28 24" stroke="url(#g1)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="21" cy="7" r="2" fill="#00A3FF"/>
            <defs>
              <linearGradient id="g1" x1="4" y1="7" x2="28" y2="24">
                <stop stopColor="#0057FF"/>
                <stop offset="1" stopColor="#00A3FF"/>
              </linearGradient>
            </defs>
          </svg>
          AutoMind<span className="text-[var(--deep)]">Ai</span>
        </a>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-[var(--ink-soft)]">
          <a href="#services" className="transition hover:text-[var(--deep)]">Services</a>
          <a href="#industries" className="transition hover:text-[var(--deep)]">Solutions</a>
          <a href="#demo" className="transition hover:text-[var(--deep)]">Demo</a>
          <a href="#work" className="transition hover:text-[var(--deep)]">Work</a>
          <a href="#estimate" className="transition hover:text-[var(--deep)]">Estimate</a>
          <a href="/ai-lab" className="transition hover:text-[var(--deep)] font-semibold text-[var(--deep)]">AI Lab ✦</a>
          <a href="/admin/login" className="transition hover:text-[var(--deep)] text-[var(--ink-soft)]">🔒 Admin</a>
        </nav>

        <div className="flex items-center gap-3">
          <a href="#contact" className="hidden sm:inline-flex btn btn-primary btn-sm">Book a Free Consultation</a>
          <button
            className="md:hidden flex items-center justify-center bg-none border-none p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {open && (
        <div className="absolute top-full mt-2 left-4 right-4 bg-white rounded-2xl p-4 z-[70] md:hidden flex flex-col gap-1 shadow-xl">
          {['services', 'industries', 'demo', 'work', 'estimate', 'ai-lab', 'contact', 'admin'].map(s => (
            <a
              key={s}
              href={`/${s === 'services' ? '#services' : s === 'industries' ? '#industries' : s === 'ai-lab' ? 'ai-lab' : s === 'admin' ? 'admin/login' : '#' + s}`}
              className="block px-3 py-3 font-semibold border-b border-[var(--line)] last:border-0"
              onClick={() => setOpen(false)}
            >
              {s === 'services' ? 'Services' : s === 'industries' ? 'Solutions' : s === 'ai-lab' ? '✦ AI Lab' : s === 'admin' ? '🔒 Admin' : s === 'contact' ? 'Contact' : s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
