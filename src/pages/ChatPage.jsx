import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Phone, MapPin, ExternalLink, MessageCircle,
  RotateCcw, Shield, ChevronDown
} from 'lucide-react';
import { getStartNode, getTriageResponse } from '../data/triageEngine';

const BOT_TYPING_DELAY = 600;
const BOT_MESSAGE_STAGGER = 800;

function BotAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-500 flex items-center justify-center shrink-0 text-xs font-display font-black text-white">
      S
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 max-w-[85%]">
      <BotAvatar />
      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.06] border border-white/[0.06]">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-slate-500"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BotMessage({ text }) {
  // Support basic markdown bold
  const rendered = text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    return (
      <span key={i}>
        {i > 0 && <br />}
        {parts}
      </span>
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2.5 max-w-[85%]"
    >
      <BotAvatar />
      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.06] border border-white/[0.06] text-sm text-slate-300 leading-relaxed">
        {rendered}
      </div>
    </motion.div>
  );
}

function UserMessage({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end"
    >
      <div className="px-4 py-3 rounded-2xl rounded-br-md bg-violet-600/80 text-sm text-white max-w-[80%]">
        {text}
      </div>
    </motion.div>
  );
}

function ResourceCard({ resource, isCrisis }) {
  const isHotline = !!resource.hours;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 hover:bg-white/[0.05] transition-colors"
    >
      <h4 className="text-sm font-semibold text-white mb-1">{resource.name}</h4>
      <p className="text-xs text-slate-400 mb-3 leading-relaxed">{resource.description}</p>

      {resource.address && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
          <MapPin size={11} className="shrink-0" />
          <span className="truncate">{resource.address}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {resource.phone && (
          <a
            href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              isCrisis
                ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                : 'bg-violet-500/15 text-violet-300 hover:bg-violet-500/25'
            }`}
          >
            <Phone size={11} />
            {resource.phone}
          </a>
        )}
        {resource.text && (
          <span className="flex items-center gap-1 px-3 py-1.5 bg-white/5 rounded-full text-xs text-slate-400">
            <MessageCircle size={11} />
            {resource.text}
          </span>
        )}
        {resource.chat && (
          <a
            href={resource.chat}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs text-slate-400 transition-colors"
          >
            <ExternalLink size={11} />
            Online Chat
          </a>
        )}
        {resource.website && (
          <a
            href={resource.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs text-slate-400 transition-colors"
          >
            <ExternalLink size={11} />
            Website
          </a>
        )}
      </div>
    </motion.div>
  );
}

function QuickReplies({ options, onSelect, disabled }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 ml-10"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt)}
          disabled={disabled}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-violet-500/30 text-sm text-slate-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>{opt.icon}</span>
          <span>{opt.label}</span>
        </button>
      ))}
    </motion.div>
  );
}

export default function ChatPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [chatItems, setChatItems] = useState([]); // { type: 'bot'|'user'|'resources'|'options'|'typing', ... }
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentOptions, setCurrentOptions] = useState(null);
  const [isEnded, setIsEnded] = useState(false);
  const initialized = useRef(false);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  // Stream bot messages with typing delay
  const streamBotResponse = useCallback(async (nodeId) => {
    setIsTyping(true);
    setCurrentOptions(null);

    const response = getTriageResponse(nodeId);

    // Handle navigation
    if (response.navigate) {
      setChatItems((prev) => [...prev, { type: 'bot', text: response.messages[0] }]);
      setIsTyping(false);
      setTimeout(() => navigate(response.navigate), 1000);
      return;
    }

    // Stream messages one by one
    for (let i = 0; i < response.messages.length; i++) {
      // Show typing indicator
      await new Promise((r) => setTimeout(r, BOT_TYPING_DELAY));
      scrollToBottom();

      // Replace typing with message
      setChatItems((prev) => [...prev, { type: 'bot', text: response.messages[i] }]);
      await new Promise((r) => setTimeout(r, BOT_MESSAGE_STAGGER));
      scrollToBottom();
    }

    // Show resources if any
    if (response.resources && response.resources.length > 0) {
      const isCrisis = nodeId.startsWith('crisis');
      setChatItems((prev) => [
        ...prev,
        { type: 'resources', resources: response.resources, isCrisis },
      ]);
      await new Promise((r) => setTimeout(r, 400));
      scrollToBottom();
    }

    // Show extra message
    if (response.extraAfter) {
      await new Promise((r) => setTimeout(r, 500));
      setChatItems((prev) => [...prev, { type: 'bot', text: response.extraAfter }]);
      scrollToBottom();
    }

    // Show follow-up message
    if (response.followUpMessage) {
      await new Promise((r) => setTimeout(r, 600));
      setChatItems((prev) => [...prev, { type: 'bot', text: response.followUpMessage }]);
      scrollToBottom();
    }

    // Show options
    if (response.options) {
      await new Promise((r) => setTimeout(r, 300));
      setCurrentOptions(response.options);
      scrollToBottom();
    }

    if (response.isEnd) {
      setIsEnded(true);
    }

    setIsTyping(false);
    setTimeout(scrollToBottom, 100);
  }, [navigate, scrollToBottom]);

  // Initialize chat
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    streamBotResponse('start');
  }, [streamBotResponse]);

  // Handle quick reply
  const handleSelect = useCallback((option) => {
    // Add user message
    setChatItems((prev) => [...prev, { type: 'user', text: option.label }]);
    setCurrentOptions(null);

    // Process response
    setTimeout(() => {
      streamBotResponse(option.value);
    }, 300);
  }, [streamBotResponse]);

  // Handle free text input (maps to keywords)
  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    setChatItems((prev) => [...prev, { type: 'user', text }]);
    setInputValue('');
    setCurrentOptions(null);

    // Simple keyword matching
    const lower = text.toLowerCase();
    let nodeId = 'restart';

    if (/crisis|emergency|danger|suicid|hurt|harm|die|kill/.test(lower)) nodeId = 'crisis';
    else if (/housing|shelter|homeless|sleep/.test(lower)) nodeId = 'housing';
    else if (/health|doctor|medical|hrt|hormone|prep|hiv|std|sti|therap|mental|counsel/.test(lower)) nodeId = 'health';
    else if (/legal|lawyer|law|name change|discriminat|asylum|immigra/.test(lower)) nodeId = 'legal';
    else if (/food|hungry|eat|meal|pantry/.test(lower)) nodeId = 'food';
    else if (/communit|center|group|social|connect|friend/.test(lower)) nodeId = 'community';
    else if (/youth|young|teen|kid|school/.test(lower)) nodeId = 'youth';
    else if (/right|protect|law/.test(lower)) nodeId = 'rights';
    else if (/thank|bye|done|good/.test(lower)) nodeId = 'end';
    else if (/help|start|hi|hello/.test(lower)) nodeId = 'restart';

    setTimeout(() => streamBotResponse(nodeId), 300);
  }, [inputValue, isTyping, streamBotResponse]);

  const handleRestart = () => {
    setChatItems([]);
    setCurrentOptions(null);
    setIsEnded(false);
    initialized.current = false;
    setTimeout(() => {
      initialized.current = true;
      streamBotResponse('start');
    }, 100);
  };

  return (
    <div className="hero-gradient min-h-screen pt-20 pb-4 flex flex-col">
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4">
        {/* Chat header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between py-4 border-b border-white/5 mb-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-500 flex items-center justify-center font-display font-black text-white text-sm">
              S
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">TheStand Guide</h1>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Always available
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <RotateCcw size={13} />
              Start Over
            </button>
            <a
              href="tel:988"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/80 hover:bg-red-500 rounded-full text-xs font-semibold transition-colors"
            >
              <Phone size={12} />
              988
            </a>
          </div>
        </motion.div>

        {/* Privacy notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-1.5 text-xs text-slate-600 mb-4"
        >
          <Shield size={11} />
          This conversation is private and never stored or sent anywhere.
        </motion.div>

        {/* Chat messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 pb-4 min-h-0"
          style={{ maxHeight: 'calc(100vh - 240px)' }}
        >
          <AnimatePresence>
            {chatItems.map((item, i) => {
              if (item.type === 'bot') {
                return <BotMessage key={`bot-${i}`} text={item.text} />;
              }
              if (item.type === 'user') {
                return <UserMessage key={`user-${i}`} text={item.text} />;
              }
              if (item.type === 'resources') {
                return (
                  <motion.div
                    key={`res-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ml-10 space-y-2"
                  >
                    {item.resources.map((r) => (
                      <ResourceCard key={r.id} resource={r} isCrisis={item.isCrisis} />
                    ))}
                  </motion.div>
                );
              }
              return null;
            })}
          </AnimatePresence>

          {isTyping && <TypingIndicator />}

          {currentOptions && !isTyping && (
            <QuickReplies
              options={currentOptions}
              onSelect={handleSelect}
              disabled={isTyping}
            />
          )}

          {isEnded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center pt-4"
            >
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm text-slate-400 transition-colors"
              >
                <RotateCcw size={14} />
                Start a new conversation
              </button>
            </motion.div>
          )}
        </div>

        {/* Input area */}
        <div className="pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isEnded ? "Start over to chat again..." : "Type a message or tap an option above..."}
              disabled={isTyping || isEnded}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all disabled:opacity-40"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping || isEnded}
              className="p-3 bg-violet-600 hover:bg-violet-500 disabled:bg-white/5 disabled:text-slate-600 rounded-xl text-white transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
