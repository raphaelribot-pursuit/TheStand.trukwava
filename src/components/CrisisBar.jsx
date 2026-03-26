import { Phone, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CrisisBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-red-900/95 to-red-800/95 backdrop-blur-md border-t border-red-700/50 px-4 py-3 md:hidden"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <a
              href="tel:988"
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors"
            >
              <Phone size={14} />
              Call 988
            </a>
            <a
              href="sms:741741?body=HELLO"
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors"
            >
              <MessageCircle size={14} />
              Text HELLO
            </a>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-red-300 hover:text-white"
            aria-label="Dismiss crisis bar"
          >
            <X size={18} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
