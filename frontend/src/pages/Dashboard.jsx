import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import SpotlightCard from '../components/ui-custom/SpotlightCard';
import BlurText from '../components/text/BlurText';
import API from '../services/api';
import AppShell from '../components/layout/AppShell';
import WeeklyChart from '../components/dashboard/WeeklyChart';

const MODULES = [
  { path: '/modules/clinical-notes',    title: 'Clinical Notes',    desc: 'Structured extraction from doctor notes',      accent: '#8b5cf6', icon: '◇' },
  { path: '/modules/lab-explainer',     title: 'Lab Explainer',     desc: 'Plain-English lab interpretation',             accent: '#22d3ee', icon: '◆' },
  { path: '/modules/triage',            title: 'Smart Triage',      desc: 'ER urgency classification',                    accent: '#f97316', icon: '▲' },
  { path: '/modules/medication',        title: 'Medication Check',  desc: 'Drug interaction analysis',                    accent: '#ef4444', icon: '⬢' },
  { path: '/modules/resource-forecast', title: 'Resource Forecast', desc: 'Hospital demand prediction',                   accent: '#22c55e', icon: '◈' },
];

const TYPE_LABEL = {
  'clinical-note': 'Clinical Note',
  'lab-explainer': 'Lab Explainer',
  'triage': 'Triage',
  'medication-check': 'Medication',
  'resource-forecast': 'Forecast',
};

const SEV_COLORS = {
  low: '#22c55e', medium: '#f59e0b', high: '#f97316', critical: '#ef4444',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, bySeverity: [] });
  const [recent, setRecent] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  useEffect(() => {
    API.get('/api/ai/stats/summary')
      .then((res) => {
        const byType = res.data.byType || [];
        setStats({
          total: byType.reduce((s, t) => s + t.count, 0),
          bySeverity: res.data.bySeverity || [],
        });
      })
      .catch(() => {});
    API.get('/api/ai/tasks/all?limit=5')
      .then((res) => setRecent(res.data || []))
      .catch(() => {});
      API.get('/api/ai/tasks/all?limit=200')
      .then((res) => setAllTasks(res.data || []))
      .catch(() => {});
  }, []);

  const countSev = (s) => stats.bySeverity.find((x) => x._id === s)?.count || 0;
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <AppShell breadcrumb="Dashboard">
      {/* Greeting */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-widest text-white/40 mb-2">
          Overview
        </p>
        <BlurText
          text={`Welcome back, ${firstName}`}
          delay={60}
          animateBy="words"
          className="text-3xl md:text-4xl font-bold tracking-tight"
        />
        <p className="text-white/50 mt-2 text-sm">
          {stats.total === 0
            ? 'Run your first analysis to see live stats here.'
            : `${stats.total} analyses run across ${MODULES.length} modules.`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <Stat label="Total Runs" value={stats.total} color="#8b5cf6" />
        <Stat label="Critical" value={countSev('critical')} color="#ef4444" />
        <Stat label="High" value={countSev('high')} color="#f97316" />
        <Stat label="Stable" value={countSev('low')} color="#22c55e" />
      </div>
       <div className="mb-10">
        <WeeklyChart tasks={allTasks} />
      </div>
      {/* Modules */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] uppercase tracking-widest text-white/40 font-medium">
          AI Workflows
        </h2>
        <span className="text-[11px] text-white/25 font-mono">
          {MODULES.length} modules
        </span>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {MODULES.map((m) => (
          <Link key={m.title} to={m.path} className="group">
            <SpotlightCard className="p-5 rounded-2xl h-full transition group-hover:scale-[1.015]">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xl" style={{ color: m.accent }}>{m.icon}</span>
                <span
                  className="text-[10px] font-mono opacity-40 group-hover:opacity-100 transition"
                  style={{ color: m.accent }}
                >
                  →
                </span>
              </div>
              <h3 className="text-base font-semibold mb-1">{m.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{m.desc}</p>
            </SpotlightCard>
          </Link>
        ))}
      </div>
      
      {/* Recent */}
      <div className="flex items-center justify-between mb-4">
      <h2 className="text-[11px] uppercase tracking-widest text-white/40 font-medium">
        Recent Activity
      </h2>
      <Link
        to="/history"
        className="cursor-target text-[11px] text-white/40 hover:text-white transition flex items-center gap-1"
      >
        View all <span>→</span>
      </Link>
    </div>
      {recent.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-white/[0.08] rounded-2xl">
          <p className="text-white/40 text-sm">No activity yet</p>
          <p className="text-white/25 text-xs mt-1">Run a module above to see it here</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden divide-y divide-white/[0.04]">
          {recent.map((t) => (
            <div key={t._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition">
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: SEV_COLORS[t.severity] }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{TYPE_LABEL[t.type] || t.type}</p>
                <p className="text-xs text-white/35 truncate">{t.title}</p>
              </div>
              <span
                className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded"
                style={{
                  color: SEV_COLORS[t.severity],
                  background: `${SEV_COLORS[t.severity]}15`,
                }}
              >
                {t.severity}
              </span>
              <span className="text-xs text-white/30 font-mono hidden sm:block">
                {new Date(t.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="relative p-4 rounded-xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">{label}</p>
      <p className="text-2xl font-bold tracking-tight" style={{ color }}>
        {value}
      </p>
    </div>
  );
}