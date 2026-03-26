import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Save, Download, Trash2, ChevronRight, Lock,
  AlertTriangle, Heart, Phone, CheckCircle2
} from 'lucide-react';
import { safetyPlanTemplate } from '../data/resources';

const STORAGE_KEY = 'thestand-safety-plan';

export default function SafetyPlanPage() {
  const [plan, setPlan] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Initialize empty
    const initial = {};
    safetyPlanTemplate.sections.forEach((s) => {
      initial[s.id] = '';
    });
    return initial;
  });

  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    // Auto-save
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {}
  }, [plan]);

  const handleChange = (sectionId, value) => {
    setPlan((prev) => ({ ...prev, [sectionId]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your safety plan? This cannot be undone.')) {
      const empty = {};
      safetyPlanTemplate.sections.forEach((s) => {
        empty[s.id] = '';
      });
      setPlan(empty);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleDownload = () => {
    let text = 'MY SAFETY PLAN\n';
    text += `Created with TheStand — ${new Date().toLocaleDateString()}\n`;
    text += '═'.repeat(50) + '\n\n';

    safetyPlanTemplate.sections.forEach((section) => {
      text += `${section.title.toUpperCase()}\n`;
      text += '─'.repeat(40) + '\n';
      text += (plan[section.id] || '(not filled in)') + '\n\n';
    });

    text += '═'.repeat(50) + '\n';
    text += 'EMERGENCY NUMBERS\n';
    text += '988 Suicide & Crisis Lifeline: 988\n';
    text += 'Trevor Project: 1-866-488-7386\n';
    text += 'Trans Lifeline: 877-565-8860\n';
    text += 'Crisis Text Line: Text HELLO to 741741\n';
    text += 'NYC Anti-Violence Project: 212-714-1141\n';

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-safety-plan.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filledCount = safetyPlanTemplate.sections.filter((s) => plan[s.id]?.trim()).length;
  const totalSections = safetyPlanTemplate.sections.length;
  const progress = Math.round((filledCount / totalSections) * 100);

  return (
    <div className="hero-gradient min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm text-violet-400 mb-6">
            <Lock size={14} />
            Private — stored only on your device
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight mb-4">
            My Safety <span className="pride-gradient-text">Plan</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            A safety plan helps you navigate moments of crisis. Fill in each section
            at your own pace. Your plan is saved automatically and never leaves your device.
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">
              {filledCount} of {totalSections} sections completed
            </span>
            <span className="text-violet-400 font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4">
          {safetyPlanTemplate.sections.map((section, i) => {
            const isActive = activeSection === i;
            const isFilled = plan[section.id]?.trim();

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className={`rounded-2xl border transition-all ${
                  isActive
                    ? 'border-violet-500/30 bg-violet-500/[0.03]'
                    : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                <button
                  onClick={() => setActiveSection(isActive ? -1 : i)}
                  className="w-full flex items-center gap-3 p-5 text-left"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isFilled
                      ? 'bg-green-500/15 text-green-400'
                      : 'bg-white/5 text-slate-500'
                  }`}>
                    {isFilled ? <CheckCircle2 size={16} /> : <span className="text-sm font-medium">{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white">{section.title}</h3>
                    {!isActive && isFilled && (
                      <p className="text-sm text-slate-500 truncate mt-0.5">{plan[section.id]}</p>
                    )}
                  </div>
                  <ChevronRight
                    size={18}
                    className={`text-slate-500 transition-transform ${isActive ? 'rotate-90' : ''}`}
                  />
                </button>

                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-sm text-slate-400 mb-3">{section.description}</p>
                    <textarea
                      value={plan[section.id] || ''}
                      onChange={(e) => handleChange(section.id, e.target.value)}
                      placeholder={section.placeholder}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all resize-y"
                    />
                    {i < totalSections - 1 && (
                      <button
                        onClick={() => setActiveSection(i + 1)}
                        className="mt-3 flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
                      >
                        Next section
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center gap-3 mt-8"
        >
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-violet-600 hover:bg-violet-500 text-white'
            }`}
          >
            {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {saved ? 'Saved!' : 'Save Plan'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 rounded-full text-sm font-medium transition-colors"
          >
            <Download size={16} />
            Download as Text
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-500 hover:text-red-400 transition-colors ml-auto"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </motion.div>

        {/* Crisis reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 p-6 rounded-2xl bg-red-500/5 border border-red-500/10"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-red-200/80 leading-relaxed mb-3">
                If you're in crisis right now, please reach out to a trained counselor:
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="tel:988"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 rounded-full text-sm text-red-300 font-medium transition-colors"
                >
                  <Phone size={13} />
                  Call 988
                </a>
                <a
                  href="tel:1-866-488-7386"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 rounded-full text-sm text-red-300 font-medium transition-colors"
                >
                  <Phone size={13} />
                  Trevor Project
                </a>
                <a
                  href="sms:741741?body=HELLO"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 rounded-full text-sm text-red-300 font-medium transition-colors"
                >
                  <Heart size={13} />
                  Text HELLO to 741741
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
