import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone, MessageCircle, Heart, Shield, BookOpen, Search,
  ArrowRight, MapPin, Clock, Users, Sparkles
} from 'lucide-react';
import { crisisHotlines, resourceCategories } from '../data/resources';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function HomePage() {
  const topCrisis = crisisHotlines.slice(0, 3);

  return (
    <div className="hero-gradient">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-fuchsia-500/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-slate-300 mb-8">
              <MapPin size={14} className="text-fuchsia-400" />
              New York City
              <span className="w-1 h-1 rounded-full bg-slate-500" />
              LGBTQIA+ Resources
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6"
          >
            You are{' '}
            <span className="pride-gradient-text">not alone.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            TheStand connects LGBTQIA+ New Yorkers with crisis support, health services,
            housing, legal aid, and community — all in one place.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="tel:988"
              className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 rounded-full text-base font-semibold transition-all crisis-pulse shadow-lg shadow-red-600/25"
            >
              <Phone size={18} />
              In Crisis? Call 988
            </a>
            <Link
              to="/resources"
              className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full text-base font-semibold transition-all"
            >
              <Search size={18} />
              Find Resources
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Crisis Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
            Immediate Help
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Free, confidential support available right now. You don't need to be in danger to reach out.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCrisis.map((hotline, i) => (
            <motion.div
              key={hotline.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-hover rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${hotline.color} flex items-center justify-center mb-4`}>
                {hotline.id === 'trevor' && <Heart size={22} className="text-white" />}
                {hotline.id === '988' && <Phone size={22} className="text-white" />}
                {hotline.id === 'crisis-text' && <MessageCircle size={22} className="text-white" />}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{hotline.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{hotline.description}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                <Clock size={12} />
                {hotline.hours}
              </div>
              <div className="flex flex-wrap gap-2">
                {hotline.phone && (
                  <a
                    href={`tel:${hotline.phone.replace(/[^0-9]/g, '')}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-full text-sm font-medium transition-colors"
                  >
                    <Phone size={13} />
                    Call {hotline.phone}
                  </a>
                )}
                {hotline.text && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full text-sm text-slate-400">
                    <MessageCircle size={13} />
                    Text {hotline.text}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/crisis"
            className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            View all crisis resources
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
            Resources by Category
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Explore LGBTQIA+ affirming services across all five boroughs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resourceCategories.map((cat, i) => {
            const iconMap = {
              Stethoscope: Heart,
              Home: Shield,
              Scale: BookOpen,
              UtensilsCrossed: Heart,
              Building2: Users,
              Sparkles: Sparkles,
            };
            const Icon = iconMap[cat.icon] || Heart;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/resources?category=${cat.id}`}
                  className="card-hover block rounded-2xl border border-white/5 bg-white/[0.02] p-6 h-full"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{cat.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{cat.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Safety Plan CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border border-white/5 bg-gradient-to-br from-violet-950/50 to-slate-950 p-8 sm:p-12 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} className="text-violet-400" />
              <span className="text-sm font-medium text-violet-400">Personal Safety Plan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
              Create your safety plan
            </h2>
            <p className="text-slate-400 max-w-xl mb-6 leading-relaxed">
              A safety plan is a personalized, practical plan you create for yourself to use
              during moments of crisis. It helps you recognize warning signs, use coping strategies,
              and reach out for help. Everything stays private on your device.
            </p>
            <Link
              to="/safety-plan"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-full text-sm font-semibold transition-colors"
            >
              <Shield size={16} />
              Start My Safety Plan
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
