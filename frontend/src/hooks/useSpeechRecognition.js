import { useState, useRef, useCallback, useEffect } from 'react';

export default function useSpeechRecognition() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event) => {
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
      }
      if (final) setTranscript((prev) => (prev ? prev + ' ' : '') + final);
    };

    rec.onerror = (e) => {
      setError(e.error || 'Speech error');
      setListening(false);
    };
    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
  }, []);

  const start = useCallback((lang = 'en-US') => {
    if (!recognitionRef.current) return;
    setError('');
    recognitionRef.current.lang = lang;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {}
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    try { recognitionRef.current.stop(); } catch {}
    setListening(false);
  }, []);

  const reset = useCallback(() => setTranscript(''), []);

  return { supported, listening, transcript, error, start, stop, reset };
}