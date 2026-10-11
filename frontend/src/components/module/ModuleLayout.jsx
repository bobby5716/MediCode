import AppShell from '../layout/AppShell';

export default function ModuleLayout({ title, subtitle, accent = '#8b5cf6', children }) {
  return (
    <AppShell breadcrumb={title}>
      {/* Module header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-1 h-6 rounded-full"
            style={{ background: accent }}
          />
          <span
            className="text-[10px] uppercase tracking-widest font-medium"
            style={{ color: accent }}
          >
            AI Module
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{title}</h1>
        {subtitle && (
          <p className="text-white/55 max-w-2xl text-[15px] leading-relaxed">{subtitle}</p>
        )}
      </div>

      {children}
    </AppShell>
  );
}