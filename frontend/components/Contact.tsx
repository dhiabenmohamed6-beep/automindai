'use client';

import { useState } from 'react';
import { submitContact } from '@/lib/api';
import Reveal from './Reveal';

export default function Contact() {
  const [form, setForm] = useState({ full_name: '', email: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function update(key: string, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await submitContact(form);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  if (submitted) {
    return (
      <section id="contact" className="section bg-[var(--paper)]">
        <div className="wrap">
          <div className="reveal flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--deep)] to-[var(--electric)] flex items-center justify-center text-white mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="text-lg">Thanks — we'll be in touch.</h3>
            <p className="mt-1 text-sm">Our team replies within 1 business day.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section bg-[var(--paper)]">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">// Let's talk</div>
          <h2>Book your free consultation.</h2>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 border border-[var(--line)] rounded-[18px] overflow-hidden mt-6 md:mt-8">
            <div className="p-6 md:p-8 bg-[var(--paper)]">
              <h3 className="text-base md:text-lg">AutoMindAi</h3>
              <p className="mt-1 text-xs md:text-sm">Where automation meets intelligence.</p>
              <div className="mt-4 md:mt-5 space-y-3 md:space-y-4">
                <div><b className="block font-mono text-[10px] md:text-[11px] text-[var(--deep)] uppercase tracking-wider mb-1">Location</b><p className="text-xs md:text-sm">Tunisia</p></div>
                <div><b className="block font-mono text-[10px] md:text-[11px] text-[var(--deep)] uppercase tracking-wider mb-1">Email</b><p className="text-xs md:text-sm">hello@automindai.com</p></div>
                <div><b className="block font-mono text-[10px] md:text-[11px] text-[var(--deep)] uppercase tracking-wider mb-1">Response time</b><p className="text-xs md:text-sm">Within 1 business day</p></div>
                <div><b className="block font-mono text-[10px] md:text-[11px] text-[var(--deep)] uppercase tracking-wider mb-1">Languages</b><p className="text-xs md:text-sm">English · Français · العربية · Deutsch</p></div>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-white">
              <form className="flex flex-col gap-3 md:gap-3.5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-3.5">
                  <input type="text" placeholder="Full name" required className="p-2 md:p-2.5 rounded-[10px] border border-[var(--line)] font-body text-xs md:text-sm" value={form.full_name} onChange={(e) => update('full_name', e.target.value)} />
                  <input type="email" placeholder="Email address" required className="p-2 md:p-2.5 rounded-[10px] border border-[var(--line)] font-body text-xs md:text-sm" value={form.email} onChange={(e) => update('email', e.target.value)} />
                </div>
                <select required className="p-2 md:p-2.5 rounded-[10px] border border-[var(--line)] font-body text-xs md:text-sm" value={form.service} onChange={(e) => update('service', e.target.value)}>
                  <option value="">Service of interest</option>
                  <option value="ai_automation">AI Automation</option>
                  <option value="chatbot">AI Chatbots / Agents</option>
                  <option value="web_software">Website / Software Development</option>
                  <option value="industrial">Industrial Automation</option>
                  <option value="not_sure">Not sure yet</option>
                </select>
                <textarea placeholder="Tell us briefly what you're trying to solve…" className="p-2 md:p-2.5 rounded-[10px] border border-[var(--line)] font-body text-xs md:text-sm min-h-[80px] md:min-h-[90px] resize-y" value={form.message} onChange={(e) => update('message', e.target.value)} />
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button type="submit" className="btn btn-primary self-start">Request a Free Consultation</button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
