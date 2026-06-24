'use client';

import Reveal from './Reveal';

export default function Footer() {
  return (
    <footer className="bg-[var(--navy)] text-[#cdd9f2] py-10 md:py-14">
      <div className="wrap">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div>
            <a href="#top" className="flex items-center gap-2 font-display font-bold text-base text-white">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <path d="M4 24L13 7L17 15L21 7L28 24" stroke="#00A3FF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="21" cy="7" r="2" fill="#00A3FF"/>
              </svg>
              AutoMind<span className="text-[var(--electric)]">Ai</span>
            </a>
            <p className="mt-2 text-xs md:text-sm text-[#8ea3c9] max-w-[260px]">Where automation meets intelligence — AI systems, software and industrial automation built from Tunisia.</p>
            <div className="flex gap-2 md:gap-2.5 mt-3 md:mt-4">
              <a href="#" aria-label="Instagram" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/15 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.2" cy="6.8" r="1"/></svg></a>
              <a href="#" aria-label="LinkedIn" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/15 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 10v7M7 7v.01M12 17v-4.5a2 2 0 014 0V17M12 10v7"/></svg></a>
              <a href="#" aria-label="X" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/15 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4l16 16M20 4L4 20"/></svg></a>
            </div>
          </div>
          <div>
            <b className="block font-mono text-[10px] md:text-[11px] tracking-wider text-[#6f86b3] uppercase mb-2 md:mb-3">Company</b>
            <a href="#services" className="block text-xs md:text-sm mb-1.5 md:mb-2 transition hover:text-[var(--electric)]">Services</a>
            <a href="#work" className="block text-xs md:text-sm mb-1.5 md:mb-2 transition hover:text-[var(--electric)]">Work</a>
            <a href="#industries" className="block text-xs md:text-sm mb-1.5 md:mb-2 transition hover:text-[var(--electric)]">Solutions</a>
            <a href="#contact" className="block text-xs md:text-sm transition hover:text-[var(--electric)]">Contact</a>
          </div>
          <div>
            <b className="block font-mono text-[10px] md:text-[11px] tracking-wider text-[#6f86b3] uppercase mb-2 md:mb-3">Resources</b>
            <a href="#demo" className="block text-xs md:text-sm mb-1.5 md:mb-2 transition hover:text-[var(--electric)]">AI Demo</a>
            <a href="/ai-lab" className="block text-xs md:text-sm mb-1.5 md:mb-2 transition hover:text-[var(--electric)]">AI Lab ✦</a>
            <a href="#estimate" className="block text-xs md:text-sm mb-1.5 md:mb-2 transition hover:text-[var(--electric)]">Estimate</a>
            <a href="#" className="block text-xs md:text-sm mb-1.5 md:mb-2 transition hover:text-[var(--electric)]">Careers</a>
            <a href="#" className="block text-xs md:text-sm transition hover:text-[var(--electric)]">Blog</a>
          </div>
          <div>
            <b className="block font-mono text-[10px] md:text-[11px] tracking-wider text-[#6f86b3] uppercase mb-2 md:mb-3">Legal</b>
            <a href="#" className="block text-xs md:text-sm mb-1.5 md:mb-2 transition hover:text-[var(--electric)]">Privacy</a>
            <a href="#" className="block text-xs md:text-sm mb-1.5 md:mb-2 transition hover:text-[var(--electric)]">Terms</a>
            <a href="#" className="block text-xs md:text-sm transition hover:text-[var(--electric)]">Security</a>
            <a href="/admin/login" target="_blank" rel="noopener noreferrer" className="block text-xs md:text-sm transition hover:text-[var(--electric)] mt-1.5 md:mt-2">Admin</a>
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-center mt-8 md:mt-10 pt-4 md:pt-5 border-t border-white/8 text-[10px] md:text-xs text-[#6f86b3] gap-2">
          <span>© 2026 AutoMindAi. All rights reserved.</span>
          <span>Automate. Optimize. Scale.</span>
        </div>
      </div>
    </footer>
  );
}
