import { useCallback, useEffect, useState } from 'react';

const LANG_MAP = {
  English: 'en-US',
  Hindi: 'hi-IN',
  Telugu: 'te-IN',
  Tamil: 'ta-IN',
  Bengali: 'bn-IN',
  Marathi: 'mr-IN',
};

export default function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported('speechSynthesis' in window);
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text, language = 'English') => {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported');
      return;
    }
    window.speechSynthesis.cancel();

    const clean = (text || '').replace(/<[^>]*>/g, '').trim();
    if (!clean) return;

    const u = new SpeechSynthesisUtterance(clean);
    u.lang = LANG_MAP[language] || 'en-US';
    u.rate = 0.95;
    u.pitch = 1;
    u.volume = 1;

    // Try to pick a matching voice (browser-dependent)
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang === u.lang)
      || voices.find((v) => v.lang.startsWith(u.lang.slice(0, 2)));
    if (match) u.voice = match;

    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(u);
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { supported, speaking, speak, stop };
}