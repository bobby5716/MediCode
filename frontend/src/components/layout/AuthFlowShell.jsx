
import Galaxy from '../animations/Galaxy';
import ErrorBoundary from '../ErrorBoundary';

export default function AuthFlowShell({ title, subtitle, children }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <ErrorBoundary silent>
          <Galaxy
            color1="#5227FF"
            color2="#00FFB2"
            color3="#B497CF"
            speed={0.35}
            density={1}
          />
        </ErrorBoundary>
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 40%, transparent 0%, rgba(5,5,7,0.6) 60%, #050507 100%)',
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#09090f]/80 p-7 shadow-[0_0_70px_-25px_rgba(139,92,246,0.35)] backdrop-blur-xl sm:p-9">
          <a href="/" className="mb-8 inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 font-bold text-black">
              M
            </span>
            <span className="font-semibold tracking-tight">MediCode</span>
          </a>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Account security
          </p>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-3 mb-8 text-sm leading-6 text-white/55">
            {subtitle}
          </p>

          {children}

          <p className="mt-8 text-center text-xs text-white/30">
            MediCode · ByteXL HacXLerate 2026
          </p>
        </section>
      </div>
    </main>
  );
}
