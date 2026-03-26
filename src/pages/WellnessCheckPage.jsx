import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, VolumeX, ArrowRight, ArrowLeft, RotateCcw,
  Phone, Heart, Download, Shield, ExternalLink, MessageCircle,
  Sparkles, AlertTriangle, CheckCircle2, Lock, Mic, MicOff, Settings
} from 'lucide-react';
import {
  phq9Questions, gad7Questions, frequencyOptions, difficultyQuestion,
  scorePHQ9, scoreGAD7, personaTransitions
} from '../data/assessments';
import { crisisHotlines, nycResources } from '../data/resources';
import { useSpeech, useSpeechRecognition, matchSpokenAnswer, matchSpokenDifficulty } from '../hooks/useSpeech';
import VoiceSettings from '../components/VoiceSettings';

// ── Sage Persona Avatar ─────────────────────────────────────────────
function SageAvatar({ speaking, size = 'lg' }) {
  const sizeClasses = size === 'lg' ? 'w-20 h-20' : 'w-10 h-10';
  const innerSize = size === 'lg' ? 'w-16 h-16' : 'w-8 h-8';
  const textSize = size === 'lg' ? 'text-2xl' : 'text-sm';

  return (
    <div className={`relative ${sizeClasses} flex items-center justify-center`}>
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-cyan-500/30"
        animate={{
          scale: speaking ? [1, 1.15, 1] : [1, 1.08, 1],
          opacity: speaking ? [0.6, 0.9, 0.6] : [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: speaking ? 1.2 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <div className={`relative ${innerSize} rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25`}>
        <span className={`${textSize} select-none`}>🌿</span>
      </div>
      {speaking && (
        <motion.div
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <Volume2 size={8} className="text-white" />
        </motion.div>
      )}
    </div>
  );
}

// ── Message Bubble ──────────────────────────────────────────────────
function SageMessage({ text, delay = 0 }) {
  const rendered = text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    return <span key={i}>{i > 0 && <br />}{parts}</span>;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-start gap-3 max-w-xl"
    >
      <SageAvatar size="sm" />
      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.06] border border-white/[0.06] text-sm text-slate-300 leading-relaxed">
        {rendered}
      </div>
    </motion.div>
  );
}

// ── Mic Button ──────────────────────────────────────────────────────
function MicButton({ isListening, isSupported, onStart, onStop, transcript }) {
  if (!isSupported) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={isListening ? onStop : onStart}
        className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all ${
          isListening
            ? 'bg-red-500 shadow-lg shadow-red-500/30'
            : 'bg-white/10 hover:bg-white/15 border border-white/10'
        }`}
      >
        {isListening ? (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500/30"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <Mic size={22} className="text-white relative z-10" />
          </>
        ) : (
          <Mic size={20} className="text-slate-400" />
        )}
      </button>
      <span className="text-xs text-slate-500">
        {isListening ? 'Listening...' : 'Tap to speak'}
      </span>
      {transcript && isListening && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 max-w-xs text-center"
        >
          "{transcript}"
        </motion.div>
      )}
    </div>
  );
}

// ── Phase: Welcome ──────────────────────────────────────────────────
function WelcomePhase({ onStart, speak, isSpeaking }) {
  const messages = personaTransitions.welcome;

  useEffect(() => {
    messages.forEach((msg, i) => {
      setTimeout(() => speak(msg), i * 800);
    });
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <SageAvatar size="lg" speaking={isSpeaking} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-display font-bold mt-5 mb-1"
      >
        Meet <span className="pride-gradient-text">Sage</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-slate-500 mb-8"
      >
        Your wellness check-in guide
      </motion.p>

      <div className="space-y-3 mb-10 w-full max-w-md">
        {messages.map((msg, i) => (
          <SageMessage key={i} text={msg} delay={0.6 + i * 0.4} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="flex flex-col items-center gap-3"
      >
        <button
          onClick={onStart}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-full font-semibold transition-all shadow-lg shadow-violet-600/25"
        >
          <Sparkles size={16} />
          Begin Check-In
          <ArrowRight size={16} />
        </button>
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Lock size={11} />
          Takes about 5 minutes. Private and anonymous.
        </div>
      </motion.div>
    </div>
  );
}

// ── Phase: Question (with mic) ──────────────────────────────────────
function QuestionPhase({
  question, questionIndex, totalQuestions, sectionLabel,
  onAnswer, answer, onBack, canGoBack, speak, speaking,
  recognition, isDifficulty,
}) {
  const {
    isListening, transcript, isSupported, startListening, stopListening, resetTranscript,
  } = recognition;

  const lastProcessed = useRef('');

  useEffect(() => {
    speak(question.conversational);
    resetTranscript();
    lastProcessed.current = '';
  }, [question.id]);

  // Process speech recognition results
  useEffect(() => {
    if (!transcript || transcript === lastProcessed.current) return;

    // Wait for silence (final result)
    if (!isListening && transcript) {
      lastProcessed.current = transcript;
      const match = isDifficulty
        ? matchSpokenDifficulty(transcript)
        : matchSpokenAnswer(transcript);

      if (match !== null) {
        // Confirm what we heard
        const label = isDifficulty
          ? difficultyQuestion.options.find(o => o.value === match)?.label
          : frequencyOptions.find(o => o.value === match)?.label;
        speak(`I heard: ${label}. Moving on.`);
        setTimeout(() => onAnswer(question.id, match), 800);
      } else {
        speak("I didn't quite catch that. You can try again or tap an option.");
      }
      resetTranscript();
    }
  }, [isListening, transcript]);

  const options = isDifficulty ? difficultyQuestion.options : frequencyOptions;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>{sectionLabel}</span>
          <span>{questionIndex + 1} of {totalQuestions}</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Sage + Question */}
      <div className="flex items-start gap-3 mb-3">
        <SageAvatar size="sm" speaking={speaking} />
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.06] border border-white/[0.06]"
        >
          <p className="text-base text-white leading-relaxed font-medium">
            {question.conversational}
          </p>
        </motion.div>
      </div>

      {/* Gentle note */}
      <motion.p
        key={`gentle-${question.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-slate-500 italic mb-6"
        style={{ marginLeft: '3.25rem' }}
      >
        {question.gentle}
      </motion.p>

      {/* Sensitive question safety note */}
      {question.isSensitive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-4 rounded-xl bg-red-500/5 border border-red-500/10"
          style={{ marginLeft: '3.25rem' }}
        >
          <div className="flex items-start gap-2">
            <Heart size={14} className="text-red-400 mt-0.5 shrink-0" />
            <div className="text-xs text-red-300/80">
              <p className="mb-1">If you're in crisis right now, please reach out:</p>
              <a href="tel:988" className="font-semibold text-red-300 hover:text-red-200">988 Suicide & Crisis Lifeline</a>
              {' '}&middot;{' '}
              <a href="tel:1-866-488-7386" className="font-semibold text-red-300 hover:text-red-200">Trevor Project</a>
              {' '}&middot;{' '}
              <span>Text HELLO to 741741</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mic button — speak your answer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center mb-6"
        style={{ marginLeft: '3.25rem' }}
      >
        <MicButton
          isListening={isListening}
          isSupported={isSupported}
          onStart={startListening}
          onStop={stopListening}
          transcript={transcript}
        />
      </motion.div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4" style={{ marginLeft: '3.25rem' }}>
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-xs text-slate-600">or tap your answer</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* Answer options */}
      <motion.div
        key={`opts-${question.id}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
        style={{ marginLeft: '3.25rem' }}
      >
        {options.map((opt) => {
          const val = isDifficulty ? opt.value : opt.value;
          const selected = answer === val;
          return (
            <button
              key={val}
              onClick={() => onAnswer(question.id, val)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                selected
                  ? 'border-violet-500/40 bg-violet-500/10 text-white'
                  : 'border-white/5 bg-white/[0.02] text-slate-300 hover:bg-white/[0.05] hover:border-white/10'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                selected ? 'border-violet-500 bg-violet-500' : 'border-slate-600'
              }`}>
                {selected && <CheckCircle2 size={12} className="text-white" />}
              </div>
              <div>
                <div className="text-sm font-medium">{opt.label}</div>
                {opt.description && <div className="text-xs text-slate-500">{opt.description}</div>}
              </div>
            </button>
          );
        })}
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8" style={{ marginLeft: '3.25rem' }}>
        {canGoBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        ) : <div />}
      </div>
    </div>
  );
}

