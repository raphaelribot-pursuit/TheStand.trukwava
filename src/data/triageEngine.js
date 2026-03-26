import { crisisHotlines, nycResources, rightsInfo } from './resources';

/**
 * Rule-based triage chatbot engine.
 * Walks users through a decision tree, then surfaces matching resources.
 */

// ── Node definitions ───────────────────────────────────────────────
// Each node has: message(s) from the bot, quick-reply options, and a resolver.

const NODES = {
  start: {
    messages: [
      "Hi, I'm here to help you find the right support. Everything you share here stays on your device — nothing is stored or sent anywhere.",
      "What's going on right now?",
    ],
    options: [
      { label: "I'm in crisis or danger", value: 'crisis', icon: '🚨' },
      { label: "I need health or medical care", value: 'health', icon: '🩺' },
      { label: "I need housing or shelter", value: 'housing', icon: '🏠' },
      { label: "I need legal help", value: 'legal', icon: '⚖️' },
      { label: "I need food or basic needs", value: 'food', icon: '🍎' },
      { label: "I'm looking for community", value: 'community', icon: '💜' },
      { label: "I need youth services", value: 'youth', icon: '✨' },
      { label: "I want to know my rights", value: 'rights', icon: '📋' },
    ],
  },

  // ── Crisis branch ──────────────────────────────────────
  crisis: {
    messages: [
      "I hear you, and I'm glad you're reaching out. You're not alone in this.",
      "Can you tell me a little more about what's happening?",
    ],
    options: [
      { label: "I'm having thoughts of suicide or self-harm", value: 'crisis_suicide', icon: '💛' },
      { label: "I'm experiencing violence or abuse", value: 'crisis_violence', icon: '🛡️' },
      { label: "I'm a young person (under 25) in crisis", value: 'crisis_youth', icon: '💙' },
      { label: "I'm a trans person and need peer support", value: 'crisis_trans', icon: '🏳️‍⚧️' },
      { label: "Something else — I just need to talk", value: 'crisis_general', icon: '💬' },
    ],
  },

  crisis_suicide: {
    messages: [
      "Your life matters, and help is available right now.",
      "Here are trained counselors who understand the LGBTQIA+ experience and are available 24/7:",
    ],
    resources: () => crisisHotlines.filter(h => ['988', 'trevor', 'crisis-text', 'trans-lifeline'].includes(h.id)),
    followUp: "Would you like help with anything else?",
  },

  crisis_violence: {
    messages: [
      "I'm sorry you're going through this. You deserve to be safe.",
      "These organizations specialize in supporting LGBTQ+ people experiencing violence:",
    ],
    resources: () => crisisHotlines.filter(h => ['antiviolence', 'stronghearts', '988'].includes(h.id)),
    followUp: "Would you like help with anything else?",
  },

  crisis_youth: {
    messages: [
      "It takes courage to reach out. These lines are specifically for LGBTQ+ young people — they get it:",
    ],
    resources: () => crisisHotlines.filter(h => ['trevor', 'crisis-text', '988'].includes(h.id)),
    followUp: "Would you like help with anything else?",
  },

  crisis_trans: {
    messages: [
      "Trans Lifeline is run by and for trans people. They practice informed consent and will never call emergency services without your permission.",
    ],
    resources: () => crisisHotlines.filter(h => ['trans-lifeline', '988', 'crisis-text'].includes(h.id)),
    followUp: "Would you like help with anything else?",
  },

  crisis_general: {
    messages: [
      "Sometimes you just need someone to listen. These lines are free, confidential, and staffed by people who understand:",
    ],
    resources: () => crisisHotlines.filter(h => ['988', 'glbt-hotline', 'crisis-text', 'trevor'].includes(h.id)),
    followUp: "Would you like help with anything else?",
  },

  // ── Health branch ──────────────────────────────────────
  health: {
    messages: [
      "Let's find you the right care. What kind of health support are you looking for?",
    ],
    options: [
      { label: "HIV/STI testing or PrEP", value: 'health_hiv', icon: '🔬' },
      { label: "Hormone therapy (HRT)", value: 'health_hrt', icon: '💊' },
      { label: "Mental health / therapy", value: 'health_mental', icon: '🧠' },
      { label: "General primary care", value: 'health_primary', icon: '🩺' },
      { label: "I'm not sure — just need a doctor", value: 'health_general', icon: '❓' },
    ],
  },

  health_hiv: {
    messages: [
      "Here are LGBTQ+ affirming clinics in NYC that offer HIV/STI testing and PrEP — many on a sliding scale or free:",
    ],
    resources: () => nycResources.filter(r =>
      r.category === 'health' && r.services?.some(s => /HIV|PrEP|STI/.test(s))
    ),
    followUp: "Need help with anything else?",
  },

  health_hrt: {
    messages: [
      "These NYC clinics offer hormone therapy with informed consent — you don't need a therapist letter to start:",
    ],
    resources: () => nycResources.filter(r =>
      r.category === 'health' && r.services?.some(s => /HRT|Hormone/i.test(s))
    ),
    followUp: "Need help with anything else?",
  },

  health_mental: {
    messages: [
      "Taking care of your mental health is so important. These organizations offer LGBTQ+ affirming counseling:",
    ],
    resources: () => nycResources.filter(r =>
      r.category === 'health' && r.services?.some(s => /Mental Health|Behavioral/i.test(s))
    ),
    followUp: "Would you also like to create a personal safety plan? It's a helpful tool you can keep on your device.",
    followUpOptions: [
      { label: "Yes, take me to the Safety Plan", value: 'nav_safety', icon: '🛡️' },
      { label: "No thanks, help with something else", value: 'restart', icon: '🔄' },
    ],
  },

  health_primary: {
    messages: [
      "These community health centers provide LGBTQ+ affirming primary care in NYC:",
    ],
    resources: () => nycResources.filter(r =>
      r.category === 'health' && r.services?.some(s => /Primary Care/i.test(s))
    ),
    followUp: "Need help with anything else?",
  },

  health_general: {
    messages: [
      "No worries — these health centers serve the LGBTQ+ community and can help you figure out what you need:",
    ],
    resources: () => nycResources.filter(r => r.category === 'health'),
    followUp: "Need help with anything else?",
  },

  // ── Housing branch ─────────────────────────────────────
  housing: {
    messages: [
      "Let's get you connected to safe housing. What's your situation?",
    ],
    options: [
      { label: "I need emergency shelter tonight", value: 'housing_emergency', icon: '🆘' },
      { label: "I'm a young person (under 30) needing housing", value: 'housing_youth', icon: '🏠' },
      { label: "I need longer-term housing help", value: 'housing_longterm', icon: '🔑' },
    ],
  },

  housing_emergency: {
    messages: [
      "If you need a safe place tonight, these organizations can help right now:",
    ],
    resources: () => nycResources.filter(r =>
      r.category === 'housing' && r.services?.some(s => /Emergency|Shelter/i.test(s))
    ),
    extraMessage: "You can also call 311 for NYC's emergency shelter intake system.",
    followUp: "Need help with anything else?",
  },

  housing_youth: {
    messages: [
      "The Ali Forney Center is the largest organization dedicated to LGBTQ+ homeless youth in the US:",
    ],
    resources: () => nycResources.filter(r =>
      r.id === 'ali-forney' || r.id === 'trinity-place'
    ),
    followUp: "Need help with anything else?",
  },

  housing_longterm: {
    messages: [
      "These organizations offer transitional and longer-term housing support:",
    ],
    resources: () => nycResources.filter(r =>
      r.category === 'housing' || (r.category === 'health' && r.services?.some(s => /Housing/i.test(s)))
    ),
    followUp: "Need help with anything else?",
  },

  // ── Legal branch ───────────────────────────────────────
  legal: {
    messages: [
      "What kind of legal help do you need?",
    ],
    options: [
      { label: "Name or gender marker change", value: 'legal_name', icon: '📝' },
      { label: "Discrimination complaint", value: 'legal_discrimination', icon: '⚖️' },
      { label: "Immigration or asylum", value: 'legal_immigration', icon: '🌍' },
      { label: "Other legal issue", value: 'legal_general', icon: '📋' },
    ],
  },

  legal_name: {
    messages: [
      "Great news — NYS allows name changes via court petition, and NYC birth certificates now offer M, F, or X gender markers without medical documentation.",
      "These organizations provide free help with the process:",
    ],
    resources: () => nycResources.filter(r =>
      r.category === 'legal' && r.services?.some(s => /Name|Gender/i.test(s))
    ),
    followUp: "Need help with anything else?",
  },

  legal_discrimination: {
    messages: [
      "You have strong protections under NYC and NYS law. Here's where to get help:",
    ],
    resources: () => nycResources.filter(r =>
      r.category === 'legal' && r.services?.some(s => /Discrimination|Litigation/i.test(s))
    ),
    followUpOptions: [
      { label: "Show me my rights", value: 'nav_rights', icon: '📋' },
      { label: "Help with something else", value: 'restart', icon: '🔄' },
    ],
  },

  legal_immigration: {
    messages: [
      "Persecution based on sexual orientation or gender identity is recognized as grounds for asylum in the US.",
      "These organizations have experience with LGBTQ+ immigration cases:",
    ],
    resources: () => nycResources.filter(r =>
      r.category === 'legal' && r.services?.some(s => /Immigration/i.test(s))
    ),
    followUp: "Need help with anything else?",
  },

  legal_general: {
    messages: [
      "Here are organizations offering free legal help to the LGBTQ+ community:",
    ],
    resources: () => nycResources.filter(r => r.category === 'legal'),
    followUp: "Need help with anything else?",
  },

  // ── Food branch ────────────────────────────────────────
  food: {
    messages: [
      "Here are places where you can get food and basic necessities in NYC:",
    ],
    resources: () => nycResources.filter(r => r.category === 'food'),
    extraMessage: "You can also call 311 or text FOOD to 304-304 for nearby food pantries.",
    followUp: "Need help with anything else?",
  },

  // ── Community branch ───────────────────────────────────
  community: {
    messages: [
      "Finding your community makes all the difference. Which borough are you in?",
    ],
    options: [
      { label: "Manhattan", value: 'community_manhattan', icon: '🏙️' },
      { label: "Brooklyn", value: 'community_brooklyn', icon: '🌉' },
      { label: "Queens", value: 'community_queens', icon: '👑' },
      { label: "Bronx", value: 'community_bronx', icon: '🌳' },
      { label: "Staten Island", value: 'community_si', icon: '🚢' },
      { label: "Show me all", value: 'community_all', icon: '🗽' },
    ],
  },

  community_manhattan: {
    messages: ["Here are LGBTQIA+ community spaces in Manhattan:"],
    resources: () => nycResources.filter(r =>
      (r.category === 'community' || r.category === 'youth') && r.borough === 'Manhattan'
    ),
    followUp: "Need help with anything else?",
  },

  community_brooklyn: {
    messages: ["Here are LGBTQIA+ community spaces in Brooklyn:"],
    resources: () => nycResources.filter(r =>
      (r.category === 'community' || r.category === 'youth') && r.borough === 'Brooklyn'
    ),
    followUp: "Need help with anything else?",
  },

  community_queens: {
    messages: ["Here are LGBTQIA+ community spaces in Queens:"],
    resources: () => nycResources.filter(r =>
      (r.category === 'community' || r.category === 'youth') && r.borough === 'Queens'
    ),
    followUp: "Need help with anything else?",
  },

  community_bronx: {
    messages: ["Here are LGBTQIA+ community spaces in the Bronx:"],
    resources: () => nycResources.filter(r =>
      (r.category === 'community' || r.category === 'youth') && r.borough === 'Bronx'
    ),
    followUp: "Need help with anything else?",
  },

  community_si: {
    messages: ["Here are LGBTQIA+ community spaces on Staten Island:"],
    resources: () => nycResources.filter(r =>
      (r.category === 'community' || r.category === 'youth') && r.borough === 'Staten Island'
    ),
    followUp: "Need help with anything else?",
  },

  community_all: {
    messages: ["Here are all the LGBTQIA+ community centers across NYC:"],
    resources: () => nycResources.filter(r =>
      r.category === 'community' || r.category === 'youth'
    ),
    followUp: "Need help with anything else?",
  },

  // ── Youth branch ───────────────────────────────────────
  youth: {
    messages: [
      "These organizations are specifically for LGBTQ+ young people in NYC — safe spaces with programs, support, and community:",
    ],
    resources: () => nycResources.filter(r => r.category === 'youth'),
    extraMessage: "If you're in crisis, the Trevor Project (1-866-488-7386) is available 24/7 for LGBTQ+ youth.",
    followUp: "Need help with anything else?",
  },

  // ── Rights branch ──────────────────────────────────────
  rights: {
    messages: [
      "New York has some of the strongest LGBTQIA+ protections in the country. I can show you info here or take you to our full Know Your Rights page.",
    ],
    options: [
      { label: "Take me to Know Your Rights", value: 'nav_rights', icon: '📋' },
      { label: "Quick summary here", value: 'rights_summary', icon: '💬' },
    ],
  },

  rights_summary: {
    messages: [
      "Here's a quick overview of your protections in NYC/NYS:",
      "• **Employment** — Can't be fired or discriminated against based on orientation or gender identity\n• **Housing** — Illegal to deny housing based on LGBTQ+ status\n• **Healthcare** — Providers can't deny care; Medicaid covers gender-affirming care\n• **Name changes** — Court petition for name; self-attestation for gender marker at DMV\n• **Schools** — Students protected from bullying; can use facilities matching identity\n• **Police** — NYPD must use preferred name/pronouns",
    ],
    followUpOptions: [
      { label: "See full details", value: 'nav_rights', icon: '📋' },
      { label: "I'm facing discrimination — get legal help", value: 'legal_discrimination', icon: '⚖️' },
      { label: "Help with something else", value: 'restart', icon: '🔄' },
    ],
  },

  // ── Restart ────────────────────────────────────────────
  restart: {
    messages: [
      "Of course! What else can I help you with?",
    ],
    options: [
      { label: "I'm in crisis or danger", value: 'crisis', icon: '🚨' },
      { label: "Health or medical care", value: 'health', icon: '🩺' },
      { label: "Housing or shelter", value: 'housing', icon: '🏠' },
      { label: "Legal help", value: 'legal', icon: '⚖️' },
      { label: "Food or basic needs", value: 'food', icon: '🍎' },
      { label: "Community", value: 'community', icon: '💜' },
      { label: "Youth services", value: 'youth', icon: '✨' },
      { label: "Know my rights", value: 'rights', icon: '📋' },
    ],
  },
};

