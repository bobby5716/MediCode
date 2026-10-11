import AnimatedContent from '../animations/AnimatedContent';
import ScrollReveal from '../animations/ScrollReveal';
import ShinyText from '../text/ShinyText';

const PROBLEMS = [
  {
    stat: '2h',
    unit: 'per day',
    title: 'Doctors drown in documentation',
    desc: 'Physicians spend nearly two hours daily writing notes instead of treating patients.',
    accent: '#8b5cf6',
    size: 'large',
  },
  {
    stat: '68%',
    unit: 'of patients',
    title: 'Lab reports confuse patients',
    desc: "Most people can't interpret their own values. They Google, panic, and misjudge their health.",
    accent: '#22d3ee',
    size: 'small',
  },
  {
    stat: '1:5',
    unit: 'ER cases',
    title: 'Critical cases slip through',
    desc: 'Busy emergency rooms miss red-flag symptoms in the queue.',
    accent: '#f97316',
    size: 'small',
  },
  {
    stat: '125k',
    unit: 'deaths/yr',
    title: 'Dangerous drug combinations',
    desc: 'Adverse drug interactions cause over 100,000 preventable deaths every year.',
    accent: '#ef4444',
    size: 'wide',
  },
  {
    stat: '30%',
    unit: 'bed waste',
    title: 'Hospitals misjudge demand',
    desc: 'Wards overbook or run empty. Both cost lives and millions.',
    accent: '#22c55e',
    size: 'small',
  },
];

function Card({ p, i }) {
  const sizeClass = {
    large: 'md:col-span-7 md:row-span-2',
    small: 'md:col-span-5',
    wide: 'md:col-span-7',
  }[p.size];

  return (
    <AnimatedContent
      distance={40}
      direction="vertical"
      delay={i * 0.08}
      className={sizeClass}
    >
      <div className="cursor-target relative h-full p-7 md:p-9 rounded-2xl border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-500 group overflow-hidden">
        {/* Hover glow */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-3xl pointer-events-none"
          style={{ background: p.accent }}
        />

        <div className="relative">
          <div className="flex items-baseline gap-2 mb-5">
            <span
              className="text-5xl md:text-7xl font-bold tracking-tighter leading-none"
              style={{ color: p.accent }}
            >
              {p.stat}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/35 font-mono">
              {p.unit}
            </span>
          </div>

          <h3 className="text-lg md:text-xl font-semibold mb-3 leading-snug tracking-tight">
            {p.title}
          </h3>
          <p className="text-sm text-white/45 leading-relaxed max-w-md">{p.desc}</p>
        </div>

        {/* Bottom accent line on hover */}
        <div
          className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, ${p.accent}, transparent)`,
          }}
        />
      </div>
    </AnimatedContent>
  );
}

export default function ProblemSection() {
  return (
    <section className="relative py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial header — asymmetric */}
        <div className="grid md:grid-cols-12 gap-8 mb-20">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-white/20" />
              <ShinyText
                text="01 / THE PROBLEM"
                speed={4}
                className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono"
              />
            </div>
            <ScrollReveal
              text="Healthcare runs on data that goes to waste."
              className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05]"
            />
          </div>
          <div className="md:col-span-4 md:col-start-9 flex items-end">
            <p className="text-sm text-white/40 leading-relaxed">
              Five real pain points that cost lives, time, and millions in wasted
              resources. MediCode targets every one.
            </p>
          </div>
        </div>

        {/* Asymmetric grid */}
        <div className="grid md:grid-cols-12 gap-4 md:gap-5">
          {PROBLEMS.map((p, i) => (
            <Card key={i} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}