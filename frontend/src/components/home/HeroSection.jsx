import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SplitText from '../text/SplitText';
import ShinyText from '../text/ShinyText';
import SpecularButton from '../ui-custom/SpecularButton';
import StarBorder from '../ui-custom/StarBorder';
import ErrorBoundary from '../ErrorBoundary';

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(t);
  }, []);

  const openDemo = () => {
    window.dispatchEvent(new CustomEvent('open-demo'));
  };

  return (
    <section className="relative min-h-screen flex flex-col">
      <div
        className={`relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-24 transition-opacity duration-1000 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="mb-10 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <ShinyText
            text="Built for ByteXL HacXLerate 2026"
            speed={3}
            className="text-[11px] tracking-wider uppercase text-white/60"
          />
        </div>

        {/* Main heading — Medi (white) + Code (red) */}
        <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-bold tracking-tighter leading-none mb-8 text-center">
          <span className="text-white">Medi</span>
          <span className="bg-gradient-to-br from-red-400 via-red-500 to-red-700 bg-clip-text text-transparent">
            Code
          </span>
        </h1>

        <div className="max-w-3xl text-center mb-12">
          <SplitText
            text="An AI copilot for healthcare. Five clinical workflows. One intelligent core."
            className="text-base md:text-lg text-white/55 leading-relaxed"
            delay={25}
            duration={1}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5">
          <Link to="/register">
            <SpecularButton>Enter the platform</SpecularButton>
          </Link>

          <button
            onClick={openDemo}
            className="cursor-target flex items-center gap-2 px-6 py-3 text-sm text-white/80 hover:text-white transition group"
          >
            <span className="w-8 h-8 rounded-full border border-white/20 group-hover:border-red-400/60 flex items-center justify-center transition text-xs">
              ▶
            </span>
            <span className="border-b border-white/20 group-hover:border-red-400/60 pb-0.5 transition">
              Watch a demo
            </span>
          </button>
        </div>

        <Link
          to="/try-report"
          className="mt-4 rounded-lg border border-cyan-300/40 bg-cyan-300/[0.06] px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-200/70 hover:bg-cyan-300/[0.12]"
        >
          Check a report →
        </Link>

        <div className="flex items-center justify-center gap-8 mt-16 text-xs text-white/40">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Groq Llama 3.3
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> 3D-rendered
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> MERN stack
          </span>
        </div>
      </div>

      <div className="relative z-10 pb-8 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[10px] tracking-[0.3em] text-white/50 uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-red-500/60 to-transparent" />
      </div>
    </section>
  );
}
