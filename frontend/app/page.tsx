'use client';

import Nav from '@/components/Nav';
import HeroCanvas from '@/components/HeroCanvas';
import Pillars from '@/components/Pillars';
import Services from '@/components/Services';
import Demo from '@/components/Demo';
import Industries from '@/components/Industries';
import Portfolio from '@/components/Portfolio';
import Calculator from '@/components/Calculator';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AutoPet from '@/components/AutoPet';
import AuraWidget from '@/components/AuraWidget';
import WatchModal from '@/components/WatchModal';

export default function Home() {
  return (
    <main>
      <Nav />

      <section className="relative pt-[120px] md:pt-[170px] pb-[80px] md:pb-[100px] overflow-hidden bg-[radial-gradient(60%_50%_at_80%_8%,var(--glow-soft),transparent_70%)]" id="top">
        <HeroCanvas />
        <div className="wrap relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.8fr] gap-10 items-center">
          <div>
            <div className="eyebrow">AutoMindAi — Tunisia</div>
            <h1 className="text-[clamp(38px,5.6vw,68px)] max-w-[680px]">
              Transform your business with <em className="not-italic text-[var(--deep)] bg-gradient-to-br from-[var(--deep)] to-[var(--electric)] bg-clip-text text-transparent">AI automation</em>
            </h1>
            <p className="lede text-lg max-w-[480px] mt-5">
              We build AI systems, websites, software, mobile apps, chatbots and industrial automations that work 24/7 — so your team doesn't have to.
            </p>
            <div className="flex flex-wrap gap-3.5 mt-8">
              <a href="#contact" className="btn btn-primary">Book a Free Consultation</a>
              <WatchModal />
            </div>
            <div className="flex gap-6 md:gap-8 mt-8 md:mt-14 flex-wrap">
              <div><b className="font-display text-2xl block">24/7</b><span className="font-mono text-[11.5px] text-[var(--ink-soft)] uppercase tracking-wider">Always-on systems</span></div>
              <div><b className="font-display text-2xl block">14</b><span className="font-mono text-[11.5px] text-[var(--ink-soft)] uppercase tracking-wider">Automation services</span></div>
              <div><b className="font-display text-2xl block">4</b><span className="font-mono text-[11.5px] text-[var(--ink-soft)] uppercase tracking-wider">Languages spoken by AURA</span></div>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-[280px] h-[280px]">
              <div className="absolute inset-0 rounded-full border border-dashed border-[var(--electric)] opacity-45 animate-spin" />
              <div className="absolute inset-[30px] rounded-full border border-solid border-[var(--deep)] opacity-25 animate-spin-reverse" />
              <div className="absolute inset-[60px] rounded-full border border-dashed border-[var(--electric)] opacity-50 animate-spin-slow" />
              <div className="absolute inset-[96px] rounded-full bg-gradient-to-br from-[#bfe0ff] via-[var(--electric)] to-[var(--deep)] shadow-[0_0_60px_10px_var(--glow)]" />
            </div>
          </div>
        </div>
        <div className="wrap"><Pillars /></div>
      </section>

      {/* AI Lab CTA */}
      <section className="relative py-12 md:py-16 bg-gradient-to-b from-[var(--navy)] to-[var(--navy-soft)] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,87,255,0.2),transparent_70%)]" />
        <div className="wrap relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--deep)]/15 border border-[var(--deep)]/25 text-[var(--electric)] text-[10px] font-mono font-semibold uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--electric)] animate-pulse" />
              New — AI Lab
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Get a personalized AI solution blueprint — <em className="not-italic text-[var(--electric)]">for your business</em>
            </h2>
            <p className="text-[#9fb0d1] text-sm max-w-xl mx-auto mb-8">
              Enter your business name, industry, and biggest challenge. Our AI will generate a complete solution: architecture, capabilities, ROI estimate, timeline, and cost — all in seconds.
            </p>
            <a href="/ai-lab" className="btn btn-primary text-base py-3.5 px-8">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Open AI Lab — It&apos;s Free
            </a>
          </div>
        </div>
      </section>

      <Services />
      <Demo />
      <Industries />
      <Portfolio />
      <Calculator />
      <Contact />
      <Footer />
      <AutoPet />
      <AuraWidget />
    </main>
  );
}
