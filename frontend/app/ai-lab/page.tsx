'use client';

import { useState } from 'react';
import { postAPI } from '@/lib/api';

interface AIResult {
  solution_name: string;
  tagline: string;
  summary: string;
  core_capabilities: string[];
  ai_architecture: string[];
  roi_projection: string;
  implementation_weeks: string;
  team_workflow: string[];
  tech_stack: string[];
  pricing_tier: string;
  estimated_cost_tnd: number;
  business_name: string;
  industry: string;
  challenge: string;
}

export default function AILabPage() {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [formData, setFormData] = useState({ business_name: '', industry: '', challenge: '' });
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setStep('loading');

    try {
      const data = await postAPI('ai-lab', formData);
      setResult(data as AIResult);
      setStep('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Failed to generate solution. Please try again.');
      setStep('form');
    }
  }

  function resetForm() {
    setFormData({ business_name: '', industry: '', challenge: '' });
    setResult(null);
    setStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const industries = [
    'Restaurant / Cafe', 'Healthcare / Clinic', 'Real Estate', 'E-commerce / Retail',
    'Logistics / Shipping', 'Manufacturing / Factory', 'Education', 'Finance / Banking',
    'Technology / SaaS', 'Professional Services', 'Hospitality / Hotel', 'Agriculture',
    'Energy / Utilities', 'Media / Entertainment', 'Other'
  ];

  return (
    <div className="min-h-screen bg-[var(--navy)] text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,163,255,0.15),transparent_70%)]" />
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5 animate-float"
              style={{
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="wrap relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="eyebrow justify-center mb-4">// AI Lab</div>
            <h1 className="text-[clamp(32px,5vw,52px)] font-bold mb-6 leading-tight">
              See AI built <em className="not-italic text-[var(--electric)]">for your business</em>
            </h1>
            <p className="text-lg text-[#9fb0d1] max-w-xl mx-auto mb-10">
              Tell us about your business and we'll generate a complete personalized AI solution blueprint — architecture, ROI, workflow, and estimated cost.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      {step === 'form' && (
        <section className="pb-24">
          <div className="wrap max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[22px] p-8 md:p-10">
              <div className="space-y-6">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#9fb0d1] mb-2">Business / Company Name</label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-[12px] bg-white/8 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[var(--electric)] transition"
                    placeholder="e.g. Tunis Auto Parts"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#9fb0d1] mb-2">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 rounded-[12px] bg-white/8 border border-white/15 text-white focus:outline-none focus:border-[var(--electric)] transition appearance-none"
                    required
                  >
                    <option value="" disabled className="bg-[var(--navy)]">Select your industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind} className="bg-[var(--navy)]">{ind}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#9fb0d1] mb-2">Your Biggest Challenge Right Now</label>
                  <textarea
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    className="w-full px-4 py-3 rounded-[12px] bg-white/8 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[var(--electric)] transition min-h-[120px] resize-y"
                    placeholder="e.g. We get 50+ customer calls a day during lunch rush and miss orders. Our staff is overwhelmed and we lose money on every missed call."
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full btn btn-primary justify-center text-base py-4"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Generate My AI Solution
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Loading Section */}
      {step === 'loading' && (
        <section className="pb-24">
          <div className="wrap max-w-2xl mx-auto text-center py-20">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--electric)] animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[var(--deep)] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-xs text-[var(--electric)]">AI</span>
              </div>
            </div>
            <h2 className="font-display text-2xl font-bold mb-3">Designing Your Solution</h2>
            <p className="text-[#9fb0d1] text-sm">Analyzing your industry, mapping AI architecture, calculating ROI…</p>
            <div className="mt-8 flex justify-center gap-2">
              {['Scanning', 'Building', 'Optimizing', 'Finalizing'].map((text, i) => (
                <div key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[#9fb0d1] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                  {text}…
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Result Section */}
      {step === 'result' && result && (
        <section className="pb-24">
          <div className="wrap max-w-4xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3df07a]/10 border border-[#3df07a]/20 text-[#3df07a] text-xs font-mono font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3df07a] animate-pulse" />
                SOLUTION READY
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
                {result.solution_name}
              </h1>
              <p className="text-[var(--electric)] text-lg font-medium">{result.tagline}</p>
              <p className="text-[#9fb0d1] text-sm mt-3">for <b className="text-white">{result.business_name}</b> · {result.industry}</p>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-white/8 to-white/3 border border-white/10 rounded-[22px] p-6 mb-6">
              <p className="text-[15px] leading-relaxed text-[#c8d4eb]">{result.summary}</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-[14px] p-4 text-center">
                <p className="font-display text-2xl font-bold text-[var(--electric)]">{result.estimated_cost_tnd.toLocaleString()}</p>
                <p className="text-[10px] text-[#9fb0d1] font-mono uppercase tracking-wider mt-1">TND Estimate</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[14px] p-4 text-center">
                <p className="font-display text-2xl font-bold text-[var(--electric)]">{result.implementation_weeks}</p>
                <p className="text-[10px] text-[#9fb0d1] font-mono uppercase tracking-wider mt-1">Timeline</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[14px] p-4 text-center">
                <p className="font-display text-2xl font-bold text-[var(--electric)] capitalize">{result.pricing_tier}</p>
                <p className="text-[10px] text-[#9fb0d1] font-mono uppercase tracking-wider mt-1">Package</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[14px] p-4 text-center">
                <p className="font-display text-lg font-bold text-[#3df07a]">24/7</p>
                <p className="text-[10px] text-[#9fb0d1] font-mono uppercase tracking-wider mt-1">Coverage</p>
              </div>
            </div>

            {/* Two Column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Capabilities */}
              <div className="bg-white/5 border border-white/10 rounded-[18px] p-6">
                <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--deep)]/20 flex items-center justify-center text-[10px]">⚡</span>
                  Core Capabilities
                </h3>
                <ul className="space-y-3">
                  {result.core_capabilities.map((cap, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#c8d4eb]">
                      <span className="w-5 h-5 rounded-full bg-[var(--deep)]/15 flex items-center justify-center text-[10px] text-[var(--electric)] shrink-0 mt-0.5">{i + 1}</span>
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Architecture */}
              <div className="bg-white/5 border border-white/10 rounded-[18px] p-6">
                <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--deep)]/20 flex items-center justify-center text-[10px]">🏗️</span>
                  AI Architecture
                </h3>
                <div className="space-y-3">
                  {result.ai_architecture.map((comp, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[var(--deep)] to-[var(--electric)] flex items-center justify-center text-[10px] font-bold shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-[#c8d4eb]">{comp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROI Projection */}
            <div className="bg-gradient-to-r from-[#3df07a]/10 to-[var(--deep)]/10 border border-[#3df07a]/20 rounded-[18px] p-6 mb-6">
              <h3 className="font-display text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="text-[#3df07a]">📈</span> Expected ROI
              </h3>
              <p className="text-[#3df07a] font-mono text-lg font-semibold">{result.roi_projection}</p>
            </div>

            {/* Workflow */}
            <div className="bg-white/5 border border-white/10 rounded-[18px] p-6 mb-6">
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--deep)]/20 flex items-center justify-center text-[10px]">🔄</span>
                Daily Team Workflow
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.team_workflow.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full border border-[var(--electric)]/40 flex items-center justify-center text-[10px] text-[var(--electric)] font-mono shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-[#c8d4eb]">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-white/5 border border-white/10 rounded-[18px] p-6 mb-8">
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--deep)]/20 flex items-center justify-center text-[10px]">🔧</span>
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.tech_stack.map((tech, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-[var(--deep)]/15 border border-[var(--deep)]/25 text-xs font-mono text-[var(--electric)]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <div className="bg-white/5 border border-white/10 rounded-[18px] p-8">
                <h3 className="font-display text-xl font-bold mb-2">Ready to build {result.solution_name}?</h3>
                <p className="text-[#9fb0d1] text-sm mb-6">Book a free consultation and we'll turn this blueprint into reality.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href="#contact" className="btn btn-primary">Book Free Consultation →</a>
                  <button onClick={resetForm} className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.15)' }}>
                    Generate Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
