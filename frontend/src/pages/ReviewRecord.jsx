import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import SpecularButton from '../components/ui-custom/SpecularButton';
import SpotlightCard from '../components/ui-custom/SpotlightCard';
import API from '../services/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['normal', 'low', 'high', 'critical', 'unknown'];

export default function ReviewRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get(`/api/records/${id}`)
      .then((res) => setRecord(res.data))
      .catch(() => toast.error('Record not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const update = (path, value) => {
    setRecord((prev) => {
      const next = { ...prev };
      if (path.length === 1) next[path[0]] = value;
      if (path.length === 3 && path[0] === 'observations') {
        next.observations = [...prev.observations];
        next.observations[path[1]] = { ...next.observations[path[1]], [path[2]]: value };
      }
      if (path.length === 3 && path[0] === 'medications') {
        next.medications = [...prev.medications];
        next.medications[path[1]] = { ...next.medications[path[1]], [path[2]]: value };
      }
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    const t = toast.loading('Saving record…');
    try {
      await API.patch(`/api/records/${id}`, record);
      toast.success('Record saved', { id: t });
      navigate(`/records/${id}`);
    } catch (err) {
      toast.error('Save failed', { id: t });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell breadcrumb="Review">
        <div className="space-y-4">
          <div className="h-24 rounded-2xl shimmer" />
          <div className="h-40 rounded-2xl shimmer" />
        </div>
      </AppShell>
    );
  }
  if (!record) return null;

  return (
    <AppShell breadcrumb="Review Extracted Data">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-6 rounded-full bg-amber-500" />
          <span className="text-[10px] uppercase tracking-widest font-medium text-amber-400">
            Human Review Required
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Review Extracted Data</h1>
        <p className="text-sm text-white/45 mt-2 max-w-2xl">
          Correct any fields the AI got wrong, then save. All fields are editable.
        </p>
      </div>

      {/* Meta */}
      <SpotlightCard className="p-5 rounded-2xl mb-5">
        <h3 className="text-[11px] uppercase tracking-widest text-white/45 font-medium mb-4">
          Record Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Record Type" value={record.recordType} onChange={(v) => update(['recordType'], v)} />
          <Field label="Date" value={record.recordDate?.slice(0, 10)} onChange={(v) => update(['recordDate'], v)} type="date" />
          <Field label="Facility" value={record.facilityName} onChange={(v) => update(['facilityName'], v)} />
          <Field label="Doctor" value={record.doctorName} onChange={(v) => update(['doctorName'], v)} />
          <Field label="Patient Name" value={record.patientName} onChange={(v) => update(['patientName'], v)} />
          <Field label="ABHA ID" value={record.abhaId} onChange={(v) => update(['abhaId'], v)} />
        </div>
      </SpotlightCard>

      {/* Observations */}
      {record.observations?.length > 0 && (
        <SpotlightCard className="p-5 rounded-2xl mb-5">
          <h3 className="text-[11px] uppercase tracking-widest text-white/45 font-medium mb-4">
            Observations ({record.observations.length})
          </h3>
          <div className="space-y-3">
            {record.observations.map((o, i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-6 gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <Field label="Test" value={o.code} onChange={(v) => update(['observations', i, 'code'], v)} />
                <Field label="Value" value={o.value} onChange={(v) => update(['observations', i, 'value'], v)} />
                <Field label="Unit" value={o.unit} onChange={(v) => update(['observations', i, 'unit'], v)} />
                <Field label="Reference" value={o.referenceRange} onChange={(v) => update(['observations', i, 'referenceRange'], v)} />
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Status</label>
                  <select
                    value={o.status}
                    onChange={(e) => update(['observations', i, 'status'], e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-black/40 border border-white/[0.08] text-xs"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <Field label="Note" value={o.interpretation} onChange={(v) => update(['observations', i, 'interpretation'], v)} />
              </div>
            ))}
          </div>
        </SpotlightCard>
      )}

      {/* Medications */}
      {record.medications?.length > 0 && (
        <SpotlightCard className="p-5 rounded-2xl mb-5">
          <h3 className="text-[11px] uppercase tracking-widest text-white/45 font-medium mb-4">
            Medications ({record.medications.length})
          </h3>
          <div className="space-y-3">
            {record.medications.map((m, i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <Field label="Drug" value={m.name} onChange={(v) => update(['medications', i, 'name'], v)} />
                <Field label="Dosage" value={m.dosage} onChange={(v) => update(['medications', i, 'dosage'], v)} />
                <Field label="Frequency" value={m.frequency} onChange={(v) => update(['medications', i, 'frequency'], v)} />
                <Field label="Duration" value={m.duration} onChange={(v) => update(['medications', i, 'duration'], v)} />
                <Field label="Route" value={m.route} onChange={(v) => update(['medications', i, 'route'], v)} />
              </div>
            ))}
          </div>
        </SpotlightCard>
      )}

      {/* Summary */}
      <SpotlightCard className="p-5 rounded-2xl mb-5">
        <h3 className="text-[11px] uppercase tracking-widest text-white/45 font-medium mb-4">
          AI Summary ({record.language})
        </h3>
        <textarea
          value={record.summary}
          onChange={(e) => update(['summary'], e.target.value)}
          rows={5}
          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-sm leading-relaxed resize-y"
        />
      </SpotlightCard>

      <div className="flex items-center gap-4">
        <SpecularButton onClick={save} disabled={saving}>
          {saving ? 'Saving…' : '✓ Save Reviewed Record'}
        </SpecularButton>
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-white/40 hover:text-white transition"
        >
          Cancel
        </button>
      </div>
    </AppShell>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1.5 rounded-lg bg-black/40 border border-white/[0.08] text-xs"
      />
    </div>
  );
}