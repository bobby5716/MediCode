import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  'ambient-visit': 'Ambient Visit',
};

const TYPE_ACCENT = {
  'clinical-note': '#8b5cf6',
  'lab-explainer': '#22d3ee',
  triage: '#f97316',
  'medication-check': '#ef4444',
  'resource-forecast': '#22c55e',
  'ambient-visit': '#ec4899',
};

const SEV_COLORS = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

export default function PatientTimeline() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const [patientId, setPatientId] = useState(initialId);
  const [input, setInput] = useState(initialId);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/ai/tasks/all?limit=500')
      .then((res) => setAllTasks(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tasks = useMemo(() => {
    if (!patientId) return [];
    return allTasks
      .filter((t) => (t.patientId || '').toLowerCase() === patientId.toLowerCase())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [allTasks, patientId]);

  const stats = useMemo(() => {
    const crit = tasks.filter((t) => t.severity === 'critical').length;
    const high = tasks.filter((t) => t.severity === 'high').length;
    const types = new Set(tasks.map((t) => t.type));
    return { total: tasks.length, crit, high, types: types.size };
  }, [tasks]);

  const submit = (e) => {
    e.preventDefault();
    const id = input.trim();
    setPatientId(id);
    if (id) setSearchParams({ id });
    else setSearchParams({});
  };

  return (
    <AppShell breadcrumb="Patient Timeline">
      {/* Header */}
      <div className="mb-8">
        <ShinyText
          text="LONGITUDINAL VIEW"
          speed={4}
          className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono block mb-3"
        />
        <BlurText
          text="Patient Timeline"
          delay={60}
          animateBy="words"
          className="text-3xl md:text-4xl font-bold tracking-tight"
        />
        <p className="text-sm text-white/45 mt-2 max-w-2xl">
          Every analysis for a patient, chronologically. See the full clinical
          story — not just isolated visits.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={submit} className="mb-8 flex flex-wrap gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Patient ID (e.g. PAT-001)"
          className="cursor-target flex-1 min-w-[240px] px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-sm placeholder-white/25"
        />
        <button
          type="submit"
          className="cursor-target px-5 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition"
        >
          Load Timeline
        </button>
      </form>

      {/* Empty state */}
      {!patientId && (
        <div className="py-16 text-center border border-dashed border-white/[0.08] rounded-2xl">
          <p className="text-white/40 text-sm">No patient selected</p>
          <p className="text-white/25 text-xs mt-1">
            Enter a Patient ID to view their clinical history
          </p>
          <p className="text-white/20 text-[11px] mt-4 font-mono">
            Tip: add a Patient ID when running any module
          </p>
        </div>
      )}

      {/* Stats */}
      {patientId && tasks.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Stat label="Patient ID" value={patientId} accent="#8b5cf6" mono />
          <Stat label="Total Analyses" value={stats.total} accent="#22d3ee" />
          <Stat label="Critical" value={stats.crit} accent="#ef4444" />
          <Stat label="High" value={stats.high} accent="#f97316" />
        </div>
      )}

      {/* No results for ID */}
      {patientId && !loading && tasks.length === 0 && (
        <div className="py-16 text-center border border-dashed border-white/[0.08] rounded-2xl">
          <p className="text-white/40 text-sm">
            No records found for <span className="font-mono text-white/60">{patientId}</span>
          </p>
          <p className="text-white/25 text-xs mt-2">
            Run any module and add this Patient ID to create a record
          </p>
          <Link
            to="/dashboard"
            className="cursor-target inline-block mt-5 text-xs px-4 py-2 rounded-lg border border-white/15 text-white/80 hover:bg-white/5 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      )}

      {/* Timeline */}
      {patientId && tasks.length > 0 && (
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

          <div className="space-y-3">
            {tasks.map((t) => (
              <Link
                key={t._id}
                to={`/tasks/${t._id}`}
                className="cursor-target group block relative"
              >
                {/* Node dot */}
                <div
                  className="absolute -left-[22px] top-5 w-3 h-3 rounded-full border-2 ring-4 ring-[#050507] transition group-hover:scale-125"
                  style={{
                    background: SEV_COLORS[t.severity],
                    borderColor: SEV_COLORS[t.severity],
                    boxShadow: `0 0 12px ${SEV_COLORS[t.severity]}80`,
                  }}
                />

                <SpotlightCard className="p-4 rounded-xl transition group-hover:scale-[1.005]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className="text-[10px] uppercase tracking-wider font-mono font-medium"
                          style={{ color: TYPE_ACCENT[t.type] }}
                        >
                          {TYPE_LABEL[t.type] || t.type}
                        </span>
                        <span className="text-[10px] text-white/20">·</span>
                        <span className="text-[10px] text-white/40">
                          {new Date(t.createdAt).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span
                          className="text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded ml-1"
                          style={{
                            color: SEV_COLORS[t.severity],
                            background: `${SEV_COLORS[t.severity]}15`,
                          }}
                        >
                          {t.severity}
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate">{t.title}</p>
                      {t.output?.summary && (
                        <p className="text-xs text-white/40 truncate mt-0.5">
                          {t.output.summary}
                        </p>
                      )}
                    </div>
                    <span className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition text-sm flex-shrink-0">
                      →
                    </span>
                  </div>
                </SpotlightCard>
              </Link>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Stat({ label, value, accent, mono }) {
  return (
    <div className="relative p-4 rounded-xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
        {label}
      </p>
      <p
        className={`text-2xl font-bold tracking-tight ${mono ? 'font-mono text-lg' : ''}`}
        style={{ color: accent }}
      >
        {value}
      </p>
    </div>
  );
}