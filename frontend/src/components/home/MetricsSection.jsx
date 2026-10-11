import CountUp from '../text/CountUp';
import ScrollReveal from '../animations/ScrollReveal';
import AnimatedContent from '../animations/AnimatedContent';
import ShinyText from '../text/ShinyText';

const METRICS = [
  { to: 5,    suffix: '',   label: 'AI workflows',           sub: 'documentation → forecasting',  accent: '#8b5cf6' },
  { to: 3,    suffix: 's',  label: 'Avg analysis time',       sub: 'per LLM call',                accent: '#22d3ee' },
  { to: 100,  suffix: '%',  label: 'Structured JSON output',  sub: 'validated every time',        accent: '#f97316' },
  { to: 0,    suffix: '',   label: 'PHI stored unencrypted',  sub: 'privacy-first by design',     accent: '#22c55e' },
];

export default function MetricsSection() {
  return (
    <section className="relative py-28 md:py-40 border-y border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-20 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-px bg-white/20" />
            <ShinyText
              text="03 / BY THE NUMBERS"
              speed={4}
              className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono"
            />
          </div>
          <ScrollReveal
            text="Real numbers. No marketing."
            className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05]"
          />
        </div>

        {/* Asymmetric 4-col with offset */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {METRICS.map((m, i) => (
            <AnimatedContent
              key={i}
              distance={30}
              delay={i * 0.1}
              className={i % 2 === 1 ? 'md:mt-12' : ''}
            >
              <div>
                <div className="flex items-baseline">
                  <span
                    className="text-6xl md:text-8xl font-bold tracking-tighter leading-none"
                    style={{ color: m.accent }}
                  >
                    <CountUp to={m.to} duration={2.2} />
                  </span>
                  <span
                    className="text-3xl md:text-4xl font-bold ml-1"
                    style={{ color: m.accent, opacity: 0.5 }}
                  >
                    {m.suffix}
                  </span>
                </div>
                <p className="text-sm font-medium text-white/70 mt-5">{m.label}</p>
                <p className="text-xs text-white/30 mt-1 font-mono">{m.sub}</p>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}