'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';
import Reveal from './Reveal';

interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  bullets: string[];
  cover_image: string | null;
  cover_gradient: string;
}

const ICONS: Record<string, React.ReactNode> = {
  automation: <><circle cx="9.5" cy="14" r="1.4" fill="currentColor" stroke="none"/><circle cx="14.5" cy="14" r="1.4" fill="currentColor" stroke="none"/></>,
  agent: <><circle cx="9.5" cy="14.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="14.5" cy="14.5" r="1.3" fill="currentColor" stroke="none"/></>,
  chatbot: <><circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="13" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="17" cy="10" r="1" fill="currentColor" stroke="none"/></>,
  web: <><rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" fill="none"/><line x1="3" y1="8" x2="21" y2="8" stroke="currentColor" strokeWidth="1.7"/></>,
  software: <><path d="M9 4l-6 4 6 4M15 4l6 4-6 4" stroke="currentColor" strokeWidth="1.7" fill="none"/><rect x="3" y="14" width="18" height="6" rx="1" stroke="currentColor" strokeWidth="1.7" fill="none"/></>,
  mobile: <><rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" fill="none"/><circle cx="12" cy="18" r="1.2" fill="currentColor" stroke="none"/><line x1="9" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="1.2"/></>,
  industrial: <><rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" fill="none"/><circle cx="8" cy="14" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="14" r="1.2" fill="currentColor" stroke="none"/><path d="M8 5v3M16 5v3" stroke="currentColor" strokeWidth="1.4"/></>,
  consulting: <><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" fill="none"/><path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></>,
  workflow: <><rect x="3" y="6" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none"/><rect x="13" y="6" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none"/><rect x="7.5" y="14" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M6 8h3.5M14 8h3.5M8.5 14h3.5" stroke="currentColor" strokeWidth="1.4"/></>,
  crm: <><circle cx="7" cy="10" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="10" r="1.5" fill="currentColor" stroke="none"/><circle cx="17" cy="10" r="1.5" fill="currentColor" stroke="none"/><path d="M5 15h14M7 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
  erp: <><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" fill="none"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.4"/><line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="1.4"/></>,
  support: <><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.7" fill="none"/><path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></>,
  marketing: <><path d="M4 20L8 4l4 16M16 4l4 16M8 12h8" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
  voice: <><path d="M12 3a6 6 0 016 6c0 3-2 4.5-2 7H8c0-2.5-2-4-2-7a6 6 0 016-6z" stroke="currentColor" strokeWidth="1.7" fill="none"/><path d="M9.5 19h5M10.5 21.5h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></>,
};

function ServiceIcon({ icon }: { icon: string }) {
  const base = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">{ICONS[icon]}</svg>;
  return base;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchAPI('services')
      .then((data: { results?: Service[] } | Service[]) => {
        const results = Array.isArray(data) ? data : (data.results || []);
        const processed = results.map((s) => ({
          ...s,
          cover_image: s.cover_image ? (s.cover_image.startsWith('http') ? s.cover_image : `http://localhost:8000${s.cover_image}`) : null,
        }));
        setServices(processed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleImgError(id: number) {
    setImgErrors(prev => new Set(prev).add(id));
  }

  return (
    <section id="services" className="section">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">// What we build</div>
          <h2>Automation for every part of the business.</h2>
          <p className="lede">From a single chatbot to a full automation stack — pick a starting point, or let AURA recommend one.</p>
        </Reveal>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-[var(--line)] rounded-[12px] p-5 animate-pulse">
                <div className="w-9 h-9 rounded-[10px] bg-[var(--paper)] mb-3.5" />
                <div className="h-4 bg-[var(--paper)] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[var(--paper)] rounded w-full mb-1" />
                <div className="h-3 bg-[var(--paper)] rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-10">
            {services.map((s, i) => {
              const showImage = s.cover_image && !imgErrors.has(s.id);
              return (
              <div
                key={s.id}
                className="group bg-white border border-[var(--line)] rounded-[12px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_20px_40px_-20px_rgba(0,87,255,0.35)] hover:shadow-[0_0_0_1px_var(--electric)]"
              >
                <div className="h-[110px] relative overflow-hidden">
                  {showImage ? (
                    <img src={s.cover_image || ''} alt={s.title} className="w-full h-full object-cover" onError={() => handleImgError(s.id)} />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white" style={{ background: s.cover_gradient }}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,163,255,0.18),transparent_70%)]" />
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-[42px] h-[42px] opacity-90 relative z-10">{ICONS[s.icon]}</svg>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base mb-1">{s.title}</h3>
                  <p className="text-[13.5px]">{s.description}</p>
                  <button
                    className="inline-block mt-3.5 text-xs font-semibold text-[var(--deep)] font-mono"
                    onClick={() => setSelected(i)}
                  >
                    Learn more →
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {selected !== null && services[selected] && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[200] flex items-center justify-center p-5" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-[22px] max-w-[480px] w-full p-7 relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[var(--line)] bg-white flex items-center justify-center" onClick={() => setSelected(null)} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l16 16M20 4L4 20"/></svg>
            </button>
            <div className="eyebrow">// Service</div>
            <h3 className="text-xl mt-1 mb-2 pr-8">{services[selected].title}</h3>
            <p>{services[selected].description}</p>
            <ul className="mt-4 mb-5 p-0 list-none flex flex-col gap-2">
              {services[selected].bullets.map((b, bi) => (
                <li key={bi} className="text-sm text-[var(--ink-soft)] flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--electric)] mt-1.5 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <a href="#contact" className="btn btn-primary btn-sm" onClick={() => setSelected(null)}>Discuss this service</a>
          </div>
        </div>
      )}
    </section>
  );
}
