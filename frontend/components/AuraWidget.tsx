'use client';

import { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '@/lib/api';

const CHIPS = ['What services do you offer?', 'Get a project estimate', 'Book a consultation'];

const LANG_MAP: Record<string, string> = {
  en: 'en-US', fr: 'fr-FR', ar: 'ar-SA', de: 'de-DE', es: 'es-ES',
};

export default function AuraWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [lang, setLang] = useState('en');
  const msgsRef = useRef<HTMLDivElement | null>(null);
  const mounted = useRef(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (open && !mounted.current) {
      mounted.current = true;
      setHistory([]);
      const greetings = [
        { l: 'en', t: "Hey! 👋 I'm AURA — your AutoMindAi assistant. What are you working on today? I'd love to help you figure out how AI can make your life easier." },
        { l: 'fr', t: "Salut ! 👋 Je suis AURA, l'assistant d'AutoMindAi. Qu'est-ce que tu essaies d'améliorer aujourd'hui ?" },
        { l: 'ar', t: "مرحبا! 👋 أنا AURA مساعد AutoMindAi. ما الذي تعمل عليه اليوم؟ أحب أن أساعدك في اكتشاف كيف يمكن للذكاء الاصطناعي أن يسهل عملك." },
        { l: 'de', t: "Hallo! 👋 Ich bin AURA, dein AutoMindAi-Assistent. Woran arbeitest du heute? Ich helfe dir gerne, herauszufinden, wie KI deine Arbeit erleichtern kann." },
        { l: 'es', t: "¡Hola! 👋 Soy AURA, tu asistente de AutoMindAi. ¿En qué estás trabajando hoy? Me encantaría ayudarte a descubrir cómo la IA puede facilitarte la vida." },
      ];
      const pick = greetings[Math.floor(Math.random() * greetings.length)];
      setLang(pick.l);
      setMessages([{ role: 'bot', content: pick.t }]);
    }
  }, [open]);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages]);

  function detectLang(text: string): string {
    const ar = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const words = text.toLowerCase().split(/\s+/);
    const fr = ['bonjour','salut','merci','comment','pourquoi','quoi','êtes','vous','prix','temps','service','ça','veux'].some(w => words.includes(w));
    const es = ['hola','gracias','por','favor','cómo','qué','precio','servicio','tiempo','buenos'].some(w => words.includes(w));
    const de = ['hallo','danke','preis','zeit','service','guten','tag','wie'].some(w => words.includes(w));
    if (ar > text.length * 0.3) return 'ar';
    if (fr) return 'fr';
    if (es) return 'es';
    if (de) return 'de';
    return 'en';
  }

  function speak(text: string) {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const detected = detectLang(text);
    setLang(detected);
    const utterance = new SpeechSynthesisUtterance(text);
    const code = LANG_MAP[detected] || 'en-US';
    utterance.lang = code;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synthRef.current.speak(utterance);
  }

  function toggleListen() {
    if (listening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setListening(false);
      return;
    }

    const SpeechRecognition = (typeof window !== 'undefined' && (window as any).SpeechRecognition) || (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition);
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    const currentLang = LANG_MAP[lang] || 'en-US';
    recognition.lang = currentLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      send(transcript);
    };
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text.trim() } as const;
    setMessages((prev) => [...prev, userMsg]);
    setHistory((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    const detected = detectLang(text);
    setLang(detected);

    try {
      const res = await sendChatMessage(text.trim(), history);
      const reply = res.reply;
      setMessages((prev) => [...prev, { role: 'bot', content: reply }]);
      setHistory(res.history);
      if (autoSpeak) {
        speak(reply);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', content: 'Sorry — something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[95]">
      <button
        className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[var(--deep)] to-[var(--electric)] border-none shadow-[0_12px_30px_-8px_rgba(0,87,255,0.55)] flex items-center justify-center text-white"
        onClick={() => setOpen(!open)}
        aria-label="Open AURA assistant"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path d="M12 3a6 6 0 016 6c0 3-2 4.5-2 7H8c0-2.5-2-4-2-7a6 6 0 016-6z"/>
          <path d="M9.5 19h5M10.5 21.5h3"/>
        </svg>
        {(listening || speaking) && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#3df07a] rounded-full border-2 border-white animate-pulse" />}
      </button>

      {open && (
        <div className="absolute bottom-[72px] right-0 w-[340px] max-w-[92vw] h-[480px] md:h-[520px] max-h-[75vh] bg-white rounded-[16px] md:rounded-[20px] shadow-[0_20px_50px_-20px_rgba(10,18,40,0.35)] border border-[var(--line)] z-[96] flex flex-col overflow-hidden">
          <div className="bg-[var(--navy)] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--deep)] to-[var(--electric)] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 text-white"><path d="M12 3a6 6 0 016 6c0 3-2 4.5-2 7H8c0-2.5-2-4-2-7a6 6 0 016-6z"/></svg>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#3df07a] rounded-full border-2 border-[var(--navy)]" />
              </div>
              <div>
                <b className="text-sm block">AURA</b>
                <span className="text-[10px] text-[#9fb0d1] font-mono">
                  {speaking ? 'Speaking…' : listening ? 'Listening…' : 'Online'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold transition ${autoSpeak ? 'bg-[#3df07a]/20 text-[#3df07a]' : 'bg-white/10 text-white/60'}`}
                title={autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
              >
                {autoSpeak ? '🔊 ON' : '🔇 OFF'}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition"
              >
                ✕
              </button>
            </div>
          </div>

          <div ref={msgsRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[var(--paper)]">
            {messages.map((m, mi) => (
              <div key={mi} className={`max-w-[85%] p-3 rounded-[14px] text-[13.5px] leading-relaxed ${m.role === 'user' ? 'bg-gradient-to-br from-[var(--deep)] to-[var(--electric)] text-white self-end border-b-right-[4px] rounded-br-[4px]' : 'bg-white border border-[var(--line)] self-start border-b-left-[4px] rounded-bl-[4px]'}`} dir="auto">
                <div className="flex items-start gap-2">
                  {m.role === 'bot' && <span className="text-[10px] font-mono text-[var(--deep)] mt-0.5 shrink-0">AURA</span>}
                  <p className="flex-1">{m.content}</p>
                  {m.role === 'bot' && (
                    <button
                      onClick={() => speak(m.content)}
                      className="shrink-0 w-6 h-6 rounded-full bg-[var(--paper)] hover:bg-[var(--line)] flex items-center justify-center text-[var(--deep)] transition"
                      title="Play audio"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/></svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] p-3 rounded-[14px] bg-white border border-[var(--line)] self-start">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[var(--deep)]">AURA</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--electric)] animate-blink" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--electric)] animate-blink" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--electric)] animate-blink" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap p-3 bg-white border-t border-[var(--line)]">
            {CHIPS.map((c) => (
              <button key={c} className="text-[11px] px-3 py-1.5 rounded-full border border-[var(--line)] bg-white text-[var(--deep)] font-semibold hover:bg-[var(--paper)] transition" onClick={() => send(c)}>
                {c}
              </button>
            ))}
          </div>

          <div className="flex gap-2 p-3 border-t border-[var(--line)] bg-white items-center">
            <button
              onClick={toggleListen}
              className={`w-10 h-10 rounded-full border-none flex items-center justify-center shrink-0 transition ${
                listening
                  ? 'bg-red-500 text-white animate-pulse shadow-[0_0_0_6px_rgba(239,68,68,0.2)]'
                  : 'bg-[var(--paper)] text-[var(--deep)] hover:bg-[var(--line)]'
              }`}
              title={listening ? 'Stop listening' : 'Start voice input'}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>
            <input
              className="flex-1 border border-[var(--line)] rounded-full px-4 py-2 text-[13.5px] font-body focus:outline-none focus:border-[var(--deep)] transition"
              placeholder={listening ? 'Listening…' : 'Type or use voice…'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="w-10 h-10 rounded-full bg-[var(--deep)] text-white border-none flex items-center justify-center shrink-0 hover:bg-[var(--deep)]/90 transition disabled:opacity-50"
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
          </div>

          <div className="px-4 py-2 bg-[var(--paper)] border-t border-[var(--line)] flex items-center justify-between">
            <span className="text-[10px] text-[var(--ink-soft)] font-mono">
              🌐 {lang.toUpperCase()} · {autoSpeak ? 'Voice ON' : 'Voice OFF'}
            </span>
            <span className="text-[10px] text-[var(--ink-soft)]">
              Powered by AURA
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
