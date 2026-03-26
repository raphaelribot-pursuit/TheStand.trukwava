import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ChevronDown, Scale, Shield, Briefcase, Home,
  Store, Heart, FileText, GraduationCap, Globe, Phone,
  ExternalLink, AlertCircle
} from 'lucide-react';
import { rightsInfo } from '../data/resources';

const iconMap = {
  Briefcase, Home, Store, Stethoscope: Heart, FileText,
  GraduationCap, Shield, Globe,
};

export default function RightsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="hero-gradient min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm text-violet-400 mb-6">
            <Scale size={14} />
            Your rights in New York
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight mb-4">
            Know Your <span className="pride-gradient-text">Rights</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            New York has some of the strongest LGBTQIA+ protections in the country.
            Here's what you're entitled to under NYC and NYS law.
          </p>
        </motion.div>

        {/* Rights accordion */}
        <div className="space-y-3">
          {rightsInfo.map((right, i) => {
            const isOpen = openIndex === i;
            const Icon = iconMap[right.icon] || BookOpen;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'border-violet-500/20 bg-violet-500/[0.03]'
                    : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-violet-400" />
                  </div>
                  <span className="flex-1 text-base font-semibold text-white">
                    {right.title}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pl-19">
                        <p className="text-sm text-slate-300 leading-relaxed mb-3">
                          {right.content}
                        </p>
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                          <Scale size={13} className="text-slate-500 mt-0.5 shrink-0" />
                          <span className="text-xs text-slate-500">
                            <strong className="text-slate-400">Legal basis:</strong> {right.law}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Legal help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8"
        >
          <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
            <Shield size={20} className="text-violet-400" />
            Need Legal Help?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                name: 'Sylvia Rivera Law Project',
                desc: 'Free legal services for trans, intersex & GNC people',
                phone: '212-337-8550',
                url: 'https://srlp.org',
              },
              {
                name: 'Lambda Legal Help Desk',
                desc: 'Legal help for LGBTQ+ discrimination cases',
                phone: '212-809-8585',
                url: 'https://lambdalegal.org',
              },
              {
                name: 'NYC Commission on Human Rights',
                desc: 'File discrimination complaints — free',
                phone: '311',
                url: 'https://nyc.gov/cchr',
              },
              {
                name: 'Legal Aid Society',
                desc: 'Free civil legal services for low-income NYers',
                phone: '212-577-3300',
                url: 'https://legalaidnyc.org',
              },
            ].map((org) => (
              <div
                key={org.name}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/5"
              >
                <h3 className="text-sm font-semibold text-white mb-1">{org.name}</h3>
                <p className="text-xs text-slate-400 mb-2">{org.desc}</p>
                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${org.phone.replace(/[^0-9]/g, '')}`}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <Phone size={11} />
                    {org.phone}
                  </a>
                  <a
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink size={11} />
                    Website
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10"
        >
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-200/70 leading-relaxed">
              <strong className="text-amber-300">Disclaimer:</strong> This information is provided
              for educational purposes and does not constitute legal advice. Laws and policies may
              change. For legal matters, please consult a qualified attorney or contact the
              organizations listed above.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
