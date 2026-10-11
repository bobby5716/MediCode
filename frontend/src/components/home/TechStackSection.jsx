import ScrollReveal from '../animations/ScrollReveal';
import SpotlightCard from '../ui-custom/SpotlightCard';
import InfiniteSpiral from '../gallery/InfiniteSpiral';
import ShinyText from '../text/ShinyText';
import ErrorBoundary from '../ErrorBoundary';
import { STACK_IMAGES } from '../../data/images';

const STACK = [
  { name: 'MongoDB',   role: 'Persistence',    accent: '#00ED64', img: STACK_IMAGES.mongodb },
  { name: 'Express',   role: 'API layer',      accent: '#ffffff', img: STACK_IMAGES.express },
  { name: 'React',     role: 'Frontend',       accent: '#61DAFB', img: STACK_IMAGES.react },
  { name: 'Node.js',   role: 'Runtime',        accent: '#68A063', img: STACK_IMAGES.node },
  { name: 'Groq',      role: 'LLM inference',  accent: '#F55036', img: STACK_IMAGES.groq },
  { name: 'Llama 3.3', role: 'Language model', accent: '#a78bfa', img: STACK_IMAGES.llama },
  { name: 'Three.js',  role: '3D rendering',   accent: '#ffffff', img: STACK_IMAGES.three },
  { name: 'Vite',      role: 'Build tool',     accent: '#FFD93D', img: STACK_IMAGES.vite },
];

export default function TechStackSection() {
  return (
    <section className="relative py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-px bg-white/20" />
            <ShinyText text="04 / THE STACK" speed={4} className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono" />
          </div>
          <ScrollReveal text="Modern tools, chosen for velocity." className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05]" />
          <p className="text-sm text-white/40 leading-relaxed mt-6 max-w-md">
            Every dependency earns its place. Nothing here is decoration.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="h-[560px] rounded-3xl overflow-hidden border border-white/[0.08] bg-black/40 relative shadow-[0_0_80px_-20px_rgba(139,92,246,0.4)]">
            <ErrorBoundary label="Stack spiral">
              <InfiniteSpiral
                items={STACK.map((s) => ({
                  src: s.img,
                  alt: s.name,
                  label: s.name,
                }))}
                speed={0.4}
                imageFit="cover"
              />
            </ErrorBoundary>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 40%, #050507 95%)' }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {STACK.map((s) => (
              <SpotlightCard key={s.name} className="p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${s.accent}15`, border: `1px solid ${s.accent}40`, color: s.accent }}
                  >
                    {s.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-[10px] text-white/40 truncate">{s.role}</p>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}