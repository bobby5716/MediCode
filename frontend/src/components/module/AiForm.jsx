import { useState } from 'react';
import API from '../../services/api';
import SpecularButton from '../ui-custom/SpecularButton';
import toast from 'react-hot-toast';
import VoicePillInput from './VoicePillInput';
import ImageInput from './ImageInput';
import GlideSelect from '../ui-custom/GlideSelect';

const LANGUAGES = [
  { value: 'English',  label: 'English',  script: 'Aa' },
  { value: 'Hindi',    label: 'हिन्दी',    script: 'अ' },
  { value: 'Telugu',   label: 'తెలుగు',    script: 'అ' },
  { value: 'Tamil',    label: 'தமிழ்',     script: 'அ' },
  { value: 'Bengali',  label: 'বাংলা',     script: 'অ' },
  { value: 'Marathi',  label: 'मराठी',     script: 'अ' },
];

export default function AiForm({
  type,
  fields,
  submitLabel = 'Analyze',
  onResult,
  transform,
  showPatientId = true,
}) {
  const initial = Object.fromEntries(fields.map((f) => [f.name, f.default || '']));
  const [form, setForm] = useState(initial);
  const [language, setLanguage] = useState('English');
  const [patientId, setPatientId] = useState('');
  const [image, setImage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [streamedText, setStreamedText] = useState('');

  const supportsImage = type === 'clinical-note' || type === 'lab-explainer';
  const handleChange = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    setStreamedText('');
    const t = toast.loading('Analyzing…');

    try {
      const transformed = transform ? transform(form) : form;
      const payload = { ...transformed, language };
      if (patientId.trim()) payload.patientId = patientId.trim();
      if (image?.imageBase64) {
        payload.imageBase64 = image.imageBase64;
        payload.imageMime = image.imageMime;
      }

      const token = localStorage.getItem('hx_token');
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(`${baseURL}/api/ai/${type}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Stream failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalTask = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const evt of events) {
          if (!evt.trim()) continue;
          const eventMatch = evt.match(/^event: (\w+)/m);
          const dataMatch = evt.match(/^data: (.+)$/m);
          if (!dataMatch) continue;

          let data;
          try {
            data = JSON.parse(dataMatch[1]);
          } catch {
            continue;
          }

          if (eventMatch?.[1] === 'done') {
            finalTask = data;
          } else if (eventMatch?.[1] === 'error') {
            throw new Error(data.message);
          } else if (data.chunk) {
            setStreamedText((prev) => prev + data.chunk);
          }
        }
      }

      if (finalTask) {
        toast.success('Analysis complete', { id: t });
        onResult(finalTask);
      } else {
        throw new Error('No result received');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'AI request failed';
      setError(msg);
      toast.error(msg, { id: t });
    } finally {
      setBusy(false);
      setStreamedText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Patient ID + Language row */}
      <div className="grid md:grid-cols-2 gap-3">
        {showPatientId && (
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono block mb-2">
              🧑 Patient ID <span className="text-white/25 normal-case tracking-normal">(optional)</span>
            </span>
            <input
              type="text"
              placeholder="e.g. PAT-001"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="cursor-target w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-sm placeholder-white/25"
            />
          </div>
        )}

        <div className={`p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] ${!showPatientId ? 'md:col-span-2' : ''}`}>
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono block mb-2">
            🌐 Response language
          </span>
          <GlideSelect
            options={LANGUAGES.map((l) => ({
              label: `${l.script}  ${l.label}`,
              value: l.value,
            }))}
            value={language}
            onChange={(val) => {
              const v = typeof val === 'string' ? val : val?.value;
              if (v) setLanguage(v);
            }}
            placeholder="Choose language"
            accentColor="#8b5cf6"
            surfaceColor="#0a0a0f"
            highlightColor="#1a1a24"
            textColor="#f5f5f7"
            size="md"
            radius={10}
            menuWidth={220}
            ariaLabel="Response language"
          />
        </div>
      </div>

      {/* Fields */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 space-y-5">
        {fields.map((f) => (
          <div key={f.name}>
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-sm font-medium text-white/85">
                {f.label}
                {f.required && !image && <span className="text-red-400/70 ml-1">*</span>}
              </label>
              {f.hint && (
                <span className="text-[11px] text-white/30 font-mono">{f.hint}</span>
              )}
            </div>

            {f.type === 'textarea' ? (
              <div className="space-y-2">
                <VoicePillInput onTranscript={(text) => handleChange(f.name, text)} />
                <textarea
                  required={f.required && !image}
                  rows={f.rows || 6}
                  value={form[f.name]}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  placeholder={image ? 'Optional — the AI will read from the image' : f.placeholder}
                  className="cursor-target w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-[14px] leading-relaxed resize-y"
                />
              </div>
            ) : (
              <input
                type={f.type || 'text'}
                required={f.required}
                value={form[f.name]}
                onChange={(e) => handleChange(f.name, e.target.value)}
                placeholder={f.placeholder}
                className="cursor-target w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-[14px]"
              />
            )}
          </div>
        ))}
      </div>

      {/* Image */}
      {supportsImage && <ImageInput onImage={setImage} />}

      {/* Streaming preview */}
      {busy && streamedText && (
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-4 max-h-64 overflow-hidden fade-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-violet-300/80 font-mono">
              AI is thinking…
            </span>
          </div>
          <pre className="text-xs text-white/60 font-mono whitespace-pre-wrap break-all leading-relaxed max-h-48 overflow-hidden">
            {streamedText.slice(-500)}
          </pre>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/[0.08] border border-red-500/25 text-red-200 text-sm">
          <span className="text-red-400 mt-0.5">⚠</span>
          <div>
            <p className="font-medium">Analysis failed</p>
            <p className="text-red-300/80 text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <SpecularButton type="submit" disabled={busy}>
          {busy ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing
            </span>
          ) : (
            submitLabel
          )}
        </SpecularButton>
        <span className="text-xs text-white/30">
          Llama 3.3 · {language} · ~3s
        </span>
      </div>
    </form>
  );
}