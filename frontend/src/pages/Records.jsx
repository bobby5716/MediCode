import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import ShinyText from '../components/text/ShinyText';
import SpotlightCard from '../components/ui-custom/SpotlightCard';
import SpecularButton from '../components/ui-custom/SpecularButton';
import API from '../services/api';

const TYPE_LABEL = {
  prescription: 'Prescription',
  'lab-report': 'Lab Report',
  'discharge-summary': 'Discharge Summary',
  diagnostic: 'Diagnostic',
  other: 'Record',
};

const TYPE_ACCENT = {
  prescription: '#8b5cf6',
  'lab-report': '#22d3ee',
  'discharge-summary': '#f97316',
  diagnostic: '#ef4444',
  other: '#64748b',
};

export default function Records() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/records')
      .then((res) => setRecords(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const abnormalCount = (r) =>
    (r.observations || []).filter((o) => o.status && o.status !== 'normal' && o.status !== 'unknown').length;

  return (
    <AppShell breadcrumb="Health Records">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <ShinyText
            text="UNIFIED HEALTH TIMELINE"
            speed={4}
            className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono block mb-3"
          />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Health Records
          </h1>
          <p className="text-sm text-white/45 mt-2 max-w-2xl">
            Every document, extracted and organized chronologically.
          </p>
        </div>
        <Link to="/records/upload">
          <SpecularButton>+ Upload Record</SpecularButton>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl shimmer" />)}
        </div>
      ) : records.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/[0.08] rounded-2xl">
          <p className="text-white/40 text-sm">No records yet</p>
          <p className="text-white/25 text-xs mt-1 mb-6">
            Upload your first prescription, lab report, or discharge summary
          </p>
          <Link to="/records/upload">
            <SpecularButton>Upload First Record</SpecularButton>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => {
            const abn = abnormalCount(r);
            const accent = TYPE_ACCENT[r.recordType] || TYPE_ACCENT.other;
            return (
              <Link
                key={r._id}
                to={`/records/${r._id}`}
                className="cursor-target group block"
              >
                <SpotlightCard className="p-5 rounded-2xl transition group-hover:scale-[1.005]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${accent}15`,
                          border: `1px solid ${accent}40`,
                        }}
                      >
                        <span className="text-lg" style={{ color: accent }}>📄</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className="text-[10px] uppercase tracking-wider font-mono font-medium"
                            style={{ color: accent }}
                          >
                            {TYPE_LABEL[r.recordType] || 'Record'}
                          </span>
                          <span className="text-[10px] text-white/20">·</span>
                          <span className="text-[10px] text-white/40">
                            {new Date(r.recordDate).toLocaleDateString()}
                          </span>
                          {r.abhaId && (
                            <>
                              <span className="text-[10px] text-white/20">·</span>
                              <span className="text-[10px] text-white/40 font-mono">
                                ABHA: {r.abhaId}
                              </span>
                            </>
                          )}
                          {r.status === 'reviewed' && (
                            <span className="text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-500/15">
                              ✓ Reviewed
                            </span>
                          )}
                          {r.status === 'extracted' && (
                            <span className="text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded text-amber-400 bg-amber-500/15">
                              Needs Review
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium truncate">
                          {r.facilityName || r.fileName || 'Medical Record'}
                        </p>
                        {r.summary && (
                          <p className="text-xs text-white/50 line-clamp-2 mt-1">
                            {r.summary}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-2 text-[10px] font-mono text-white/35">
                          {r.observations?.length > 0 && (
                            <span>🔬 {r.observations.length} observations</span>
                          )}
                          {r.medications?.length > 0 && (
                            <span>💊 {r.medications.length} medications</span>
                          )}
                          {abn > 0 && (
                            <span className="text-amber-400">
                              ⚠ {abn} abnormal
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition text-sm flex-shrink-0">
                      →
                    </span>
                  </div>
                </SpotlightCard>
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}