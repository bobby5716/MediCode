import { useMemo } from 'react';

export default function DifferentialChart({ items }) {
  const max = useMemo(
    () => Math.max(...items.map((i) => i.probability || 0), 1),
    [items]
  );

  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const pct = Math.round(((item.probability || 0) / max) * 100);
        const color =
          i === 0 ? '#8b5cf6' : i === 1 ? '#22d3ee' : i === 2 ? '#f97316' : '#64748b';

        return (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-white/60 w-32 md:w-40 truncate flex-shrink-0">
              {item.name || item.diagnosis || item}
            </span>
            <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: color,
                  boxShadow: `0 0 12px ${color}80`,
                }}
              />
            </div>
            <span
              className="text-xs font-mono w-10 text-right flex-shrink-0"
              style={{ color }}
            >
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}