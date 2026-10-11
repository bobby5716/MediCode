import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    title: 'Dashboard Overview',
    caption: 'Every analysis tracked. Stats, trends, and recent activity in one view.',
    detail: 'Real-time dashboard showing total analyses, critical flags, and 7-day activity chart powered by MongoDB aggregation pipelines.',
    accent: '#8b5cf6',
    emoji: '📊',
  },
  {
    title: 'Upload Medical Record',
    caption: 'Drag a PDF or photo. Vision AI reads it in seconds.',
    detail: 'Supports prescriptions, lab reports, and discharge summaries. Client-side PDF-to-image conversion, then Groq Qwen 3.8 vision extraction.',
    accent: '#22d3ee',
    emoji: '📄',
  },
  {
    title: 'Structured Extraction',
    caption: 'Medicines, dosages, test values, reference ranges, dates — all extracted.',
    detail: 'FHIR-inspired schema. Each observation carries code, value, unit, reference range, status, and interpretation.',
    accent: '#10b981',
    emoji: '🔬',
  },
  {
    title: 'Human Review',
    caption: 'Every field editable before saving. Human-in-the-loop.',
    detail: 'User corrects any extraction error. Status flow: extracted to reviewed. Full audit trail preserved.',
    accent: '#f97316',
    emoji: '✏️',
  },
  {
    title: 'Plain-Language Summary',
    caption: 'In English. Or Hindi. Or Telugu. Or Tamil. Or Bengali. Or Marathi.',
    detail: 'Six Indian languages. AI generates the summary in the selected language. Text-to-speech reads it aloud.',
    accent: '#ef4444',
    emoji: '🌐',
  },
  {
    title: 'Unified Health Timeline',
    caption: 'Every record, chronologically. Your complete health story.',
    detail: 'Records sorted by date. Filter by type. Each entry opens a detail view with observations, medications, and diagnoses.',
    accent: '#ec4899',
    emoji: '📅',
  },
];

export default function DemoModal({ open, onClose }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!open || paused) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(id);
  }, [open, paused]);

  useEffect(() => {
    if (!open) return;
    setCurrent(0);
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % SLIDES.length);
      if (e.key === 'ArrowLeft') setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const slide = SLIDES[current];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-2xl border border-white/[0.08] bg-[#0a0a0f] overflow-hidden shadow-[0_0_120px_-20px_rgba(255,45,45,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[11px] uppercase tracking-widest text-white/40 font-mono ml-2">
              medicode · product walkthrough
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/try-report"
              onClick={onClose}
              className="cursor-target text-xs px-3 py-2 rounded-lg border border-cyan-300/40 text-cyan-200 hover:bg-cyan-300/10 transition"
            >
              Check a report →
            </Link>
            <button
              onClick={onClose}
              className="cursor-target w-8 h-8 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition flex items-center justify-center text-sm"
              aria-label="Close demo"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Slide area */}
        <div className="relative aspect-[16/9] bg-black overflow-hidden">
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${slide.accent}22 0%, transparent 65%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          <div className="relative h-full flex flex-col items-center justify-center text-center px-8 md:px-16">
            <div
              key={`emoji-${current}`}
              className="text-6xl md:text-7xl mb-6 animate-[fadeIn_0.5s_ease-out]"
              style={{ filter: `drop-shadow(0 0 30px ${slide.accent}80)` }}
            >
              {slide.emoji}
            </div>

            <div
              className="text-[10px] uppercase tracking-[0.4em] font-mono mb-4 transition-colors duration-500"
              style={{ color: slide.accent }}
            >
              Step {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </div>

            <h3
              key={`title-${current}`}
              className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 animate-[fadeIn_0.5s_ease-out]"
            >
              {slide.title}
            </h3>

            <p
              key={`cap-${current}`}
              className="text-base md:text-xl text-white/70 max-w-2xl mb-6 animate-[fadeIn_0.6s_ease-out]"
            >
              {slide.caption}
            </p>

            <p
              key={`detail-${current}`}
              className="text-xs md:text-sm text-white/40 max-w-2xl leading-relaxed font-mono animate-[fadeIn_0.7s_ease-out]"
            >
              {slide.detail}
            </p>
          </div>

          {!paused && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/[0.06]">
              <div
                key={`progress-${current}`}
                className="h-full"
                style={{
                  background: slide.accent,
                  animation: 'progressBar 4.5s linear',
                }}
              />
            </div>
          )}

          <button
            onClick={() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)}
            className="cursor-target absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-white/60 hover:text-white hover:border-white/30 transition flex items-center justify-center"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % SLIDES.length)}
            className="cursor-target absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-white/60 hover:text-white hover:border-white/30 transition flex items-center justify-center"
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 py-4">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="cursor-target rounded-full transition-all duration-300"
              style={{
                width: i === current ? '24px' : '6px',
                height: '6px',
                background: i === current ? s.accent : 'rgba(255,255,255,0.15)',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
          <button
            onClick={() => setPaused((p) => !p)}
            className="cursor-target ml-4 text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition font-mono"
          >
            {paused ? '▶ Play' : '❚❚ Pause'}
          </button>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">
          <span className="text-[11px] text-white/30 font-mono hidden md:block">
            CODE BLOODED · XL0035 · Altrix Labs Round 1
          </span>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              className="cursor-target text-xs text-white/60 hover:text-white transition"
            >
              Close
            </button>
            <Link
              to="/register"
              className="cursor-target text-xs px-4 py-1.5 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition"
            >
              Try it free →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
