'use client';

import { useState } from 'react';

export default function WatchModal() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button className="btn btn-ghost" onClick={() => setOpen(true)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        Watch Demo
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[200] flex items-center justify-center p-5" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-[22px] max-w-[520px] w-full p-7 relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[var(--line)] bg-white flex items-center justify-center" onClick={() => setOpen(false)} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l16 16M20 4L4 20"/></svg>
            </button>
            <div className="eyebrow">// How it works</div>
            <h3 className="text-xl mt-1">One workflow, three moves.</h3>
            <div className="flex items-center justify-between my-6 gap-2">
              <div className="text-center flex-1">
                <div className="w-[54px] h-[54px] rounded-xl bg-[var(--paper)] flex items-center justify-center mx-auto mb-2 text-[var(--deep)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>
                </div>
                <b className="text-xs block">Trigger</b>
                <span className="text-[11.5px] text-[var(--ink-soft)]">New lead, message or event</span>
              </div>
              <svg width="22" height="14" viewBox="0 0 24 14" fill="none" stroke="var(--electric)" strokeWidth="2"><path d="M2 7h20M16 1l6 6-6 6"/></svg>
              <div className="text-center flex-1">
                <div className="w-[54px] h-[54px] rounded-xl bg-[var(--paper)] flex items-center justify-center mx-auto mb-2 text-[var(--deep)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>
                </div>
                <b className="text-xs block">AI decides</b>
                <span className="text-[11.5px] text-[var(--ink-soft)]">Model reads context, picks an action</span>
              </div>
              <svg width="22" height="14" viewBox="0 0 24 14" fill="none" stroke="var(--electric)" strokeWidth="2"><path d="M2 7h20M16 1l6 6-6 6"/></svg>
              <div className="text-center flex-1">
                <div className="w-[54px] h-[54px] rounded-xl bg-[var(--paper)] flex items-center justify-center mx-auto mb-2 text-[var(--deep)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 13l4 4L19 7"/></svg>
                </div>
                <b className="text-xs block">Action</b>
                <span className="text-[11.5px] text-[var(--ink-soft)]">Reply sent, record updated, task done</span>
              </div>
            </div>
            <p>Every AutoMindAi system follows this loop — try the live tools below to see the "AI decides" step for yourself.</p>
            <a href="#demo" className="btn btn-primary btn-sm mt-5" onClick={() => setOpen(false)}>Go to live demo</a>
          </div>
        </div>
      )}
    </div>
  );
}
