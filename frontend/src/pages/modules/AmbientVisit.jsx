import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleLayout from '../../components/module/ModuleLayout';
import SpecularButton from '../../components/ui-custom/SpecularButton';
import TaskResult from '../../components/module/TaskResult';
import API from '../../services/api';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'English', label: 'English' },
  { code: 'Hindi',   label: 'हिन्दी' },
  { code: 'Telugu',  label: 'తెలుగు' },
  { code: 'Tamil',   label: 'தமிழ்' },
  { code: 'Bengali', label: 'বাংলা' },
  { code: 'Marathi', label: 'मराठी' },
];

export default function AmbientVisit() {
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const [language, setLanguage] = useState('English');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const recRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-IN';

    rec.onresult = (e) => {
      let full = '';
      for (let i = 0; i < e.results.length; i++) {
        full += e.results[i][0].transcript;
        if (e.results[i].isFinal) full += ' ';
      }
      setTranscript(full.trim());
    };
    rec.onerror = (e) => {
      if (e.error !== 'aborted') setError(`Mic error: ${e.error}`);
      setRecording(false);
    };
    rec.onend = () => setRecording(false);

    recRef.current = rec;
    return () => {
      try { rec.stop(); } catch {}
    };
  }, []);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recording]);

  const start = () => {
    if (!recRef.current) {
      setError('Speech recognition not supported in this browser');
      return;
    }
    setError('');
    setTranscript('');
    setSeconds(0);
    try {
      recRef.current.start();
      setRecording(true);
    } catch {}
  };

  const stop = () => {
    try { recRef.current?.stop(); } catch {}
    setRecording(false);
  };

  const analyze = async () => {
    if (!transcript.trim()) {
      toast.error('No conversation recorded');
      return;
    }
    setBusy(true);
    setError('');
    const t = toast.loading('Generating clinical note…');
    try {
      const { data } = await API.post('/api/ai/ambient-visit', {
        conversation: transcript,
        language,
      });
      toast.success('Note ready', { id: t });
      setResult(data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Analysis failed';
      setError(msg);
      toast.error(msg, { id: t });
    } finally {
      setBusy(false);
    }
  };

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <ModuleLayout
      title="Ambient Visit Scribe"
      subtitle="Start recording. Speak to your patient naturally. MediCore transcribes the conversation and generates a complete clinical note — diagnosis, prescriptions, ICD-10 codes, and follow-up plan."
      accent="#ec4899"
    >
      {!result ? (
        <div className="space-y-5">
          {/* Language + status */}
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
              🌐 Note language
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={recording}
              className="cursor-target text-xs bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white/85"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
            <span className="text-[10px] text-white/30 ml-auto font-mono">
              English speech · {language} output
            </span>
          </div>

          {/* Recorder */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-8">
            <div className="flex flex-col items-center gap-5">
              <button
                onClick={recording ? stop : start}
                className={`cursor-target relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  recording
                    ? 'bg-red-500 hover:bg-red-400'
                    : 'bg-gradient-to-br from-pink-500 to-violet-500 hover:scale-105'
                }`}
              >
                {recording && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
                    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20 animation-delay-300" />
                  </>
                )}
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                  {recording ? (
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  ) : (
                    <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
                  )}
                </svg>
              </button>

              <div className="text-center">
                <p className={`text-2xl font-mono tracking-wider ${recording ? 'text-red-400' : 'text-white/60'}`}>
                  {fmt(seconds)}
                </p>
                <p className="text-xs text-white/40 mt-1">
                  {recording
                    ? 'Recording… speak naturally'
                    : transcript
                    ? 'Recording paused'
                    : 'Tap to start recording the visit'}
                </p>
              </div>
            </div>
          </div>

          {/* Live transcript */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] uppercase tracking-widest text-white/45 font-medium">
                Live transcript
              </p>
              <span className="text-[10px] font-mono text-white/30">
                {transcript.length} chars
              </span>
            </div>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={8}
              placeholder="Your conversation will appear here as you speak. You can also type or edit directly."
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-[13px] leading-relaxed resize-y"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/[0.08] border border-red-500/25 text-red-200 text-xs">
              ⚠ {error}
            </div>
          )}

          <div className="flex items-center gap-4">
            <SpecularButton onClick={analyze} disabled={busy || !transcript.trim()}>
              {busy ? 'Generating…' : 'Generate Clinical Note'}
            </SpecularButton>
            <span className="text-xs text-white/30">
              {transcript.split(' ').filter(Boolean).length} words · {language}
            </span>
          </div>
        </div>
      ) : (
        <TaskResult task={result} onReset={() => setResult(null)} />
      )}
    </ModuleLayout>
  );
}