// ── Phase: Transition ───────────────────────────────────────────────
function TransitionPhase({ messages, onContinue, speak }) {
  useEffect(() => {
    messages.forEach((msg, i) => {
      setTimeout(() => speak(msg), i * 800);
    });
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex flex-col items-center mb-8">
        <SageAvatar size="lg" />
      </div>
      <div className="space-y-3 mb-8">
        {messages.map((msg, i) => (
          <SageMessage key={i} text={msg} delay={i * 0.5} />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: messages.length * 0.5 + 0.5 }}
        className="flex justify-center"
      >
        <button
          onClick={onContinue}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-full text-sm font-semibold transition-colors"
        >
          Continue
          <ArrowRight size={14} />
        </button>
      </motion.div>
    </div>
  );
}

// ── Phase: Difficulty (with mic) ────────────────────────────────────
function DifficultyPhase({ onAnswer, speak, recognition }) {
  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } = recognition;
  const lastProcessed = useRef('');

  useEffect(() => {
    speak(difficultyQuestion.text);
    resetTranscript();
  }, []);

  useEffect(() => {
    if (!transcript || transcript === lastProcessed.current) return;
    if (!isListening && transcript) {
      lastProcessed.current = transcript;
      const match = matchSpokenDifficulty(transcript);
      if (match !== null) {
        const label = difficultyQuestion.options.find(o => o.value === match)?.label;
        speak(`I heard: ${label}.`);
        setTimeout(() => onAnswer(match), 800);
      } else {
        speak("I didn't quite catch that. Try again or tap an option.");
      }
      resetTranscript();
    }
  }, [isListening, transcript]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-start gap-3 mb-6">
        <SageAvatar size="sm" />
        <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.06] border border-white/[0.06]">
          <p className="text-base text-white leading-relaxed font-medium">
            One last question — {difficultyQuestion.text.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Mic */}
      <div className="flex justify-center mb-6" style={{ marginLeft: '3.25rem' }}>
        <MicButton
          isListening={isListening}
          isSupported={isSupported}
          onStart={startListening}
          onStop={stopListening}
          transcript={transcript}
        />
      </div>

      <div className="flex items-center gap-3 mb-4" style={{ marginLeft: '3.25rem' }}>
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-xs text-slate-600">or tap your answer</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <div className="space-y-2" style={{ marginLeft: '3.25rem' }}>
        {difficultyQuestion.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onAnswer(opt.value)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-slate-300 hover:bg-white/[0.05] hover:border-white/10 text-left transition-all"
          >
            <div className="w-5 h-5 rounded-full border-2 border-slate-600 shrink-0" />
            <span className="text-sm font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Phase: Results ──────────────────────────────────────────────────
function ResultsPhase({ phq9Result, gad7Result, difficulty, speak }) {
  const colorMap = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', bar: 'from-emerald-500 to-emerald-400' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', bar: 'from-amber-500 to-amber-400' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', bar: 'from-orange-500 to-orange-400' },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', bar: 'from-red-500 to-red-400' },
  };

  const showCrisis = phq9Result.hasSuicidalIdeation || phq9Result.severity === 'Severe' || gad7Result.severity === 'Severe';
  const showTherapy = phq9Result.total >= 10 || gad7Result.total >= 10;

  useEffect(() => {
    if (showCrisis) {
      speak(personaTransitions.crisisDetected[0]);
      setTimeout(() => speak(phq9Result.interpretation), 4000);
      setTimeout(() => speak(gad7Result.interpretation), 8000);
    } else {
      speak("Here are your results. Remember, this is a starting point — not a diagnosis.");
      setTimeout(() => speak(`For depression: your score is ${phq9Result.total} out of 27, which suggests ${phq9Result.severity.toLowerCase()} symptoms. ${phq9Result.recommendation}`), 4000);
      setTimeout(() => speak(`For anxiety: your score is ${gad7Result.total} out of 21, which suggests ${gad7Result.severity.toLowerCase()} symptoms. ${gad7Result.recommendation}`), 10000);
    }
  }, []);

  const healthResources = nycResources.filter(r =>
    r.category === 'health' && r.services?.some(s => /Mental Health|Behavioral/i.test(s))
  );
  const crisisResources = crisisHotlines.filter(h =>
    ['988', 'trevor', 'crisis-text', 'trans-lifeline'].includes(h.id)
  );

  const handleDownload = () => {
    let text = 'WELLNESS CHECK-IN RESULTS\n';
    text += `Date: ${new Date().toLocaleDateString()}\n`;
    text += '='.repeat(50) + '\n\n';
    text += `DEPRESSION SCREENING (PHQ-9)\n`;
    text += `Score: ${phq9Result.total}/27 — ${phq9Result.severity}\n`;
    text += `${phq9Result.interpretation}\n\n`;
    text += `ANXIETY SCREENING (GAD-7)\n`;
    text += `Score: ${gad7Result.total}/21 — ${gad7Result.severity}\n`;
    text += `${gad7Result.interpretation}\n\n`;
    text += '='.repeat(50) + '\n';
    text += 'CRISIS RESOURCES\n';
    text += '988 Suicide & Crisis Lifeline: 988\n';
    text += 'Trevor Project: 1-866-488-7386\n';
    text += 'Trans Lifeline: 877-565-8860\n';
    text += 'Crisis Text Line: Text HELLO to 741741\n\n';
    text += 'DISCLAIMER: This is a screening tool, not a diagnosis.\n';
    text += 'Please consult a healthcare professional for clinical evaluation.\n';

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wellness-check-results.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  function ScoreCard({ title, result }) {
    const c = colorMap[result.color];
    const pct = Math.round((result.total / result.maxScore) * 100);
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border ${c.border} ${c.bg} p-5`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text} border ${c.border}`}>{result.severity}</span>
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span className={`text-3xl font-bold ${c.text}`}>{result.total}</span>
          <span className="text-sm text-slate-500 mb-1">/ {result.maxScore}</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-4">
          <motion.div className={`h-full bg-gradient-to-r ${c.bar} rounded-full`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 }} />
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-2">{result.interpretation}</p>
        <p className="text-sm text-slate-400 leading-relaxed">{result.recommendation}</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {showCrisis && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-5 rounded-2xl bg-red-500/8 border border-red-500/15">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-red-200/90 font-medium mb-3">Based on your responses, please know that support is available right now:</p>
              <div className="flex flex-wrap gap-2">
                {crisisResources.map(r => (
                  <a key={r.id} href={`tel:${r.phone?.replace(/[^0-9]/g, '')}`} className="flex items-center gap-1.5 px-3 py-2 bg-red-500/15 hover:bg-red-500/25 rounded-full text-sm text-red-300 font-medium transition-colors">
                    <Phone size={12} />{r.name}: {r.phone}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mb-6">
        <SageMessage text={showCrisis
          ? "I'm glad you were honest. Let's look at the full picture together. Remember — these scores are a starting point, not a diagnosis."
          : "Here are your results. These scores help paint a picture, but they're a starting point — not a diagnosis. Only a healthcare provider can make a clinical assessment."
        } />
      </div>

      <div className="space-y-4 mb-8">
        <ScoreCard title="Depression Screening (PHQ-9)" result={phq9Result} />
        <ScoreCard title="Anxiety Screening (GAD-7)" result={gad7Result} />
      </div>

      {showTherapy && healthResources.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Heart size={16} className="text-violet-400" />Recommended Resources
          </h3>
          <div className="space-y-2">
            {healthResources.map(r => (
              <div key={r.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <h4 className="text-sm font-semibold text-white mb-1">{r.name}</h4>
                <p className="text-xs text-slate-400 mb-2">{r.description}</p>
                <div className="flex flex-wrap gap-2">
                  {r.phone && <a href={`tel:${r.phone.replace(/[^0-9]/g, '')}`} className="flex items-center gap-1 px-3 py-1.5 bg-violet-500/15 text-violet-300 rounded-full text-xs font-medium hover:bg-violet-500/25 transition-colors"><Phone size={11} />{r.phone}</a>}
                  {r.website && <a href={r.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 bg-white/5 text-slate-400 rounded-full text-xs hover:bg-white/10 transition-colors"><ExternalLink size={11} />Website</a>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap gap-3 mb-6">
        <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 rounded-full text-sm font-medium transition-colors"><Download size={14} />Download Results</button>
        <Link to="/safety-plan" className="flex items-center gap-2 px-4 py-2.5 bg-violet-600/80 hover:bg-violet-500 rounded-full text-sm font-medium transition-colors"><Shield size={14} />Create Safety Plan</Link>
        <Link to="/chat" className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium transition-colors"><MessageCircle size={14} />Find More Resources</Link>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
        <p className="text-xs text-amber-200/60 leading-relaxed">
          <strong className="text-amber-300/80">Disclaimer:</strong> The PHQ-9 and GAD-7 are validated screening tools, not diagnostic instruments.
          They help identify symptoms that may warrant further evaluation by a qualified healthcare professional.
          These results are not a substitute for professional clinical assessment, diagnosis, or treatment.
        </p>
      </motion.div>
    </div>
  );
}

// ── Main Page Component ─────────────────────────────────────────────
const PHASES = {
  WELCOME: 'welcome',
  PHQ9_INTRO: 'phq9_intro',
  PHQ9: 'phq9',
  GAD7_INTRO: 'gad7_intro',
  GAD7: 'gad7',
  DIFFICULTY: 'difficulty',
  RESULTS_INTRO: 'results_intro',
  RESULTS: 'results',
};

export default function WellnessCheckPage() {
  const [phase, setPhase] = useState(PHASES.WELCOME);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [difficulty, setDifficulty] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const { speak, speakNow, stop, isSpeaking, isEnabled, toggle, mode, settings, updateSettings } = useSpeech();
  const recognition = useSpeechRecognition();
  const containerRef = useRef(null);

  const scrollTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = useCallback((qId, value) => {
    // Stop listening if active
    recognition.stopListening();

    setAnswers(prev => ({ ...prev, [qId]: value }));

    setTimeout(() => {
      if (phase === PHASES.PHQ9) {
        if (currentQ < phq9Questions.length - 1) {
          setCurrentQ(prev => prev + 1);
          scrollTop();
        } else {
          setPhase(PHASES.GAD7_INTRO);
          scrollTop();
        }
      } else if (phase === PHASES.GAD7) {
        if (currentQ < gad7Questions.length - 1) {
          setCurrentQ(prev => prev + 1);
          scrollTop();
        } else {
          setPhase(PHASES.DIFFICULTY);
          scrollTop();
        }
      }
    }, 400);
  }, [phase, currentQ, recognition]);

  const handleBack = useCallback(() => {
    if (currentQ > 0) {
      setCurrentQ(prev => prev - 1);
      scrollTop();
    }
  }, [currentQ]);

  const handleRestart = () => {
    stop();
    recognition.stopListening();
    setPhase(PHASES.WELCOME);
    setAnswers({});
    setCurrentQ(0);
    setDifficulty(null);
    scrollTop();
  };

  const phq9Result = phase === PHASES.RESULTS ? scorePHQ9(answers) : null;
  const gad7Result = phase === PHASES.RESULTS ? scoreGAD7(answers) : null;

  return (
    <div className="hero-gradient min-h-screen pt-20 pb-16">
      {/* Header bar */}
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between py-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌿</span>
          <span className="text-sm font-semibold text-white">Sage</span>
          <span className="text-xs text-slate-500">Wellness Check-In</span>
          {mode === 'elevenlabs' && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              Premium Voice
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
            title="Voice settings"
          >
            <Settings size={13} />
          </button>
          <button
            onClick={toggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
              isEnabled
                ? 'bg-violet-500/15 text-violet-300'
                : 'bg-white/5 text-slate-500 hover:text-slate-300'
            }`}
          >
            {isEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            {isEnabled ? 'Voice On' : 'Voice Off'}
          </button>
          {recognition.isSupported && (
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-cyan-500/10 text-cyan-400">
              <Mic size={12} />
              <span className="hidden sm:inline">Mic Ready</span>
            </div>
          )}
          {phase !== PHASES.WELCOME && (
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <RotateCcw size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Privacy badge */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 mb-6">
        <Lock size={11} />
        Everything stays on your device. Nothing is stored or sent.
      </div>

      {/* Main content */}
      <div ref={containerRef} className="max-w-2xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {phase === PHASES.WELCOME && (
            <motion.div key="welcome" exit={{ opacity: 0, y: -20 }}>
              <WelcomePhase
                onStart={() => { setPhase(PHASES.PHQ9_INTRO); scrollTop(); }}
                speak={speak}
                isSpeaking={isSpeaking}
              />
            </motion.div>
          )}

          {phase === PHASES.PHQ9_INTRO && (
            <motion.div key="phq9-intro" exit={{ opacity: 0, y: -20 }}>
              <TransitionPhase
                messages={personaTransitions.startPHQ9}
                onContinue={() => { setCurrentQ(0); setPhase(PHASES.PHQ9); scrollTop(); }}
                speak={speak}
              />
            </motion.div>
          )}

          {phase === PHASES.PHQ9 && (
            <motion.div key={`phq9-${currentQ}`} exit={{ opacity: 0, x: -30 }}>
              <QuestionPhase
                question={phq9Questions[currentQ]}
                questionIndex={currentQ}
                totalQuestions={phq9Questions.length}
                sectionLabel="Depression Screening (PHQ-9)"
                onAnswer={handleAnswer}
                answer={answers[phq9Questions[currentQ].id]}
                onBack={handleBack}
                canGoBack={currentQ > 0}
                speak={speak}
                speaking={isSpeaking}
                recognition={recognition}
              />
            </motion.div>
          )}

          {phase === PHASES.GAD7_INTRO && (
            <motion.div key="gad7-intro" exit={{ opacity: 0, y: -20 }}>
              <TransitionPhase
                messages={personaTransitions.phq9ToGad7}
                onContinue={() => { setCurrentQ(0); setPhase(PHASES.GAD7); scrollTop(); }}
                speak={speak}
              />
            </motion.div>
          )}

          {phase === PHASES.GAD7 && (
            <motion.div key={`gad7-${currentQ}`} exit={{ opacity: 0, x: -30 }}>
              <QuestionPhase
                question={gad7Questions[currentQ]}
                questionIndex={currentQ}
                totalQuestions={gad7Questions.length}
                sectionLabel="Anxiety Screening (GAD-7)"
                onAnswer={handleAnswer}
                answer={answers[gad7Questions[currentQ].id]}
                onBack={handleBack}
                canGoBack={currentQ > 0}
                speak={speak}
                speaking={isSpeaking}
                recognition={recognition}
              />
            </motion.div>
          )}

          {phase === PHASES.DIFFICULTY && (
            <motion.div key="difficulty" exit={{ opacity: 0, y: -20 }}>
              <DifficultyPhase
                onAnswer={(val) => {
                  recognition.stopListening();
                  setDifficulty(val);
                  setPhase(PHASES.RESULTS_INTRO);
                  scrollTop();
                }}
                speak={speak}
                recognition={recognition}
              />
            </motion.div>
          )}

          {phase === PHASES.RESULTS_INTRO && (
            <motion.div key="results-intro" exit={{ opacity: 0, y: -20 }}>
              <TransitionPhase
                messages={personaTransitions.beforeResults}
                onContinue={() => { setPhase(PHASES.RESULTS); scrollTop(); }}
                speak={speak}
              />
            </motion.div>
          )}

          {phase === PHASES.RESULTS && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ResultsPhase
                phq9Result={phq9Result}
                gad7Result={gad7Result}
                difficulty={difficulty}
                speak={speak}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Voice Settings Modal */}
      <VoiceSettings
        settings={settings}
        updateSettings={updateSettings}
        mode={mode}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
