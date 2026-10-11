import { useState, useEffect } from 'react';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';

const LANGS = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'हिन्दी' },
  { code: 'te-IN', label: 'తెలుగు' },
  { code: 'ta-IN', label: 'தமிழ்' },
  { code: 'bn-IN', label: 'বাংলা' },
  { code: 'mr-IN', label: 'मराठी' },
];

export default function VoiceInput({ onTranscript }) {
  const { supported, listening, transcript, error, start, stop, reset } =
    useSpeechRecognition();
  const [lang, setLang] = useState('en-US');

  // Push transcript to parent whenever it changes
  useEffect(() => {
    if (transcript) onTranscript(transcript);
  }, [transcript, onTranscript]);

  if (!supported) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-violet-500/[0.04] border border-violet-500/15">
      <button
        type="button"
        onClick={listening ? stop : () => start(lang)}
        className={`cursor-target relative w-9 h-9 rounded-full flex items-center justify-center transition ${
          listening
            ? 'bg-red-500 hover:bg-red-400'
            : 'bg-violet-500 hover:bg-violet-400'
        }`}
        title={listening ? 'Stop recording' : 'Start voice input'}
      >
        {listening ? (
          <>
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40" />
            <span className="relative w-2.5 h-2.5 rounded-sm bg-white" />
          </>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
          </svg>
        )}
      </button>

      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        disabled={listening}
        className="cursor-target text-xs bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white/80"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>

      <span className="text-[11px] text-white/50 flex-1">
        {listening
          ? '🔴 Listening… speak now'
          : transcript
          ? '✓ Transcribed — click the mic again to add more'
          : 'Or speak instead of typing'}
      </span>

      {transcript && !listening && (
        <button
          type="button"
          onClick={() => {
            reset();
            onTranscript('');
          }}
          className="cursor-target text-[11px] text-white/40 hover:text-white transition"
        >
          Clear
        </button>
      )}

      {error && <span className="text-[11px] text-red-400">⚠ {error}</span>}
    </div>
  );
}