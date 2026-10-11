import LogoLoop from '../animations/LogoLoop';
import ErrorBoundary from '../ErrorBoundary';

const TECH = [
  'Groq',
  'MongoDB',
  'Express',
  'React',
  'Node.js',
  'Three.js',
  'Vite',
  'Tailwind',
  'Llama 3.3',
];

export default function TrustBar() {
  return (
    <section className="relative py-14 border-y border-red-500/[0.08] bg-black/40 overflow-hidden">
      {/* Red radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(255,45,45,0.10) 0%, transparent 70%)',
        }}
      />

      <p className="relative text-center text-[10px] uppercase tracking-[0.4em] text-red-400/60 mb-6 font-mono">
        ── Powered by ──
      </p>

      <ErrorBoundary label="Trust bar">
        <LogoLoop
          logos={TECH.map((t) => ({
            node: (
              <span
                className="text-lg font-bold tracking-tight px-8 whitespace-nowrap transition-colors duration-300"
                style={{
                  color: 'rgba(255, 60, 60, 0.55)',
                  textShadow: '0 0 20px rgba(255, 45, 45, 0.35)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 90, 90, 1)';
                  e.currentTarget.style.textShadow = '0 0 30px rgba(255, 45, 45, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 60, 60, 0.55)';
                  e.currentTarget.style.textShadow = '0 0 20px rgba(255, 45, 45, 0.35)';
                }}
              >
                {t}
              </span>
            ),
          }))}
          speed={70}
          direction="left"
          logoHeight={28}
          gap={48}
          fadeOut
          fadeOutColor="#050507"
        />
      </ErrorBoundary>
    </section>
  );
}