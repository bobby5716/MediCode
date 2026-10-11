import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function WeeklyChart({ tasks = [] }) {
  const data = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      days.push({
        key: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString([], { weekday: 'short' }),
        count: 0,
        critical: 0,
      });
    }

    const map = Object.fromEntries(days.map((d) => [d.key, d]));
    tasks.forEach((t) => {
      const k = new Date(t.createdAt).toISOString().slice(0, 10);
      if (map[k]) {
        map[k].count += 1;
        if (t.severity === 'critical' || t.severity === 'high') {
          map[k].critical += 1;
        }
      }
    });

    return days;
  }, [tasks]);

  const hasData = data.some((d) => d.count > 0);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3.5 rounded-full bg-violet-500/60" />
          <p className="text-[11px] uppercase tracking-widest text-white/45 font-medium">
            Last 7 Days
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <span className="flex items-center gap-1.5 text-white/40">
            <span className="w-2 h-2 rounded-sm bg-violet-500/70" /> Total
          </span>
          <span className="flex items-center gap-1.5 text-white/40">
            <span className="w-2 h-2 rounded-sm bg-red-500/70" /> High/Critical
          </span>
        </div>
      </div>

      {!hasData ? (
        <div className="h-[220px] flex items-center justify-center text-white/30 text-xs">
          No activity in the last 7 days
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCrit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="rgba(255,255,255,0.3)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: '#0a0a0f',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#gradTotal)"
            />
            <Area
              type="monotone"
              dataKey="critical"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#gradCrit)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}