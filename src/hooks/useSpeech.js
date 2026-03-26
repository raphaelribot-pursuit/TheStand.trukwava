import { useState, useCallback, useRef, useEffect } from 'react';

const ELEVENLABS_API = 'https://api.elevenlabs.io/v1/text-to-speech';
const STORAGE_KEY = 'thestand-voice-settings';

// Default ElevenLabs voice — "Rachel" is warm and calm
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

/**
 * Load saved voice settings from localStorage
 */
function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { apiKey: '', voiceId: DEFAULT_VOICE_ID, mode: 'browser' };
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

/**
 * Combined TTS hook: ElevenLabs (premium) or Web Speech API (fallback).
 * Auto-speaks when enabled — Sage reads everything aloud.
 */
export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true); // Voice ON by default
  const [settings, setSettings] = useState(loadSettings);
  const audioRef = useRef(null);
  const abortRef = useRef(null);
  const queueRef = useRef([]);
  const processingRef = useRef(false);

  // Determine mode: elevenlabs if API key exists, otherwise browser
  const mode = settings.apiKey ? 'elevenlabs' : 'browser';

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // ── ElevenLabs TTS ──────────────────────────────────────
  const speakElevenLabs = useCallback(async (text) => {
    const clean = text.replace(/\*\*/g, '').replace(/\n/g, ' ').trim();
    if (!clean) return;

    // Cancel previous
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setIsSpeaking(true);

    try {
      const response = await fetch(
        `${ELEVENLABS_API}/${settings.voiceId || DEFAULT_VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': settings.apiKey,
          },
          body: JSON.stringify({
            text: clean,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.6,
              similarity_boost: 0.75,
              style: 0.4,
              use_speaker_boost: true,
            },
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        console.warn('ElevenLabs API error, falling back to browser TTS');
        speakBrowser(text);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        processQueue();
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        processQueue();
      };

      await audio.play();
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('ElevenLabs failed, falling back to browser TTS');
        speakBrowser(text);
      } else {
        setIsSpeaking(false);
      }
    }
  }, [settings.apiKey, settings.voiceId]);

  // ── Browser TTS (fallback) ──────────────────────────────
  const speakBrowser = useCallback((text) => {
    if (!window.speechSynthesis) {
      setIsSpeaking(false);
      processQueue();
      return;
    }

    window.speechSynthesis.cancel();

    const clean = text.replace(/\*\*/g, '').replace(/\n/g, ' ').trim();
    if (!clean) {
      processQueue();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 0.85;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Samantha') || v.name.includes('Karen') ||
      v.name.includes('Daniel') || v.name.includes('Google UK English Female') ||
      v.name.includes('Microsoft Aria')
    ) || voices.find(v => v.lang.startsWith('en') && v.localService) || voices[0];

    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      processQueue();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      processQueue();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // ── Queue system for sequential speech ──────────────────
  const processQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      processingRef.current = false;
      return;
    }

    const next = queueRef.current.shift();
    if (mode === 'elevenlabs') {
      speakElevenLabs(next);
    } else {
      speakBrowser(next);
    }
  }, [mode, speakElevenLabs, speakBrowser]);

  // ── Public speak function (queues messages) ─────────────
  const speak = useCallback((text) => {
    if (!isEnabled) return;

    queueRef.current.push(text);

    if (!processingRef.current) {
      processingRef.current = true;
      processQueue();
    }
  }, [isEnabled, processQueue]);

  // ── Speak immediately (skips queue, cancels current) ────
  const speakNow = useCallback((text) => {
    if (!isEnabled) return;

    // Clear queue and cancel current
    queueRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();

    processingRef.current = true;
    if (mode === 'elevenlabs') {
      speakElevenLabs(text);
    } else {
      speakBrowser(text);
    }
  }, [isEnabled, mode, speakElevenLabs, speakBrowser]);

  const stop = useCallback(() => {
    queueRef.current = [];
    processingRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
    }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const toggle = useCallback(() => {
    if (isSpeaking) stop();
    setIsEnabled(prev => !prev);
  }, [isSpeaking, stop]);

  return {
    speak,
    speakNow,
    stop,
    isSpeaking,
    isEnabled,
    toggle,
    mode,
    settings,
    updateSettings,
  };
}

/**
 * Speech recognition hook using Web Speech API.
 * Listens for user speech and returns transcript.
 */
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3;

      recognition.onresult = (event) => {
        let final = '';
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += t;
          } else {
            interim += t;
          }
        }
        setTranscript(final || interim);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        if (event.error !== 'aborted') {
          console.warn('Speech recognition error:', event.error);
        }
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setTranscript('');
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      // Already started
    }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}

/**
 * Match spoken words to frequency options.
 * Returns the best matching option value (0-3) or null.
 */
export function matchSpokenAnswer(transcript) {
  const lower = transcript.toLowerCase().trim();

  // Direct number matches
  if (/^(zero|0|none|not at all|not really|no|nah|nope)/.test(lower)) return 0;
  if (/^(one|1|several|some days|a few|a little|sometimes)/.test(lower)) return 1;
  if (/^(two|2|more than half|most days|often|a lot|frequently|yeah kind of)/.test(lower)) return 2;
  if (/^(three|3|nearly every|every day|all the time|always|constantly|yes definitely)/.test(lower)) return 3;

  // Keyword matching
  if (/not at all|hasn't been|no issue|doing fine|i'm good|i'm okay/.test(lower)) return 0;
  if (/several days|few days|here and there|a bit|somewhat/.test(lower)) return 1;
  if (/more than half|most of the time|pretty often|quite a bit/.test(lower)) return 2;
  if (/nearly every|every single|all the time|constant|non.?stop|always/.test(lower)) return 3;

  // Severity-based inference
  if (/never|nope|not really|don't think so/.test(lower)) return 0;
  if (/maybe|a little|kind of|sort of/.test(lower)) return 1;
  if (/yeah|quite|often|lot/.test(lower)) return 2;
  if (/definitely|absolutely|very|extremely|so much/.test(lower)) return 3;

  return null;
}

/**
 * Match spoken words to difficulty options.
 */
export function matchSpokenDifficulty(transcript) {
  const lower = transcript.toLowerCase().trim();

  if (/not difficult|not at all|no problem|fine|easy|hasn't/.test(lower)) return 'not_difficult';
  if (/somewhat|a little|kind of|sort of|moderately/.test(lower)) return 'somewhat';
  if (/very difficult|very hard|really hard|a lot/.test(lower)) return 'very';
  if (/extremely|impossible|can't function|overwhelm/.test(lower)) return 'extremely';

  return null;
}
