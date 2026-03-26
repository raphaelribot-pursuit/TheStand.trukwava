import { useState, useCallback, useRef } from 'react';

/**
 * Text-to-speech hook using the Web Speech API.
 * Provides a warm, calm voice for Sage.
 */
export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const utteranceRef = useRef(null);

  const speak = useCallback((text) => {
    if (!isEnabled || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Clean markdown from text
    const clean = text.replace(/\*\*/g, '').replace(/\n/g, ' ');

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 0.85;

    // Try to pick a warm, natural voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Samantha') || v.name.includes('Karen') ||
      v.name.includes('Daniel') || v.name.includes('Google UK English Female') ||
      v.name.includes('Microsoft Aria')
    ) || voices.find(v => v.lang.startsWith('en') && v.localService) || voices[0];

    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isEnabled]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const toggle = useCallback(() => {
    if (isSpeaking) {
      stop();
    }
    setIsEnabled(prev => !prev);
  }, [isSpeaking, stop]);

  return { speak, stop, isSpeaking, isEnabled, toggle };
}
