import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import BlurText from '../components/text/BlurText';
import ShinyText from '../components/text/ShinyText';
import SpotlightCard from '../components/ui-custom/SpotlightCard';
import API from '../services/api';

const TYPE_LABEL = {
  'clinical-note': 'Clinical Note',
  'lab-explainer': 'Lab Explainer',
  triage: 'Triage',
  'medication-check': 'Medication',
  'resource-forecast': 'Forecast',
};

const TYPE_ACCENT = {
  'clinical-note': '#8b5cf6',
  'lab-explainer': '#22d3ee',
  triage: '#f97316',
  'medication-check': '#ef4444',
  'resource-forecast': '#22c55e',
};

const SEV_COLORS = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'clinical-note', label: 'Clinical Notes' },
  { value: 'lab-explainer', label: 'Lab' },
  { value: 'triage', label: 'Triage' },
  { value: 'medication-check', label: 'Medication' },
  { value: 'resource-forecast', label: 'Forecast' },
];

function exportCSV(tasks) {
  const headers = ['Date', 'Type', 'Title', 'Severity', 'Summary'];
  const rows = tasks.map((t) => [
    new Date(t.createdAt).toISOString(),
    TYPE_LABEL[t.type] || t.type,
    t.title || '',
    t.severity || '',
    (t.output?.summary || '').replace(/\s+/g, ' ').slice(0, 300),
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `medicode-tasks-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function History() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/api/ai/tasks/all?limit=200')
      .then((res) => setTasks(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filter !== 'all' && t.type !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${t.title} ${t.output?.summary || ''} ${t.type}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tasks, filter, search]);

  const counts = useMemo(() => {
    const map = { all: tasks.length };
    tasks.forEach((t) => {
      map[t.type] = (map[t.type] || 0) + 1;
    });
    return map;
  }, [tasks]);

  return (
    <AppShell breadcrumb="History">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <ShinyText
            text="ACTIVITY LOG"
            speed={4}
            className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono block mb-3"
          />
          <BlurText
            text="Task history"
            delay={60}
            animateBy="words"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          />
          <p className="text-sm text-white/45 mt-2">
            {tasks.length} total analyses · {filtered.length} shown
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportCSV(filtered)}
            disabled={filtered.length === 0}
            className="cursor-target px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ↓ Export CSV
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, summary, or module…"
          className="cursor-target w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-sm placeholder-white/25"
        />

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            const count = counts[f.value] || 0;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`cursor-target px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
                  active
                    ? 'bg-white text-black border-white'
                    : 'border-white/10 text-white/60 hover:text-white hover:border-white/25'
                }`}
              >
                {f.label}
                <span className={`ml-2 ${active ? 'text-black/50' : 'text-white/30'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 rounded-xl shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/[0.08] rounded-2xl">
          <p className="text-white/40 text-sm">
            {tasks.length === 0 ? 'No analyses yet' : 'No matches'}
          </p>
          <p className="text-white/25 text-xs mt-1">
            {tasks.length === 0
              ? 'Run a module to create your first task'
              : 'Try a different filter or clear search'}
          </p>
          {tasks.length === 0 && (
            <Link
              to="/dashboard"
              className="cursor-target inline-block mt-5 text-xs px-4 py-2 rounded-lg border border-white/15 text-white/80 hover:bg-white/5 transition"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden divide-y divide-white/[0.04]">
          {filtered.map((t) => (
            <Link
              key={t._id}
              to={`/tasks/${t._id}`}
              className="cursor-target group flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition"
            >
              <div
                className="w-1.5 h-10 rounded-full flex-shrink-0"
                style={{ background: SEV_COLORS[t.severity] || '#666' }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[10px] uppercase tracking-wider font-mono"
                    style={{ color: TYPE_ACCENT[t.type] }}
                  >
                    {TYPE_LABEL[t.type] || t.type}
                  </span>
                  <span className="text-[10px] text-white/20">·</span>
                  <span className="text-[10px] text-white/30">
                    {new Date(t.createdAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm font-medium truncate">{t.title}</p>
                {t.output?.summary && (
                  <p className="text-xs text-white/35 truncate mt-0.5">
                    {t.output.summary}
                  </p>
                )}
              </div>

              <span
                className="hidden md:inline-block text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded"
                style={{
                  color: SEV_COLORS[t.severity],
                  background: `${SEV_COLORS[t.severity]}15`,
                }}
              >
                {t.severity}
              </span>

              <span className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition text-sm">
                →
              </span>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}