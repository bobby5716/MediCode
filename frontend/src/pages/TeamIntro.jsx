import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useLenis from '../hooks/useLenis';
import { useLanguage } from '../context/LanguageContext';
import '../styles/team-intro.css';

gsap.registerPlugin(ScrollTrigger);

const TEAM = {
  name: 'CODE BLOODED',
  id: 'XL0035',
  members: [
    { role: 'Frontend & Integration', focus: 'React · Vite · Tailwind · React Bits', code: 'FLE' },
    { role: 'Backend Engineering',    focus: 'Node · Express · MongoDB · Socket.io',   code: 'BKE' },
    { role: 'AI & Vision',            focus: 'Groq · Qwen 3.8 · GPT-OSS · OCR',        code: 'AIV' },
  ],
};

const SCOPE = [
  { n: '01', title: 'Medical Record Intelligence', desc: 'Ingest prescriptions, lab reports, and discharge summaries. Extract medicines, dosages, test values, diagnoses, and dates.', accent: '#8b5cf6' },
  { n: '02', title: 'Plain-Language Summaries',   desc: 'Explain every record in simple language. Flag abnormal values with color-coded severity across six Indian languages.', accent: '#22d3ee' },
  { n: '03', title: 'Unified Health Timeline',    desc: 'Organize everything into one chronological profile. Upload → Extract → Review → Save → Timeline.', accent: '#10b981' },
];

const PIPELINE = [
  { n: '01', title: 'Upload',  desc: 'Drag a PDF or image onto the drop zone.',       code: 'POST /api/records' },
  { n: '02', title: 'Extract', desc: 'Vision AI structures the data via Groq Qwen.',  code: 'Qwen 3.8 27B · vision' },
  { n: '03', title: 'Review',  desc: 'User corrects any field before saving.',         code: 'PATCH /api/records/:id' },
  { n: '04', title: 'Save',    desc: 'Persisted to your unified health timeline.',     code: 'MongoDB · FHIR-inspired' },
];

const BONUS = [
  { title: 'Multi-Language', desc: 'English · Hindi · Telugu · Tamil · Bengali · Marathi' },
  { title: 'ABDM Ready',     desc: 'FHIR-inspired schema with ABHA ID field' },
];

const EVAL = [
  { label: 'AI Utilization',         pct: 35 },
  { label: 'Technical Architecture', pct: 25 },
  { label: 'User Experience',        pct: 20 },
  { label: 'Healthcare Impact',      pct: 10 },
  { label: 'Presentation',           pct: 10 },
];

// ─── Character split — hero + preloader ONLY ───
function SplitChars({ text, className = '' }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((c, i) => (
        <span key={i} className="ti-char" style={{ '--i': i }}>
          {c === ' ' ? '\u00A0' : c}
        </span>
      ))}
    </span>
  );
}

// ─── Word split — section headlines. Mask reveal ───
function SplitWords({ text, className = '' }) {
  const { t } = useLanguage();
  const words = t(text).split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="ti-word-block">
          <span className="ti-word-inner" style={{ '--i': i }}>
            {w}
          </span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  );
}

// ─── Word mask — body paragraphs ───
function MaskWords({ text, className = '' }) {
  const { t } = useLanguage();
  const words = t(text).split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="ti-word-mask">
          <span className="ti-word">{w}</span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  );
}

