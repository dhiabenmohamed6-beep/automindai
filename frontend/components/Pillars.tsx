'use client';

export default function Pillars() {
  const pillars = [
    { tag: '// SMART AUTOMATION', text: 'Systems that handle the repeat work end to end.' },
    { tag: '// MORE TIME, MORE GROWTH', text: 'Hours back every week to spend on the business.' },
    { tag: '// BUILT TO SCALE', text: 'Architecture that grows with your business, not against it.' },
    { tag: '// POWERED BY INTELLIGENCE', text: 'Real AI models behind every workflow, not gimmicks.' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[18px] overflow-hidden mt-20">
      {pillars.map((p, i) => (
        <div key={i} className="bg-white p-5">
          <b className="font-mono text-[11px] text-[var(--deep)] tracking-wider">{p.tag}</b>
          <p className="mt-2 text-sm text-[var(--ink)] font-medium">{p.text}</p>
        </div>
      ))}
    </div>
  );
}
