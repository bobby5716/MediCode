import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import SpotlightCard from '../components/ui-custom/SpotlightCard';
import SpecularButton from '../components/ui-custom/SpecularButton';
import API from '../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  normal: '#22c55e',
  low: '#22d3ee',
  high: '#f97316',
  critical: '#ef4444',
  unknown: '#64748b',
};

const LANGUAGES = ['English', 'Hindi', 'Telugu', 'Tamil', 'Bengali', 'Marathi'];

export default function RecordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    API.get(`/api/records/${id}`)
      .then((res) => setRecord(res.data))
      .catch(() => toast.error('Record not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const translate = async (language) => {
    setTranslating(true);
    const t = toast.loading(`Translating to ${language}…`);
    try {
      const { data } = await API.get(`/api/records/${id}/translate?language=${language}`);
      setRecord(data);
      toast.success(`Translated to ${language}`, { id: t });
    } catch {
      toast.error('Translation failed', { id: t });
    } finally {
      setTranslating(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this record permanently?')) return;
    try {
      await API.delete(`/api/records/${id}`);
      toast.success('Record deleted');
      navigate('/records');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return (
      <AppShell breadcrumb="Record">
        <div className="space-y-4">
          <div className="h-32 rounded-2xl shimmer" />
          <div className="h-40 rounded-2xl shimmer" />
        </div>
      </AppShell>
    );
  }
  if (!record) return null;

  return (
    <AppShell breadcrumb="Record Detail">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <Link to="/records" className="cursor-target text-xs text-white/50 hover:text-white transition">
          ← Back to records
        </Link>
        <div className="flex items-center gap-2">
          <Link to={`/records/${id}/review`}>
            <button className="cursor-target px-3 py-1.5 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition text-xs">
              Edit
            </button>
          </Link>
          <button
            onClick={remove}
            className="cursor-target px-3 py-1.5 rounded-lg border border-red-500/20 text-red-300/80 hover:text-red-300 hover:border-red-500/40 transition text-xs"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Header card */}
      <SpotlightCard className="p-6 rounded-2xl mb-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono mb-2">
              {record.recordType?.replace('-', ' ')}
            </p>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {record.facilityName || record.fileName || 'Medical Record'}
            </h1>
            <p className="text-xs text-white/50">
              {new Date(record.recordDate).toLocaleDateString([], {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
              {record.doctorName && ` · ${record.doctorName}`}
              {record.patientName && ` · Patient: ${record.patientName}`}
            </p>
            {record.abhaId && (
              <p className="text-xs text-white/40 font-mono mt-1">
                ABHA: {record.abhaId}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
              AI Confidence
            </p>
            <p className="text-2xl font-bold text-emerald-400 font-mono">
              {Math.round((record.extractionConfidence || 0) * 100)}%
            </p>
            <p className="text-[10px] text-white/30 mt-1">
              {record.reviewedByUser ? '✓ User reviewed' : 'Needs review'}
            </p>
          </div>
        </div>
      </SpotlightCard>

      {/* Summary */}
      {record.summary && (
        <SpotlightCard className="p-5 rounded-2xl mb-5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 rounded-full bg-violet-500/60" />
              <p className="text-[11px] uppercase tracking-widest text-white/45 font-medium">
                Plain-Language Summary · {record.language}
              </p>
            </div>
            <select
              value={record.language}
              onChange={(e) => translate(e.target.value)}
              disabled={translating}
              className="cursor-target text-xs bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-white/80"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{translating && l === record.language ? 'Translating…' : l}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-white/85 leading-relaxed">{record.summary}</p>
        </SpotlightCard>
      )}

      {/* Abnormal findings */}
      {record.abnormalFindings?.length > 0 && (
        <SpotlightCard className="p-5 rounded-2xl mb-5 border-amber-500/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-3.5 rounded-full bg-amber-500/60" />
            <p className="text-[11px] uppercase tracking-widest text-white/45 font-medium">
              Abnormal Findings
            </p>
          </div>
          <ul className="space-y-2">
            {record.abnormalFindings.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-amber-400 mt-1">•</span>
                <span className="text-white/80">{f}</span>
              </li>
            ))}
          </ul>
        </SpotlightCard>
      )}

      {/* Observations */}
      {record.observations?.length > 0 && (
        <SpotlightCard className="p-5 rounded-2xl mb-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-3.5 rounded-full bg-cyan-500/60" />
            <p className="text-[11px] uppercase tracking-widest text-white/45 font-medium">
              Lab Observations
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 text-[10px] uppercase tracking-wider text-white/40 font-medium">Test</th>
                  <th className="text-left py-2 text-[10px] uppercase tracking-wider text-white/40 font-medium">Value</th>
                  <th className="text-left py-2 text-[10px] uppercase tracking-wider text-white/40 font-medium">Unit</th>
                  <th className="text-left py-2 text-[10px] uppercase tracking-wider text-white/40 font-medium">Reference</th>
                  <th className="text-left py-2 text-[10px] uppercase tracking-wider text-white/40 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {record.observations.map((o, i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    <td className="py-2.5 text-white/85">{o.code || '—'}</td>
                    <td className="py-2.5 font-mono text-white/90">{o.value || '—'}</td>
                    <td className="py-2.5 text-white/60 text-xs">{o.unit || '—'}</td>
                    <td className="py-2.5 text-white/50 text-xs font-mono">{o.referenceRange || '—'}</td>
                    <td className="py-2.5">
                      <span
                        className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded"
                        style={{
                          color: STATUS_COLORS[o.status] || STATUS_COLORS.unknown,
                          background: `${STATUS_COLORS[o.status] || STATUS_COLORS.unknown}20`,
                        }}
                      >
                        {o.status || 'unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpotlightCard>
      )}

      {/* Medications */}
      {record.medications?.length > 0 && (
        <SpotlightCard className="p-5 rounded-2xl mb-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-3.5 rounded-full bg-violet-500/60" />
            <p className="text-[11px] uppercase tracking-widest text-white/45 font-medium">
              Medications
            </p>
          </div>
          <div className="space-y-2">
            {record.medications.map((m, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <p className="text-sm font-medium text-white/90">{m.name}</p>
                <p className="text-xs text-white/50 mt-1">
                  {[m.dosage, m.frequency, m.duration, m.route].filter(Boolean).join(' · ') || 'No dosage details'}
                </p>
              </div>
            ))}
          </div>
        </SpotlightCard>
      )}

      {/* Diagnoses */}
      {record.diagnoses?.length > 0 && (
        <SpotlightCard className="p-5 rounded-2xl mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-3.5 rounded-full bg-orange-500/60" />
            <p className="text-[11px] uppercase tracking-widest text-white/45 font-medium">
              Diagnoses
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {record.diagnoses.map((d, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-200">
                {d}
              </span>
            ))}
          </div>
        </SpotlightCard>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/20">
        <p className="text-[11px] text-amber-200/80 leading-relaxed">
          <strong>⚠ Medical disclaimer:</strong> {record.disclaimer}
        </p>
      </div>
    </AppShell>
  );
}