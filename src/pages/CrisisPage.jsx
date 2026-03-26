import { motion } from 'framer-motion';
import {
  Phone, MessageCircle, ExternalLink, Clock, Heart,
  Shield, ShieldCheck, Users, Globe
} from 'lucide-react';
import { crisisHotlines } from '../data/resources';

const iconMap = {
  Heart, Phone, MessageCircle, Shield, ShieldCheck, Users, Globe,
};

export default function CrisisPage() {
  return (
    <div className="hero-gradient min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-sm text-red-400 mb-6">
            <Phone size={14} />
            All services are free and confidential
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight mb-4">
            Crisis <span className="pride-gradient-text">Support Lines</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Trained counselors are available right now. You don't have to be in immediate danger
            to reach out — if you're struggling, these lines are for you.
          </p>
        </motion.div>

        {/* Quick dial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          <a
            href="tel:988"
            className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-500 rounded-full font-semibold transition-all crisis-pulse shadow-lg shadow-red-600/25"
          >
            <Phone size={16} />
            Call 988 Now
          </a>
          <a
            href="tel:1-866-488-7386"
            className="flex items-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-500 rounded-full font-semibold transition-all"
          >
            <Phone size={16} />
            Trevor Project
          </a>
          <a
            href="sms:741741?body=HELLO"
            className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-500 rounded-full font-semibold transition-all"
          >
            <MessageCircle size={16} />
            Text HELLO to 741741
          </a>
        </motion.div>

        {/* All hotlines */}
        <div className="space-y-4">
          {crisisHotlines.map((hotline, i) => {
            const Icon = iconMap[hotline.icon] || Heart;
            return (
              <motion.div
                key={hotline.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="card-hover rounded-2xl border border-white/5 bg-white/[0.02] p-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${hotline.color} flex items-center justify-center shrink-0`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{hotline.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        hotline.category === 'crisis'
                          ? 'bg-red-500/15 text-red-400'
                          : hotline.category === 'violence'
                          ? 'bg-orange-500/15 text-orange-400'
                          : 'bg-blue-500/15 text-blue-400'
                      }`}>
                        {hotline.category === 'crisis' ? 'Crisis Line' :
                         hotline.category === 'violence' ? 'Violence Support' : 'Peer Support'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                      {hotline.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                      <Clock size={12} />
                      {hotline.hours}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {hotline.phone && (
                        <a
                          href={`tel:${hotline.phone.replace(/[^0-9]/g, '')}`}
                          className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-full text-sm font-medium transition-colors"
                        >
                          <Phone size={14} />
                          {hotline.phone}
                        </a>
                      )}
                      {hotline.text && (
                        <span className="flex items-center gap-1.5 px-4 py-2 bg-white/5 rounded-full text-sm text-slate-300">
                          <MessageCircle size={14} />
                          {hotline.text}
                        </span>
                      )}
                      {hotline.chat && (
                        <a
                          href={hotline.chat}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm text-slate-300 transition-colors"
                        >
                          <ExternalLink size={14} />
                          Online Chat
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Important note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10"
        >
          <p className="text-sm text-amber-200/80 leading-relaxed">
            <strong className="text-amber-300">Important:</strong> If you or someone you know is in
            immediate physical danger, please call <a href="tel:911" className="font-semibold underline">911</a>.
            The resources listed above are staffed by trained counselors who understand the LGBTQIA+
            experience and can provide confidential, nonjudgmental support.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
