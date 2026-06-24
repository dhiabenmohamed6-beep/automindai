'use client';

import { useState } from 'react';
import { calculateEstimate } from '@/lib/api';
import Reveal from './Reveal';

export default function Calculator() {
  const [price, setPrice] = useState('TND —');
  const [time, setTime] = useState('—');
  const [stack, setStack] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function calc() {
    setLoading(true);
    try {
      const res = await calculateEstimate({
        category: (document.getElementById('calcCategory') as HTMLSelectElement)?.value || 'chatbot',
        scope: (document.getElementById('calcScope') as HTMLSelectElement)?.value || 'starter',
        timeline: (document.getElementById('calcTimeline') as HTMLSelectElement)?.value || 'standard',
      });
      setPrice(`TND ${res.low.toLocaleString()}–TND ${res.high.toLocaleString()}`);
      setTime(`${res.weeks_low}–${res.weeks_high} weeks`);
      setStack(res.stack);
    } catch {
      setPrice('TND —');
      setTime('—');
      setStack([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="estimate" className="section">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">// Instant estimate</div>
          <h2>Get a ballpark in 30 seconds.</h2>
          <p className="lede">A rough starting range — book a free consultation for an exact scope and quote.</p>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 border border-[var(--line)] rounded-[18px] overflow-hidden mt-10">
            <div className="p-7 bg-white flex flex-col gap-5">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-2">Service category</label>
                <select id="calcCategory" defaultValue="chatbot" className="w-full p-2.5 rounded-[10px] border border-[var(--line)] font-body text-sm">
                  <option value="chatbot">AI Chatbot / Voice Agent</option>
                  <option value="automation">Workflow / CRM Automation</option>
                  <option value="web">Website Development</option>
                  <option value="app">Mobile App Development</option>
                  <option value="industrial">Industrial Automation</option>
                  <option value="platform">Full AI Platform</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-2">Project scope</label>
                <select id="calcScope" defaultValue="starter" className="w-full p-2.5 rounded-[10px] border border-[var(--line)] font-body text-sm">
                  <option value="starter">Starter — single workflow</option>
                  <option value="growth">Growth — multiple integrations</option>
                  <option value="enterprise">Enterprise — full system</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-2">Timeline</label>
                <select id="calcTimeline" defaultValue="standard" className="w-full p-2.5 rounded-[10px] border border-[var(--line)] font-body text-sm">
                  <option value="standard">Standard (6–8 weeks)</option>
                  <option value="rush">Rush (2–4 weeks)</option>
                </select>
              </div>
              <button className="btn btn-primary self-start" onClick={calc} disabled={loading} style={{ marginTop: '6px' }}>
                {loading ? 'Calculating…' : 'Calculate estimate'}
              </button>
            </div>

            <div className="p-7 bg-gradient-to-br from-[var(--navy)] to-[var(--navy-soft)] text-white flex flex-col justify-center gap-5">
              <div className="flex justify-between items-baseline border-b border-white/10 pb-3.5">
                <span className="font-mono text-[11px] text-[#8ea3c9] uppercase">Estimated investment</span>
                <b className="font-display text-2xl">{price}</b>
              </div>
              <div className="flex justify-between items-baseline border-b border-white/10 pb-3.5">
                <span className="font-mono text-[11px] text-[#8ea3c9] uppercase">Estimated timeline</span>
                <b className="font-display text-2xl">{time}</b>
              </div>
              <div>
                <span className="font-mono text-[11px] text-[#8ea3c9] uppercase">Recommended stack</span>
                <div className="flex gap-2 flex-wrap mt-2.5">
                  {stack.map((s, i) => (
                    <span key={i} className="font-mono text-[10.5px] bg-white/8 px-2.5 py-1 rounded-md">{s}</span>
                  ))}
                </div>
              </div>
              <a href="#contact" className="btn btn-ghost btn-sm self-start mt-1" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                Refine this with AURA →
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
