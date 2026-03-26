import { Heart, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-500 flex items-center justify-center font-display font-black text-white text-sm">
                S
              </div>
              <span className="font-display text-lg font-bold pride-gradient-text">
                TheStand
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Crisis resources and community support for LGBTQIA+ people in New York City.
              You are not alone. You matter.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/crisis" className="block text-sm text-slate-400 hover:text-white transition-colors">Crisis Hotlines</Link>
              <Link to="/resources" className="block text-sm text-slate-400 hover:text-white transition-colors">Resource Directory</Link>
              <Link to="/safety-plan" className="block text-sm text-slate-400 hover:text-white transition-colors">Safety Planning</Link>
              <Link to="/rights" className="block text-sm text-slate-400 hover:text-white transition-colors">Know Your Rights</Link>
            </div>
          </div>

          {/* Emergency */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">In Crisis?</h3>
            <div className="space-y-2">
              <a href="tel:988" className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-medium">
                <Phone size={14} /> 988 Suicide & Crisis Lifeline
              </a>
              <a href="tel:1-866-488-7386" className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 font-medium">
                <Phone size={14} /> Trevor Project: 1-866-488-7386
              </a>
              <a href="tel:877-565-8860" className="flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300 font-medium">
                <Phone size={14} /> Trans Lifeline: 877-565-8860
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            TheStand is a community resource. Information is provided for reference and may change.
            Always contact organizations directly for the most current information.
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            Built with <Heart size={12} className="text-red-500" /> for the community
          </p>
        </div>
      </div>
      <div className="pride-bar h-1 w-full" />
    </footer>
  );
}
