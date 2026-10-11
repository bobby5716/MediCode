import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Galaxy from '../components/animations/Galaxy';
import GooeyNavbar from '../components/layout/GooeyNavbar';
import HeroSection from '../components/home/HeroSection';
import TrustBar from '../components/home/TrustBar';
import ProblemSection from '../components/home/ProblemSection';
import ModulesSection from '../components/home/ModulesSection';
import HowItWorks from '../components/home/HowItWorks';
import MetricsSection from '../components/home/MetricsSection';
import TechStackSection from '../components/home/TechStackSection';
import CTASection from '../components/home/CTASection';
import ScrollExpand from '../components/animations/ScrollExpand';
import ErrorBoundary from '../components/ErrorBoundary';
import DemoModal from '../components/home/DemoModal';
import { SCROLL_EXPAND_IMAGE } from '../data/images';

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    // Listen for demo-open events fired from HeroSection
    const handler = () => setDemoOpen(true);
    window.addEventListener('open-demo', handler);

    return () => {
      document.documentElement.style.scrollBehavior = '';
      window.removeEventListener('open-demo', handler);
    };
  }, []);

  return (
    <div className="relative bg-[#050507] text-white overflow-x-hidden">

      {/* Galaxy — full page background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ErrorBoundary silent>
          <Galaxy
            color1="#ff2d2d"
            color2="#00FFB2"
            color3="#5227FF"
            speed={0.35}
            density={1.0}
          />
        </ErrorBoundary>
      </div>

      {/* Vignette overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 40%, transparent 0%, rgba(5,5,7,0.55) 65%, #050507 100%)',
        }}
      />

      <div className="relative z-10">
        <GooeyNavbar />

        <HeroSection />

        <ErrorBoundary label="Trust bar">
          <TrustBar />
        </ErrorBoundary>

        <div id="problem">
          <ErrorBoundary label="Problem">
            <ProblemSection />
          </ErrorBoundary>
        </div>

        <div className="relative h-[100vh] my-8">
          <ErrorBoundary silent>
            <ScrollExpand
              src={SCROLL_EXPAND_IMAGE}
              mediaType="image"
              title="Where AI meets medicine"
              scrollHint="Keep scrolling"
              startWidth={42}
              startHeight={58}
              startRadius={24}
              endRadius={0}
              mediaZoom={1.35}
              scrollDistance={1.2}
              holdDistance={0.35}
              smoothing={0.1}
              overlayScrim={0.5}
              useWindowScroll={true}
              className="w-full h-full"
            >
              <div className="text-center px-6">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                  Real impact. Real data.
                </h2>
                <p className="text-white/70 max-w-xl mx-auto">
                  Every analysis runs on real clinical patterns — not demos.
                </p>
              </div>
            </ScrollExpand>
          </ErrorBoundary>
        </div>

        <div id="modules">
          <ErrorBoundary label="Modules">
            <ModulesSection />
          </ErrorBoundary>
        </div>

        <div id="how">
          <ErrorBoundary label="How">
            <HowItWorks />
          </ErrorBoundary>
        </div>

        <ErrorBoundary label="Metrics">
          <MetricsSection />
        </ErrorBoundary>

        <ErrorBoundary label="Stack">
          <TechStackSection />
        </ErrorBoundary>

        <ErrorBoundary label="CTA">
          <CTASection />
        </ErrorBoundary>

        {/* ═══════════ RICH FOOTER ═══════════ */}
        <footer className="relative border-t border-white/[0.06] bg-black/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

              <div className="col-span-2 md:col-span-1">
                <Link to="/" className="flex items-center gap-2.5 mb-4">
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M12 2 L20 6 L20 12 C20 17 16 21 12 22 C8 21 4 17 4 12 L4 6 Z" className="text-white/20" />
                    </svg>
                    <svg viewBox="0 0 24 24" className="relative w-3.5 h-3.5">
                      <path d="M12 3 C12 3 6 10 6 14 A6 6 0 0 0 18 14 C18 10 12 3 12 3 Z" fill="url(#bloodGradFooter)" />
                      <defs>
                        <linearGradient id="bloodGradFooter" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ff6b6b" />
                          <stop offset="100%" stopColor="#b91c1c" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <span className="font-bold tracking-tight text-sm">
                    Medi<span className="text-red-500">Code</span>
                  </span>
                </Link>
                <p className="text-xs text-white/40 leading-relaxed max-w-xs">
                  An AI-powered Personal Health Copilot. Understand, organize, and
                  manage your healthcare journey — in your language.
                </p>
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-mono mb-5">
                  Features
                </h4>
                <ul className="space-y-3 text-xs">
                  {['Medical Record OCR', 'Plain-Language AI', 'Health Timeline', 'Multi-Language', 'ABDM Ready'].map((f) => (
                    <li key={f}>
                      <a href="#modules" className="text-white/60 hover:text-red-400 transition">{f}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-mono mb-5">
                  Product
                </h4>
                <ul className="space-y-3 text-xs">
                  {[
                    { l: 'Get Started', to: '/register' },
                    { l: 'Login', to: '/login' },
                    { l: 'Dashboard', to: '/dashboard' },
                    { l: 'Health Records', to: '/records' },
                    { l: 'Alerts', to: '/alerts' },
                  ].map((i) => (
                    <li key={i.l}>
                      <Link to={i.to} className="text-white/60 hover:text-red-400 transition">{i.l}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-mono mb-5">
                  Contact
                </h4>
                <ul className="space-y-3 text-xs">
                  <li><a href="mailto:team@codeblooded.dev" className="text-white/60 hover:text-red-400 transition">team@codeblooded.dev</a></li>
                  <li><a href="https://github.com" target="_blank" rel="noreferrer" className="text-white/60 hover:text-red-400 transition">GitHub</a></li>
                  <li><a href="https://altrixlabs.ai" target="_blank" rel="noreferrer" className="text-white/60 hover:text-red-400 transition">Altrix Labs</a></li>
                  <li className="pt-2"><span className="text-white/40 font-mono">Team ID: XL0035</span></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-mono mb-5">
                  Built with
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node', 'MongoDB', 'Groq', 'Vite', 'Tailwind'].map((t) => (
                    <span key={t} className="text-[10px] px-2.5 py-1 rounded-md border border-red-500/[0.15] text-red-300/70 font-mono">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-white/30 font-mono">
                © 2026 CODE BLOODED · XL0035 · Built for ByteXL HacXLerate
              </p>
              <div className="flex items-center gap-6">
                <span className="text-[11px] text-white/30 font-mono">Made with 🩸 in India</span>
                <a href="https://altrixlabs.ai" target="_blank" rel="noreferrer" className="text-[11px] text-red-400/60 hover:text-red-400 transition font-mono">
                  altrixlabs.ai →
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Demo Modal */}
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}