import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, Heart, Shield, BookOpen, Home, Search, FileText, MessageCircle, Sparkles } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Wellness Check', icon: Sparkles },
  { to: '/home', label: 'Home', icon: Home },
  { to: '/chat', label: 'Get Help', icon: MessageCircle },
  { to: '/crisis', label: 'Crisis Lines', icon: Phone },
  { to: '/resources', label: 'Resources', icon: Search },
  { to: '/safety-plan', label: 'Safety Plan', icon: Shield },
  { to: '/rights', label: 'Know Your Rights', icon: BookOpen },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Pride bar */}
      <div className="pride-bar h-1 w-full fixed top-0 z-50" />

      <nav className="glass fixed top-1 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-500 flex items-center justify-center font-display font-black text-white text-lg">
                S
              </div>
              <span className="font-display text-xl font-bold pride-gradient-text">
                TheStand
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      active
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                    {active && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-white/10 rounded-lg -z-10"
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Crisis CTA */}
            <a
              href="tel:988"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-full text-sm font-semibold transition-colors crisis-pulse"
            >
              <Phone size={14} />
              Crisis? Call 988
            </a>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-white/5"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === to
                        ? 'bg-white/10 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                ))}
                <a
                  href="tel:988"
                  className="flex items-center gap-2 px-3 py-2.5 bg-red-600 rounded-lg text-sm font-semibold mt-2"
                >
                  <Phone size={16} />
                  Crisis? Call 988
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