export default function TeamIntro() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const preloaderRef = useRef(null);
  const lenisRef = useLenis();
  const [ready, setReady] = useState(false);

  const [chapter, setChapter] = useState('01');

  // ─── Cinematic preloader ───
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        if (lenis) lenis.start();
        document.body.style.overflow = '';
        setReady(true);
        ScrollTrigger.refresh();
      },
    });

    tl.fromTo('.ti-lb-top', { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: 'power4.out' }, 0)
      .fromTo('.ti-lb-bottom', { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: 'power4.out' }, 0)
      .from('.ti-pre-char', {
        opacity: 0,
        filter: 'blur(12px)',
        duration: 0.9,
        stagger: 0.03,
        ease: 'power3.out',
      }, 0.4)
      .fromTo('.ti-pre-progress-line', { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0.9)
      .from('.ti-pre-meta', { opacity: 0, y: 8, duration: 0.5 }, 1.2)
      .to('.ti-pre-inner', { opacity: 0, duration: 0.4 }, 2.5)
      .to('.ti-pre-curtain', { opacity: 0, duration: 0.5 }, 2.8)
      .to('.ti-lb-top', { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, 2.8)
      .to('.ti-lb-bottom', { yPercent: 100, duration: 0.7, ease: 'power4.inOut' }, 2.8)
      .set(preloaderRef.current, { display: 'none' });

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [lenisRef]);

  // ─── Progress bar ───
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const onScroll = ({ progress }) => {
      document.documentElement.style.setProperty('--scroll-progress', progress);
    };
    lenis.on('scroll', onScroll);
    return () => lenis.off('scroll', onScroll);
  }, [lenisRef]);

  // ─── Magnetic CTA ───
  useEffect(() => {
    if (!ready) return;
    const magnets = document.querySelectorAll('.ti-magnetic');
    const handlers = [];
    magnets.forEach((el) => {
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: x * 0.22, y: y * 0.35, duration: 0.4, ease: 'power3.out' });
      };
      const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', leave);
      handlers.push({ el, move, leave });
    });
    return () => handlers.forEach(({ el, move, leave }) => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    });
  }, [ready]);

  // ─── Main scroll animations ───
  useGSAP(() => {
    if (!ready) return;

    // Hero char reveal
    gsap.from('.ti-hero .ti-char', {
      opacity: 0,
      filter: 'blur(16px)',
      duration: 1.4,
      stagger: 0.04,
      ease: 'power3.out',
      delay: 0.2,
    });

    gsap.from('.ti-hero-eyebrow, .ti-hero-tag, .ti-hero-meta', {
      opacity: 0,
      y: 16,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 1.1,
    });

    gsap.from('.ti-hero-rule', {
      scaleX: 0,
      duration: 1.2,
      ease: 'power3.inOut',
      delay: 1.3,
    });

    // Section labels
    gsap.utils.toArray('.ti-label').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        opacity: 0,
        x: -20,
        duration: 0.7,
        ease: 'power3.out',
      });
    });

    // Headline word mask reveal
    gsap.utils.toArray('.ti-headline, .ti-entry-title').forEach((el) => {
      const words = el.querySelectorAll('.ti-word-inner');
      if (words.length === 0) return;
      gsap.from(words, {
        scrollTrigger: { trigger: el, start: 'top 82%' },
        yPercent: 115,
        duration: 0.9,
        stagger: 0.06,
        ease: 'power3.out',
      });
    });

    // Body paragraph word mask reveal
    gsap.utils.toArray('.ti-body').forEach((el) => {
      const words = el.querySelectorAll('.ti-word');
      if (words.length === 0) return;
      gsap.from(words, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        yPercent: 115,
        duration: 0.9,
        stagger: 0.015,
        ease: 'power3.out',
      });
    });

    // Horizontal scroll — track-based
    const track = document.querySelector('.ti-h-track');
    const hWrap = document.querySelector('.ti-horizontal');
    if (track && hWrap) {
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: hWrap,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
        },
      });
    }

    // Pipeline steps
    gsap.utils.toArray('.ti-step').forEach((step) => {
      gsap.from(step, {
        scrollTrigger: { trigger: step, start: 'top 82%' },
        opacity: 0,
        x: -40,
        duration: 0.9,
        ease: 'power3.out',
      });
    });

    // Team cards
    gsap.from('.ti-team-card', {
      scrollTrigger: { trigger: '.ti-team-grid', start: 'top 78%' },
      opacity: 0,
      y: 60,
      duration: 1,
      stagger: 0.12,
      ease: 'power3.out',
    });

    // Bonus cards
    gsap.from('.ti-bonus-card', {
      scrollTrigger: { trigger: '.ti-bonus-grid', start: 'top 80%' },
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
    });

    // Eval bars
    gsap.utils.toArray('.ti-eval-fill').forEach((bar) => {
      const pct = bar.getAttribute('data-pct');
      gsap.fromTo(bar, { width: '0%' }, {
        width: `${pct}%`,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: bar, start: 'top 90%' },
      });
    });

    // BG word parallax
    gsap.to('.ti-bg-text', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      yPercent: -40,
    });

    // Chapter indicator updates
    const chapterIds = [
      { id: 'ti-ch-hero',      ch: '01' },
      { id: 'ti-ch-challenge', ch: '02' },
      { id: 'ti-ch-scope',     ch: '03' },
      { id: 'ti-ch-pipeline',  ch: '04' },
      { id: 'ti-ch-bonus',     ch: '05' },
      { id: 'ti-ch-team',      ch: '06' },
      { id: 'ti-ch-eval',      ch: '07' },
    ];
    chapterIds.forEach(({ id, ch }) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => {
          if (self.isActive) setChapter(ch);
        },
      });
    });
  }, { scope: containerRef, dependencies: [ready] });

  return (
    <div ref={containerRef} className="ti-root">

      {/* ═════════ PRELOADER ═════════ */}
      <div ref={preloaderRef} className="ti-preloader">
        <div className="ti-pre-curtain" />
        <div className="ti-lb ti-lb-top" />
        <div className="ti-lb ti-lb-bottom" />

        <div className="ti-pre-inner">
          <div className="ti-pre-wordmark">
            <SplitChars text="CODE BLOODED" className="ti-pre-title" />
          </div>

          <div className="ti-pre-progress-track">
            <div className="ti-pre-progress-line" />
          </div>

          <div className="ti-pre-meta">
            <span>ALXT · ROUND 1</span>
            <span className="ti-pre-meta-dot" />
            <span>TEAM {TEAM.id}</span>
          </div>
        </div>
      </div>

      {/* Fixed background layers */}
      <div className="ti-grain" />
      <div className="ti-vignette" />
      <div className="ti-progress" />

      {/* ═════════ CINEMATIC HUD ═════════ */}
      <div className="ti-rec">
        <span className="ti-rec-dot" />
        <span className="ti-rec-label">REC</span>
      </div>

      <div className="ti-chapter">
        <span className="ti-chapter-num">{chapter}</span>
        <span className="ti-chapter-sep">/</span>
        <span className="ti-chapter-total">07</span>
      </div>

      <div className="ti-rail">
        {['01','02','03','04','05','06','07'].map((n) => (
          <span key={n} className={`ti-rail-dot ${chapter === n ? 'is-active' : ''}`} />
        ))}
      </div>

      <div className="ti-wrap">

        {/* ═════════ HERO ═════════ */}
        <section id="ti-ch-hero" className="ti-hero">
          <p className="ti-hero-eyebrow">
            <span className="ti-hero-eyebrow-line" />
            <span>Altrix Labs · HacXLerate 2026</span>
            <span className="ti-hero-eyebrow-line" />
          </p>

          <h1 className="ti-hero-title">
            <span className="ti-hero-title-line">
              <SplitChars text="CODE" className="ti-hero-h1" />
            </span>
            <span className="ti-hero-title-line">
              <SplitChars text="BLOODED" className="ti-hero-h1 ti-hero-h1-blood" />
            </span>
          </h1>

          <div className="ti-hero-rule">
            <span className="ti-hero-rule-dot" />
          </div>

          <p className="ti-hero-tag">
            {t('We build health tech that')} <em>{t('thinks')}</em>.
          </p>

          <div className="ti-hero-meta">
            <span className="ti-hero-pill">
              <span className="ti-hero-pill-dot" />
              TEAM {TEAM.id}
            </span>
            <span className="ti-hero-sep" />
            <span className="ti-hero-project">
              Building <strong>MediCode</strong> — AI Personal Health Copilot
            </span>
          </div>

          <div className="ti-scroll-cue">
            <div className="ti-scroll-cue-line" />
            <span>Scroll</span>
          </div>
        </section>

        <div className="ti-bg-text" aria-hidden="true">MEDICODE</div>

        {/* ═════════ 02 — CHALLENGE ═════════ */}
        <section id="ti-ch-challenge" className="ti-section ti-challenge">
          <p className="ti-label">01 / The Challenge</p>
          <h2 className="ti-headline">
            <SplitWords text="Healthcare information is fragmented." />
          </h2>
          <div className="ti-body">
            <MaskWords text="Prescriptions, lab reports, discharge summaries — scattered across formats. Patients can't understand them. Doctors don't have time to explain them." />
          </div>
          <p className="ti-challenge-pull">
            MediCode turns fragmented medical records into <span className="ti-accent">structured, explainable health intelligence</span>.
          </p>
        </section>

        {/* ═════════ 03 — HORIZONTAL SCOPE ═════════ */}
        <section id="ti-ch-scope" className="ti-horizontal">
          <div className="ti-h-track">
            <div className="ti-panel">
              <div className="ti-h-intro">
                <p className="ti-label">02 / Core Scope</p>
                <h2 className="ti-headline">
                  <SplitWords text="Three capabilities. One pipeline." />
                </h2>
                <p className="ti-h-intro-sub">Scroll sideways to explore</p>
                <div className="ti-h-arrow">→</div>
              </div>
            </div>

            {SCOPE.map((s) => (
              <div key={s.n} className="ti-panel">
                <div className="ti-h-card">
                  <span className="ti-h-card-num" style={{ color: s.accent }}>{s.n}</span>
                  <div className="ti-h-card-line" style={{ background: s.accent }} />
                  <h3 className="ti-h-card-title">{s.title}</h3>
                  <p className="ti-h-card-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════ 04 — PIPELINE ═════════ */}
        <section id="ti-ch-pipeline" className="ti-section ti-pipeline">
          <p className="ti-label">03 / The Pipeline</p>
          <h2 className="ti-headline">
            <SplitWords text="Upload. Extract. Review. Save." />
          </h2>

          <div className="ti-steps">
            {PIPELINE.map((s, i) => (
              <div key={i} className="ti-step">
                <div className="ti-step-num">{s.n}</div>
                <div className="ti-step-content">
                  <h4 className="ti-step-title">{s.title}</h4>
                  <p className="ti-step-desc">{s.desc}</p>
                </div>
                <div className="ti-step-code">{s.code}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════ 05 — BONUS ═════════ */}
        <section id="ti-ch-bonus" className="ti-section">
          <p className="ti-label">04 / Bonus Capabilities</p>
          <h2 className="ti-headline">
            <SplitWords text="Built for scale. Built for India." />
          </h2>

          <div className="ti-bonus-grid">
            {BONUS.map((b) => (
              <div key={b.title} className="ti-bonus-card">
                <div className="ti-bonus-title">{b.title}</div>
                <div className="ti-bonus-desc">{b.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════ 06 — TEAM ═════════ */}
        <section id="ti-ch-team" className="ti-section">
          <p className="ti-label">05 / The Team</p>
          <h2 className="ti-headline">
            <SplitWords text="Three builders. One mission." />
          </h2>

          <div className="ti-team-grid">
            {TEAM.members.map((m, i) => (
              <div key={i} className="ti-team-card">
                <div className="ti-team-top">
                  <span className="ti-team-code">{m.code}</span>
                  <span className="ti-team-num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="ti-team-role">{m.role}</h3>
                <p className="ti-team-focus">{m.focus}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════ 07 — EVALUATION ═════════ */}
        <section id="ti-ch-eval" className="ti-section">
          <p className="ti-label">06 / Evaluation</p>
          <h2 className="ti-headline">
            <SplitWords text="What the judges weigh." />
          </h2>

          <div className="ti-eval-grid">
            {EVAL.map((e) => (
              <div key={e.label} className="ti-eval-row">
                <span className="ti-eval-label">{e.label}</span>
                <div className="ti-eval-bar">
                  <div className="ti-eval-fill" data-pct={e.pct} />
                </div>
                <span className="ti-eval-pct">{e.pct}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════ ENTRY ═════════ */}
        <section className="ti-entry">
          <p className="ti-entry-label">Fin</p>
          <h2 className="ti-entry-title">
            <SplitWords text="Ready to see it work?" />
          </h2>

          <button
            className="ti-enter-btn ti-magnetic"
            onClick={() => {
              gsap.to('.ti-root', {
                opacity: 0,
                duration: 0.7,
                delay: 0.15,
                onComplete: () => navigate('/home'),
              });
            }}
          >
            <span>Enter MediCode</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <p className="ti-entry-hint">CODE BLOODED · {TEAM.id}</p>
        </section>

        <footer className="ti-footer">
          <span>CODE BLOODED</span>
          <span className="ti-footer-sep" />
          <span>{TEAM.id}</span>
          <span className="ti-footer-sep" />
          <span>MediCode</span>
        </footer>
      </div>
    </div>
  );
}
