import { Link } from 'react-router-dom';
import ScrollReveal from '../animations/ScrollReveal';
import AnimatedContent from '../animations/AnimatedContent';
import CircularGallery from '../gallery/CircularGallery';
import ShinyText from '../text/ShinyText';
import ErrorBoundary from '../ErrorBoundary';
import { MODULE_IMAGES } from '../../data/images';

const MODULES = [
  {
    tag: '01',
    title: 'Clinical Notes',
    desc: 'Doctor note → structured data + ICD-10 codes.',
    accent: '#8b5cf6',
    path: '/modules/clinical-notes',
    img: MODULE_IMAGES.clinicalNotes,
  },
  {
    tag: '02',
    title: 'Lab Explainer',
    desc: 'Lab values → plain English for patients.',
    accent: '#22d3ee',
    path: '/modules/lab-explainer',
    img: MODULE_IMAGES.labExplainer,
  },
  {
    tag: '03',
    title: 'Smart Triage',
    desc: 'Symptoms + vitals → ER urgency score.',
    accent: '#f97316',
    path: '/modules/triage',
    img: MODULE_IMAGES.smartTriage,
  },
  {
    tag: '04',
    title: 'Medication Check',
    desc: 'Drug list → interaction risk analysis.',
    accent: '#ef4444',
    path: '/modules/medication',
    img: MODULE_IMAGES.medicationCheck,
  },
  {
    tag: '05',
    title: 'Resource Forecast',
    desc: 'Historical data → next-week demand.',
    accent: '#22c55e',
    path: '/modules/resource-forecast',
    img: MODULE_IMAGES.resourceForecast,
  },
];

export default function ModulesSection() {
  return (
    <section className="relative py-28 md:py-40">
      {/* Header — asymmetric */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-6 md:col-start-6">
            <div className="flex items-center gap-3 mb-6">
              <ShinyText
                text="02 / THE PLATFORM"
                speed={4}
                className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono"
              />
              <div className="w-10 h-px bg-white/20" />
            </div>
            <ScrollReveal
              text="Five workflows. One core."
              className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05]"
            />
            <p className="text-sm text-white/40 leading-relaxed mt-6 max-w-md">
              Every module shares the same LLM pipeline, MongoDB persistence, and
              audit trail.
            </p>
          </div>
        </div>
      </div>

      {/* Circular gallery — cinematic */}
      <div className="relative h-[600px] md:h-[720px] mb-24">
        <ErrorBoundary label="Gallery">
          <CircularGallery
            bend={2.5}
            textColor="#ffffff"
            borderRadius={0.06}
            items={MODULES.map((m) => ({
              image: m.img,
              text: m.title,
            }))}
          />
        </ErrorBoundary>

        {/* Edge fades + bottom anchor */}
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#050507] via-[#050507]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#050507] via-[#050507]/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-gradient-to-t from-[#050507] to-transparent pointer-events-none" />
      </div>

      {/* Editorial module list */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-white/[0.06]">
          {MODULES.map((m, i) => (
            <AnimatedContent
              key={m.title}
              distance={20}
              direction="horizontal"
              delay={i * 0.05}
            >
              <Link
                to={m.path}
                className="cursor-target group flex items-center gap-6 md:gap-10 py-6 border-b border-white/[0.06] hover:border-white/[0.15] transition"
              >
                <span className="text-[10px] font-mono text-white/25 w-8">
                  {m.tag}
                </span>
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 transition-all group-hover:scale-150"
                  style={{
                    background: m.accent,
                    boxShadow: `0 0 12px ${m.accent}`,
                  }}
                />
                <h3 className="text-xl md:text-3xl font-semibold tracking-tight flex-1 group-hover:translate-x-2 transition-transform duration-500">
                  {m.title}
                </h3>
                <p className="hidden md:block text-sm text-white/40 max-w-xs">
                  {m.desc}
                </p>
                <span className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition">
                  →
                </span>
              </Link>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}