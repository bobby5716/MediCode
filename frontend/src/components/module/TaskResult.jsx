import { useState } from 'react';
import SpotlightCard from '../ui-custom/SpotlightCard';
import useSpeechSynthesis from '../../hooks/useSpeechSynthesis';

const SEVERITY = {
  low:      { color: '#22c55e', label: 'Low',      bg: 'rgba(34,197,94,0.08)' },
  medium:   { color: '#f59e0b', label: 'Medium',   bg: 'rgba(245,158,11,0.08)' },
  high:     { color: '#f97316', label: 'High',     bg: 'rgba(249,115,22,0.08)' },
  critical: { color: '#ef4444', label: 'Critical', bg: 'rgba(239,68,68,0.10)' },
};

const prettyKey = (k) =>
  k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim();

// ── Value renderer ────────────────────────────────────
function Value({ val }) {
  if (val === null || val === undefined || val === '')
    return <span className="text-white/30">—</span>;

  if (Array.isArray(val)) {
    if (val.length === 0) return <span className="text-white/30 italic">None</span>;
    return (
      <ul className="space-y-2">
        {val.map((v, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <span className="text-white/25 mt-1.5 flex-shrink-0">•</span>
            <div className="text-white/85 flex-1">
              {typeof v === 'object' && v !== null ? <ObjectBlock obj={v} /> : String(v)}
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (typeof val === 'object') return <ObjectBlock obj={val} />;

  const str = String(val);
  const lower = str.toLowerCase();
  let cls = 'text-white/85';
  if (['low', 'normal', 'safe', 'none'].includes(lower)) cls = 'text-emerald-400';
  if (['medium', 'moderate', 'monitor'].includes(lower)) cls = 'text-amber-400';
  if (['high', 'dangerous', 'severe'].includes(lower)) cls = 'text-orange-400';
  if (['critical', 'emergency'].includes(lower)) cls = 'text-red-400';

  return <span className={`text-sm ${cls}`}>{str}</span>;
}

function ObjectBlock({ obj }) {
  return (
    <div className="space-y-1.5 mt-1">
      {Object.entries(obj).map(([k, v]) => (
        <div key={k} className="flex flex-col sm:flex-row sm:gap-2 text-sm">
          <span className="text-white/40 sm:min-w-[120px] text-xs uppercase tracking-wide sm:pt-0.5">
            {prettyKey(k)}
          </span>
          <span className="flex-1">
            <Value val={v} />
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Confidence bar ────────────────────────────────────
function ConfidenceBar({ value }) {
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  const safe = Number.isFinite(num) ? num : 0;
  const pct = Math.round(Math.max(0, Math.min(1, safe)) * 100);
  const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444';
  const label = pct >= 80 ? 'High' : pct >= 60 ? 'Moderate' : 'Low';

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: color }}
        />
        <span className="text-[10px] uppercase tracking-widest text-white/45 font-mono">
          AI Confidence
        </span>
      </div>

      <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden min-w-[80px]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>

      <span className="text-sm font-mono font-medium flex-shrink-0" style={{ color }}>
        {pct}%
      </span>

      <span
        className="text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded flex-shrink-0"
        style={{ color, background: `${color}15` }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Reasoning trace ───────────────────────────────────
function ReasoningTrace({ steps }) {
  const [open, setOpen] = useState(false);

  if (!Array.isArray(steps) || steps.length === 0) return null;

  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="cursor-target w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition text-left"
      >
        <div className="flex items-center gap-2 flex-1">
          <div className="w-1 h-3.5 rounded-full bg-cyan-500/60" />
          <span className="text-[10px] uppercase tracking-widest text-white/45 font-mono">
            Reasoning Trace
          </span>
          <span className="text-[10px] text-white/25 font-mono">
            {steps.length} steps
          </span>
        </div>
        <span
          className="text-white/40 text-xs transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-white/[0.04]">
          <ol className="space-y-2.5">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono mt-0.5"
                  style={{
                    background: 'rgba(34,211,238,0.12)',
                    color: '#22d3ee',
                    border: '1px solid rgba(34,211,238,0.3)',
                  }}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-white/70 leading-relaxed">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────
export default function TaskResult({ task, onReset }) {
  const { supported, speaking, speak, stop } = useSpeechSynthesis();

  if (!task) return null;

  const out = task.output || {};
  const sev = SEVERITY[out.severity || task.severity] || SEVERITY.low;
  const language = task.input?.language || 'English';

  const handleListen = () => {
    if (speaking) return stop();

    const parts = [];
    if (out.summary) parts.push(out.summary);
    if (out.reasoning) parts.push(out.reasoning);
    if (out.recommendedAction) parts.push(out.recommendedAction);
    if (out.recommendation) parts.push(out.recommendation);
    if (out.staffingRecommendation) parts.push(out.staffingRecommendation);
    if (out.diagnosis) parts.push(`Diagnosis: ${out.diagnosis}`);
    if (out.overallRisk) parts.push(`Overall risk: ${out.overallRisk}`);
    if (Array.isArray(out.redFlags) && out.redFlags.length) {
      parts.push(`Red flags: ${out.redFlags.join(', ')}`);
    }
    if (Array.isArray(out.concerns) && out.concerns.length) {
      parts.push(`Concerns: ${out.concerns.join(', ')}`);
    }

    speak(parts.join('. '), language);
  };

  const SKIP_KEYS = ['severity', 'confidence', 'reasoningTrace', 'differentialDiagnosis'];
  const PRIORITY = ['summary', 'reasoning', 'recommendation', 'recommendedAction', 'overallRisk', 'diagnosis'];

  const entries = Object.entries(out).filter(([k]) => !SKIP_KEYS.includes(k));
  entries.sort(([a], [b]) => {
    const ai = PRIORITY.indexOf(a);
    const bi = PRIORITY.indexOf(b);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div className="space-y-5 fade-up">
      {/* Severity hero */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 p-5 rounded-2xl border"
        style={{ background: sev.bg, borderColor: `${sev.color}33` }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: `${sev.color}22`, border: `1px solid ${sev.color}55` }}
          >
            <span className="text-lg" style={{ color: sev.color }}>●</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Severity</p>
            <p className="text-xl font-bold" style={{ color: sev.color }}>
              {sev.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          {supported && (
            <button
              type="button"
              onClick={handleListen}
              className="cursor-target flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-white/15 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/5 transition"
              title={speaking ? 'Stop' : `Read aloud in ${language}`}
            >
              {speaking ? (
                <>
                  <span className="w-2 h-2 rounded-sm bg-red-400 animate-pulse" />
                  Stop
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                  Listen · {language}
                </>
              )}
            </button>
          )}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="cursor-target text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition"
            >
              ← New analysis
            </button>
          )}
        </div>
      </div>

      {/* Confidence bar */}
      {out.confidence !== undefined && <ConfidenceBar value={out.confidence} />}

      {/* Reasoning trace */}
      <ReasoningTrace steps={out.reasoningTrace} />

      {/* Section cards */}
      {entries.map(([key, value]) => (
        <SpotlightCard key={key} className="p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-3.5 rounded-full bg-violet-500/60" />
            <p className="text-[11px] uppercase tracking-widest text-white/45 font-medium">
              {prettyKey(key)}
            </p>
          </div>
          <Value val={value} />
        </SpotlightCard>
      ))}

      {/* Meta footer */}
      <p className="text-[11px] text-white/25 text-center font-mono pt-2">
        {new Date(task.createdAt).toLocaleString()} · task_{task._id?.slice(-6)}
        {task.patientId && ` · ${task.patientId}`}
        {language !== 'English' && ` · ${language}`}
      </p>
    </div>
  );
}