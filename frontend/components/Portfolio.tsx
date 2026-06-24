'use client';

import { useState, useEffect } from 'react';
import Reveal from './Reveal';
import { fetchAPI } from '@/lib/api';

interface PortfolioItem {
  id: number;
  title: string;
  tag: string;
  category: string;
  icon: string;
  description: string;
  stack: string[];
  image: string | null;
}

const PF_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'automation', label: 'Automation & Agents' },
  { value: 'chatbot', label: 'Chatbots & Agents' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'web', label: 'Web / Software' },
  { value: 'mobile', label: 'Mobile' },
];

const GRAD = ['from-[#0057FF] to-[#00A3FF]', 'from-[#00102E] to-[#0057FF]', 'from-[#0057FF] to-[#7fd2ff]', 'from-[#001a4d] to-[#00a3ff]'];

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('all');
  const [query, setQuery] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchAPI('portfolio')
      .then((data: { results?: PortfolioItem[] } | PortfolioItem[]) => {
        const results = Array.isArray(data) ? data : (data.results || []);
        const processed = results.map((p) => ({
          ...p,
          image: p.image ? (p.image.startsWith('http') ? p.image : `http://localhost:8000${p.image}`) : null,
        }));
        setItems(processed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleImgError(id: number) {
    setImgErrors(prev => new Set(prev).add(id));
  }

  const filtered = items.filter((p) => {
    const catMatch = active === 'all' || p.category === active;
    const qMatch = p.title.toLowerCase().includes(query.toLowerCase());
    return catMatch && qMatch;
  });

  return (
    <section id="work" className="section bg-[var(--paper)]">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">// Capabilities in action</div>
          <h2>Concepts we build — swap in your own case studies.</h2>
        </Reveal>

        <Reveal>
          <div className="flex flex-wrap gap-3 items-center justify-between mt-6 mb-5">
            <div className="flex gap-2 flex-wrap">
              {PF_FILTERS.map((f) => (
                <button
                  key={f.value}
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${active === f.value ? 'bg-[var(--deep)] text-white border-[var(--deep)]' : 'bg-white text-[var(--ink-soft)] border-[var(--line)]'}`}
                  onClick={() => setActive(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <input
              className="px-3 py-1.5 rounded-full border border-[var(--line)] text-xs min-w-[160px] font-body"
              placeholder="Search projects…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-[var(--line)] rounded-[12px] overflow-hidden animate-pulse">
                <div className="h-[120px] bg-[var(--paper)]" />
                <div className="p-4"><div className="h-4 bg-[var(--paper)] rounded w-1/4 mb-2" /><div className="h-5 bg-[var(--paper)] rounded w-3/4 mb-2" /><div className="h-3 bg-[var(--paper)] rounded w-full" /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((p, i) => {
              const realIdx = items.indexOf(p);
              return (
                <div key={p.id} className="bg-white border border-[var(--line)] rounded-[12px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-22px_rgba(0,87,255,0.4)] cursor-pointer" onClick={() => setOpenIdx(openIdx === realIdx ? null : realIdx)}>
                  <div className={`h-[120px] relative flex items-center justify-center text-white ${p.image && !imgErrors.has(p.id) ? '' : `bg-gradient-to-br ${GRAD[i % GRAD.length]}`}`}>
                    {p.image && !imgErrors.has(p.id) ? (
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" onError={() => handleImgError(p.id)} />
                    ) : (
                      <svg viewBox="0 0 120 80" fill="none" className="w-8 h-8 opacity-90"><rect x="10" y="45" width="28" height="25" rx="3" fill="rgba(255,255,255,.15)"/><rect x="15" y="30" width="18" height="18" rx="2" fill="rgba(255,255,255,.2)"/><rect x="46" y="35" width="28" height="35" rx="3" fill="rgba(255,255,255,.15)"/><rect x="51" y="20" width="18" height="18" rx="2" fill="rgba(255,255,255,.2)"/><rect x="82" y="25" width="28" height="45" rx="3" fill="rgba(255,255,255,.15)"/><path d="M54 15l10-8m0 0l10 8m-10-8v16" stroke="rgba(255,255,255,.6)" strokeWidth="1.5" strokeLinecap="round"/><circle cx="88" cy="10" r="3" fill="#3df07a"/><path d="M8 72h104" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"/></svg>
                    )}
                  </div>
                  <div className="p-4 bg-white">
                    <span className="font-mono text-[10.5px] text-[var(--deep)] uppercase tracking-wider">{p.tag}</span>
                    <h3 className="text-[15.5px] mt-1 mb-1">{p.title}</h3>
                    <p className="text-xs text-[var(--ink-soft)]">{p.description}</p>
                  </div>
                  <div className={`px-4 pb-4 text-xs border-t border-[var(--line)] mt-0 pt-3 ${openIdx === realIdx ? 'block' : 'hidden'}`}>
                    <p className="mb-2">{p.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      {p.stack.map((s, si) => (
                        <span key={si} className="font-mono text-[10.5px] bg-[var(--paper)] px-2 py-1 rounded-md text-[var(--ink-soft)]">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && <p className="font-mono text-xs text-[var(--ink-soft)] col-span-2">No projects match that search.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