// Default follow-up options when followUp is a string (not custom options)
const DEFAULT_FOLLOWUP_OPTIONS = [
  { label: "Yes, help with something else", value: 'restart', icon: '🔄' },
  { label: "No, I'm all set — thank you", value: 'end', icon: '💜' },
];

const END_MESSAGES = [
  "You're welcome. Remember — you matter, you belong, and support is always here when you need it. 💜",
  "Take care of yourself. You can come back anytime.",
];

/**
 * Get the next set of bot messages and options for a given node.
 * Returns: { messages: string[], resources?: object[], options?: object[], isEnd?: boolean }
 */
export function getTriageResponse(nodeId) {
  if (nodeId === 'end') {
    return {
      messages: END_MESSAGES,
      isEnd: true,
    };
  }

  // Navigation nodes — these signal the UI to navigate
  if (nodeId.startsWith('nav_')) {
    return {
      messages: ["Taking you there now..."],
      navigate: nodeId === 'nav_rights' ? '/rights' : '/safety-plan',
    };
  }

  const node = NODES[nodeId];
  if (!node) {
    return {
      messages: ["I'm not sure how to help with that. Let me start over."],
      options: NODES.start.options,
    };
  }

  const result = {
    messages: [...node.messages],
  };

  // Add resources if the node resolves to them
  if (node.resources) {
    result.resources = node.resources();
  }

  // Add extra message after resources
  if (node.extraMessage) {
    result.extraAfter = node.extraMessage;
  }

  // Add follow-up options
  if (node.followUpOptions) {
    result.followUpMessage = node.followUp || "What would you like to do?";
    result.options = node.followUpOptions;
  } else if (node.followUp) {
    result.followUpMessage = node.followUp;
    result.options = DEFAULT_FOLLOWUP_OPTIONS;
  } else if (node.options) {
    result.options = node.options;
  }

  return result;
}

export function getStartNode() {
  return getTriageResponse('start');
}
