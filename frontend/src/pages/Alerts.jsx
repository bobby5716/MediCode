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

const ACK_KEY = 'medicode_ack_alerts';

export default function Alerts() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acked, setAcked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(ACK_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState('active'); // 'active' | 'all'

  useEffect(() => {
    API.get('/api/ai/tasks/all?limit=500')
      .then((res) => setTasks(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem(ACK_KEY, JSON.stringify(acked));
  }, [acked]);

  const alerts = useMemo(() => {
    const flagged = tasks.filter(
      (t) => t.severity === 'critical' || t.severity === 'high'
    );
    return flagged
      .map((t) => ({ ...t, acknowledged: acked.includes(t._id) }))
      .sort((a, b) => {
        // Critical before high
        const sevRank = { critical: 0, high: 1 };
        const diff = sevRank[a.severity] - sevRank[b.severity];
        if (diff !== 0) return diff;
        // Within same severity, newest first
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [tasks, acked]);

  const filtered = useMemo(() => {
    if (filter === 'active') return alerts.filter((a) => !a.acknowledged);
    return alerts;
  }, [alerts, filter]);

  const stats = useMemo(() => {
    const active = alerts.filter((a) => !a.acknowledged);
    return {
      active: active.length,
      critical: active.filter((a) => a.severity === 'critical').length,
      high: active.filter((a) => a.severity === 'high').length,
      total: alerts.length,
    };
  }, [alerts]);

  const toggleAck = (id) => {
    setAcked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const ackAll = () => {
    setAcked(alerts.map((a) => a._id));
  };

  return (
    <AppShell breadcrumb="Alerts">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <ShinyText
            text="PRIORITY QUEUE"
            speed={4}
            className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono block mb-3"
          />
          <BlurText
            text="Red-Flag Alerts"
            delay={60}
            animateBy="words"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          />
          <p className="text-sm text-white/45 mt-2 max-w-2xl">
            Every high-severity and critical analysis surfaces here. Review,
            acknowledge, and close the loop on urgent cases.
          </p>
        </div>

        {stats.active > 0 && (
          <button
            onClick={ackAll}
            className="cursor-target px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition text-sm self-start md:self-auto"
          >
            ✓ Acknowledge all ({stats.active})
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat label="Active" value={stats.active} accent="#ef4444" pulse />
        <Stat label="Critical" value={stats.critical} accent="#dc2626" />
        <Stat label="High" value={stats.high} accent="#f97316" />
        <Stat label="Total Flagged" value={stats.total} accent="#64748b" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { value: 'active', label: `Active (${stats.active})` },
          { value: 'all', label: `All (${stats.total})` },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`cursor-target px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
              filter === f.value
                ? 'bg-white text-black border-white'
                : 'border-white/10 text-white/60 hover:text-white hover:border-white/25'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/[0.08] rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/[0.1] border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-emerald-400 text-xl">✓</span>
          </div>
          <p className="text-white/60 text-sm font-medium">
            {filter === 'active' ? 'All clear' : 'No alerts yet'}
          </p>
          <p className="text-white/30 text-xs mt-1 max-w-sm mx-auto">
            {filter === 'active'
              ? 'No unacknowledged high-severity cases. Everything is handled.'
              : 'Run a triage or clinical note with high severity to see alerts here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <AlertCard
              key={t._id}
              task={t}
              onToggle={() => toggleAck(t._id)}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}

function AlertCard({ task, onToggle }) {
  const isCritical = task.severity === 'critical';
  const accent = isCritical ? '#ef4444' : '#f97316';

  return (
    <div
      className={`relative rounded-2xl border overflow-hidden transition ${
        task.acknowledged
          ? 'border-white/[0.06] bg-white/[0.01] opacity-60'
          : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.03]'
      }`}
    >
      {/* Left severity stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{
          background: accent,
          boxShadow: task.acknowledged ? 'none' : `0 0 16px ${accent}80`,
        }}
      />

      <div className="p-5 pl-6 flex flex-col md:flex-row md:items-center gap-4">
        {/* Icon */}
        <div
          className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: `${accent}15`,
            border: `1px solid ${accent}40`,
          }}
        >
          {isCritical ? (
            <span className="text-lg" style={{ color: accent }}>⚠</span>
          ) : (
            <span className="text-lg" style={{ color: accent }}>!</span>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className="text-[10px] uppercase tracking-wider font-mono font-medium"
              style={{ color: TYPE_ACCENT[task.type] }}
            >
              {TYPE_LABEL[task.type] || task.type}
            </span>
            {task.patientId && (
              <>
                <span className="text-[10px] text-white/20">·</span>
                <span className="text-[10px] text-white/60 font-mono">
                  {task.patientId}
                </span>
              </>
            )}
            <span className="text-[10px] text-white/20">·</span>
            <span className="text-[10px] text-white/40">
              {new Date(task.createdAt).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span
              className="text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded ml-1"
              style={{ color: accent, background: `${accent}20` }}
            >
              {task.severity}
            </span>
            {task.acknowledged && (
              <span className="text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-500/15 ml-1">
                ✓ Acknowledged
              </span>
            )}
          </div>

          <p className="text-sm font-medium truncate">{task.title}</p>

          {(task.output?.summary || task.output?.reasoning) && (
            <p className="text-xs text-white/45 line-clamp-2 mt-1">
              {task.output.summary || task.output.reasoning}
            </p>
          )}

          {/* Red flags preview */}
          {Array.isArray(task.output?.redFlags) && task.output.redFlags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {task.output.redFlags.slice(0, 3).map((flag, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-full border"
                  style={{
                    color: accent,
                    borderColor: `${accent}40`,
                    background: `${accent}10`,
                  }}
                >
                  {String(flag).slice(0, 40)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onToggle}
            className={`cursor-target px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              task.acknowledged
                ? 'border-white/10 text-white/50 hover:text-white hover:border-white/25'
                : 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            {task.acknowledged ? 'Unmark' : '✓ Acknowledge'}
          </button>
          <Link
            to={`/tasks/${task._id}`}
            className="cursor-target px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition text-xs"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, pulse }) {
  return (
    <div className="relative p-4 rounded-xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 flex items-center gap-1.5">
        {pulse && value > 0 && (
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: accent }}
          />
        )}
        {label}
      </p>
      <p className="text-2xl font-bold tracking-tight" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}