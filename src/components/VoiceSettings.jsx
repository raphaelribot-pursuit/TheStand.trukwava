import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Volume2, Key, Mic, Check } from 'lucide-react';

const VOICE_OPTIONS = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Warm, calm, American female' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Soft, friendly, young female' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Deep, clear, American male' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', description: 'Warm, gentle, male' },
  { id: 'jBpfuIE2acCO8z3wKNLl', name: 'Gigi', description: 'Bright, warm, expressive female' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', description: 'Calm, authoritative, British male' },
];

export default function VoiceSettings({ settings, updateSettings, mode, isOpen, onClose }) {
  const [testStatus, setTestStatus] = useState('');

  const handleTestVoice = async () => {
    if (!settings.apiKey) {
      setTestStatus('Please enter an API key first');
      return;
    }

    setTestStatus('Testing...');
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${settings.voiceId || '21m00Tcm4TlvDq8ikWAM'}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': settings.apiKey,
          },
          body: JSON.stringify({
            text: "Hi, I'm Sage. I'm here to walk with you through a wellness check-in.",
            model_id: 'eleven_multilingual_v2',
            voice_settings: { stability: 0.6, similarity_boost: 0.75, style: 0.4 },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        setTestStatus('API error — check your key');
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play();
      setTestStatus('Playing!');
      setTimeout(() => setTestStatus(''), 3000);
    } catch (err) {
      setTestStatus('Connection failed');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-50 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-violet-400" />
                <h2 className="text-base font-semibold text-white">Voice Settings</h2>
              </div>
              <button onClick={onClose} className="p-1 text-slate-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Current mode */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 text-sm">
                  <Volume2 size={14} className={mode === 'elevenlabs' ? 'text-emerald-400' : 'text-amber-400'} />
                  <span className="text-slate-300">
                    {mode === 'elevenlabs' ? (
                      <><span className="text-emerald-400 font-medium">ElevenLabs</span> — Premium voice active</>
                    ) : (
                      <><span className="text-amber-400 font-medium">Browser Voice</span> — Add API key for premium</>
                    )}
                  </span>
                </div>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                  <Key size={13} />
                  ElevenLabs API Key
                </label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => updateSettings({ apiKey: e.target.value })}
                  placeholder="Enter your ElevenLabs API key..."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all"
                />
                <p className="text-xs text-slate-600 mt-1.5">
                  Get a key at elevenlabs.io. Stored locally on your device only.
                </p>
              </div>

              {/* Voice selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                  <Mic size={13} />
                  Sage's Voice
                </label>
                <div className="space-y-1.5">
                  {VOICE_OPTIONS.map((voice) => {
                    const selected = (settings.voiceId || '21m00Tcm4TlvDq8ikWAM') === voice.id;
                    return (
                      <button
                        key={voice.id}
                        onClick={() => updateSettings({ voiceId: voice.id })}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                          selected
                            ? 'bg-violet-500/10 border border-violet-500/30 text-white'
                            : 'bg-white/[0.02] border border-white/5 text-slate-400 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          selected ? 'border-violet-500 bg-violet-500' : 'border-slate-600'
                        }`}>
                          {selected && <Check size={10} className="text-white" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{voice.name}</div>
                          <div className="text-xs text-slate-500">{voice.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Test button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTestVoice}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-full text-sm font-medium transition-colors"
                >
                  <Volume2 size={14} />
                  Test Voice
                </button>
                {testStatus && (
                  <span className="text-xs text-slate-400">{testStatus}</span>
                )}
              </div>

              {/* Speech recognition info */}
              <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                <div className="flex items-start gap-2">
                  <Mic size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-cyan-200/70 leading-relaxed">
                    <strong className="text-cyan-300">Speech Recognition:</strong> Uses your browser's
                    built-in speech recognition (free). Click the mic button during questions to speak
                    your answer instead of tapping.
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/5 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
