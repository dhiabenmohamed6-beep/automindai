'use client';

import { useState, useEffect } from 'react';
import Reveal from './Reveal';
import { fetchAPI } from '@/lib/api';

interface Industry {
  id: number;
  name: string;
  before_text: string;
  after_text: string;
  stats: [string, string][];
}

export default function Industries() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const d = industries[active];

  useEffect(() => {
    fetchAPI('industries')
      .then((data: { results?: Industry[] } | Industry[]) => {
        const results = Array.isArray(data) ? data : (data.results || []);
        setIndustries(results);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="industries" className="section">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">// Industry solutions</div>
          <h2 className="text-[clamp(24px,3.6vw,36px)]">Built for how your industry actually runs.</h2>
          <p className="lede text-sm md:text-base">Illustrative, typical ranges based on common automation outcomes — your results depend on your setup.</p>
        </Reveal>

        {loading ? (
          <div className="flex gap-2 overflow-x-auto my-6 md:my-8 pb-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-[var(--line)] bg-white animate-pulse w-20 md:w-24 h-7 md:h-8" />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto my-6 md:my-8 pb-1 scrollbar-hide">
            {industries.map((ind, i) => (
              <button
                key={ind.id}
                className={`shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-full border text-xs md:text-sm font-semibold transition ${i === active ? 'bg-[var(--navy)] text-white border-[var(--navy)]' : 'bg-white text-[var(--ink-soft)] border-[var(--line)]'}`}
                onClick={() => setActive(i)}
              >
                {ind.name}
              </button>
            ))}
          </div>
        )}

        <Reveal>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[var(--line)] rounded-[18px] overflow-hidden">
              <div className="p-5 md:p-7 bg-[var(--paper)]"><div className="h-4 bg-[var(--line)] rounded w-1/4 mb-3" /><div className="h-4 bg-[var(--line)] rounded w-full" /></div>
              <div className="p-5 md:p-7 bg-gradient-to-br from-[var(--navy)] to-[var(--navy-soft)]"><div className="h-4 bg-white/10 rounded w-1/4 mb-3" /><div className="h-4 bg-white/10 rounded w-full" /></div>
            </div>
          ) : d ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[var(--line)] rounded-[18px] overflow-hidden">
              <div className="p-5 md:p-7 bg-[var(--paper)]">
                <b className="font-mono text-[10px] md:text-[11px] tracking-wider text-[#7a87a3]">Before AI</b>
                <p className="mt-2 text-xs md:text-sm">{d.before_text}</p>
              </div>
              <div className="p-5 md:p-7 bg-gradient-to-br from-[var(--navy)] to-[var(--navy-soft)] text-white">
                <b className="font-mono text-[10px] md:text-[11px] tracking-wider text-[var(--electric)]">After AutoMindAi</b>
                <p className="mt-2 text-xs md:text-sm text-[#dbe5f7]">{d.after_text}</p>
                <div className="flex gap-3 md:gap-5 mt-4 md:mt-5 flex-wrap">
                  {d.stats.map(([val, label], si) => (
                    <div key={si}>
                      <b className="block font-display text-lg md:text-xl">{val}</b>
                      <span className="font-mono text-[10px] md:text-[10.5px] text-[#8ea3c9] uppercase">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
