import AnimatedContent from '../animations/AnimatedContent';
import ScrollReveal from '../animations/ScrollReveal';
import ShinyText from '../text/ShinyText';

const STEPS = [
  { n: '01', title: 'Paste or enter', desc: 'Drop in a note, lab report, symptom list, or medication set. No formatting required.', accent: '#8b5cf6' },
  { n: '02', title: 'AI analyzes',    desc: 'Groq Llama 3.3 returns strict JSON — structured, validated, ready for the database.', accent: '#22d3ee' },
  { n: '03', title: 'Saved & audited', desc: 'Every task is stored in MongoDB with severity flag, timestamp, and user attribution.', accent: '#f97316' },
  { n: '04', title: 'Act on insights', desc: 'Review on your dashboard, compare across patients, or export for billing.', accent: '#22c55e' },
];

export default function HowItWorks() {
  return (
    <section className="relative py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <ShinyText text="03 / HOW IT WORKS" speed={4} className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono" />
            <div className="w-10 h-px bg-white/20" />
          </div>
          <ScrollReveal text="Raw input to clinical action in four steps." className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05]" />
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-[44px] left-[3%] right-[3%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="grid md:grid-cols-4 gap-8 md:gap-4">
            {STEPS.map((s, i) => (
              <AnimatedContent key={i} distance={40} delay={i * 0.12}>
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold mb-6 relative z-10 backdrop-blur-sm"
                    style={{ background: 'rgba(5,5,7,0.9)', border: `1px solid ${s.accent}80`, color: s.accent, boxShadow: `0 0 24px -6px ${s.accent}` }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-[10px] font-mono text-white/25 mb-2 tracking-widest">{s.n}</p>
                  <h3 className="text-lg font-semibold mb-3 tracking-tight">{s.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}