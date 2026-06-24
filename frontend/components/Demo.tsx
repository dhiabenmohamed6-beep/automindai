'use client';

import { useState } from 'react';
import { generateDemo } from '@/lib/api';
import Reveal from './Reveal';

const DEMO_TOOLS = [
  { id: 'tagline', label: 'Tagline', fields: [{ type: 'textarea', id: 'tagline_input', label: 'Describe the business', placeholder: 'e.g. A boutique coffee roastery in Tunis focused on single-origin beans' }] },
  { id: 'email', label: 'Email', fields: [{ type: 'textarea', id: 'email_input', label: 'What should the email say?', placeholder: 'e.g. Follow up with a client about their automation project proposal' }] },
  { id: 'summarize', label: 'Summarize', fields: [{ type: 'textarea', id: 'sum_input', label: 'Paste text to summarize', placeholder: 'Paste an article, email or report excerpt…' }] },
  { id: 'translate', label: 'Translate', fields: [
    { type: 'textarea', id: 'trans_input', label: 'Text to translate', placeholder: 'Enter text…' },
    { type: 'select', id: 'trans_lang', label: 'Target language', options: ['French', 'English', 'Arabic', 'German', 'Spanish'] }
  ] },
  { id: 'idea', label: 'Business Idea', fields: [{ type: 'textarea', id: 'idea_input', label: 'Describe your industry or business', placeholder: 'e.g. A mid-size logistics company doing regional deliveries' }] },
  { id: 'plan', label: 'Automation Plan', fields: [{ type: 'textarea', id: 'plan_input', label: 'Describe a process you want automated', placeholder: 'e.g. New customer orders coming in by email need to enter our inventory system' }] },
];

export default function Demo() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});

  const tool = DEMO_TOOLS[active];

  function updateValue(id: string, val: string) {
    setValues((prev) => ({ ...prev, [id]: val }));
  }

  async function run() {
    setLoading(true);
    setResult('');
    try {
      const res = await generateDemo(tool.id, values);
      setResult(res.result);
    } catch {
      setResult('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    const btn = document.getElementById('demoCopy');
    if (btn) { btn.textContent = 'Copied ✓'; setTimeout(() => { if (btn) btn.textContent = 'Copy result'; }, 1500); }
  }

  return (
    <section id="demo" className="section bg-[var(--navy)] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_15%_20%,rgba(0,163,255,0.18),transparent_70%)]" />
      <div className="wrap relative z-10">
        <Reveal>
          <div className="eyebrow">// Try it yourself</div>
          <h2>Experience AutoMindAi before you contact us.</h2>
          <p className="lede">Live AI tools, running on the same models we wire into client systems. Pick a tool below.</p>
        </Reveal>
        <div className="reveal mt-8 bg-white/5 border border-white/10 rounded-[22px] p-1.5">
          <div className="flex gap-2 flex-wrap p-2">
            {DEMO_TOOLS.map((t, i) => (
              <button
                key={t.id}
                className={`px-4 py-2 rounded-full text-xs font-semibold border border-transparent transition ${i === active ? 'bg-white text-[var(--navy)]' : 'text-[#9fb0d1] bg-transparent'}`}
                onClick={() => { setActive(i); setResult(''); setValues({}); }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-4">
            <div>
              {tool.fields.map((f) => (
                <div key={f.id} className="mb-3.5">
                  <label className="block font-mono text-[11px] text-[#8ea3c9] uppercase tracking-wider mb-2">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      id={f.id}
                      className="w-full bg-white/6 border border-white/15 rounded-[10px] text-white p-2.5 text-sm font-body resize-y"
                      rows={3}
                      placeholder={f.placeholder}
                      value={values[f.id] || ''}
                      onChange={(e) => updateValue(f.id, e.target.value)}
                    />
                  ) : (
                    <select
                      id={f.id}
                      className="w-full bg-white/6 border border-white/15 rounded-[10px] text-white p-2.5 text-sm font-body"
                      value={values[f.id] || ''}
                      onChange={(e) => updateValue(f.id, e.target.value)}
                    >
                      {(f as any).options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  )}
                </div>
              ))}
              <button className="btn btn-primary btn-sm mt-2" onClick={run} disabled={loading}>
                {loading ? 'Generating…' : 'Generate'}
              </button>
            </div>
            <div>
              <label className="block font-mono text-[11px] text-[#8ea3c9] uppercase tracking-wider mb-2">Result</label>
              <div className="bg-black/25 border border-white/10 rounded-[14px] p-4 min-h-[160px] text-sm leading-relaxed whitespace-pre-wrap text-[#e7edfb]">
                {loading ? <span className="inline-flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--electric)] animate-blink" /><span className="w-1.5 h-1.5 rounded-full bg-[var(--electric)] animate-blink" style={{ animationDelay: '0.2s' }} /><span className="w-1.5 h-1.5 rounded-full bg-[var(--electric)] animate-blink" style={{ animationDelay: '0.4s' }} /></span> : result || <span className="text-[#5e6f93]">Output will appear here</span>}
              </div>
              {result && <button id="demoCopy" className="block mt-2 text-xs text-[var(--electric)] font-mono bg-transparent border-none p-0" onClick={copy}>Copy result</button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
