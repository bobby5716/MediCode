import { useState, useEffect, useRef } from 'react';
import VoicePill from '../micro/VoicePill';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';

const LANG_MAP = {
  'en-US': 'English',
  'hi-IN': 'Hindi',
  'te-IN': 'Telugu',
  'ta-IN': 'Tamil',
  'bn-IN': 'Bengali',
  'mr-IN': 'Marathi',
};

export default function VoicePillInput({ onTranscript, defaultLang = 'en-US' }) {
  const { supported, listening, transcript, error, start, stop, reset } =
    useSpeechRecognition();
  const [lang, setLang] = useState(defaultLang);
  const lastPushed = useRef('');

  useEffect(() => {
    if (transcript && transcript !== lastPushed.current) {
      lastPushed.current = transcript;
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  if (!supported) return null;

  const handleStart = () => {
    reset();
    lastPushed.current = '';
    start(lang);
  };

  const handleStop = () => {
    stop();
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-violet-500/[0.04] border border-violet-500/15">
      <VoicePill
        accentColor="#8b5cf6"
        background="#1a1a24"
        iconColor="#a1a1aa"
        size={34}
        shape="pill"
        showTime
        waveform
        slideToCancel={false}
        mode="hold"
        reactive="real"
        onStart={handleStart}
        onStop={handleStop}
        ariaLabel={listening ? 'Stop recording' : 'Start voice input'}
      />

      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        disabled={listening}
        className="cursor-target text-xs bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white/80"
      >
        {Object.entries(LANG_MAP).map(([code, label]) => (
          <option key={code} value={code}>{label}</option>
        ))}
      </select>

      <span className="text-[11px] text-white/50 flex-1 min-w-0 truncate">
        {listening
          ? '🔴 Listening…'
          : transcript
          ? `✓ ${transcript}`
          : 'Hold the pill to speak'}
      </span>

      {transcript && !listening && (
        <button
          type="button"
          onClick={() => {
            reset();
            lastPushed.current = '';
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