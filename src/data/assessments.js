/**
 * PHQ-9 and GAD-7 assessment data, scoring, and interpretation.
 * Adapted for a warm, supportive conversational flow.
 */

// ── Response options (shared scale) ─────────────────────────────────
export const frequencyOptions = [
  { value: 0, label: 'Not at all', description: 'This hasn\'t been an issue' },
  { value: 1, label: 'Several days', description: 'A few days here and there' },
  { value: 2, label: 'More than half the days', description: 'Most days, actually' },
  { value: 3, label: 'Nearly every day', description: 'Almost constantly' },
];

// ── PHQ-9 Questions ─────────────────────────────────────────────────
export const phq9Questions = [
  {
    id: 'phq1',
    clinical: 'Little interest or pleasure in doing things',
    conversational: 'Over the last two weeks, have you noticed a dip in interest or pleasure in things you usually enjoy?',
    gentle: 'Sometimes the things we love just stop feeling exciting. That\'s worth paying attention to.',
  },
  {
    id: 'phq2',
    clinical: 'Feeling down, depressed, or hopeless',
    conversational: 'Have you been feeling down, low, or hopeless lately?',
    gentle: 'It\'s okay to name that feeling. There\'s no judgment here.',
  },
  {
    id: 'phq3',
    clinical: 'Trouble falling asleep, staying asleep, or sleeping too much',
    conversational: 'How has your sleep been? Any trouble falling asleep, staying asleep, or sleeping more than usual?',
    gentle: 'Sleep is so connected to how we feel. Whatever your answer, it matters.',
  },
  {
    id: 'phq4',
    clinical: 'Feeling tired or having little energy',
    conversational: 'Have you been feeling tired or low on energy, even when you\'ve rested?',
    gentle: 'Fatigue can be really draining — emotionally and physically.',
  },
  {
    id: 'phq5',
    clinical: 'Poor appetite or overeating',
    conversational: 'How about your appetite? Has it changed — eating less than usual, or more?',
    gentle: 'Changes in appetite are your body\'s way of telling you something.',
  },
  {
    id: 'phq6',
    clinical: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
    conversational: 'Have you been feeling bad about yourself — like you\'ve let yourself or others down?',
    gentle: 'Those inner critic voices can be really loud. You\'re not defined by them.',
  },
  {
    id: 'phq7',
    clinical: 'Trouble concentrating on things, such as reading or watching television',
    conversational: 'Have you had trouble concentrating — like when reading, watching something, or at work?',
    gentle: 'A foggy mind is more common than people think, and it\'s not your fault.',
  },
  {
    id: 'phq8',
    clinical: 'Moving or speaking so slowly that other people could have noticed, or being fidgety or restless',
    conversational: 'Have you noticed yourself moving or speaking more slowly than usual — or the opposite, feeling restless and fidgety?',
    gentle: 'Our bodies often express what our minds are processing.',
  },
  {
    id: 'phq9',
    clinical: 'Thoughts that you would be better off dead, or of hurting yourself in some way',
    conversational: 'This one is important, and I ask with care: have you had any thoughts of hurting yourself, or feeling like things would be better if you weren\'t here?',
    gentle: 'Whatever your answer, I\'m glad you\'re here right now. There\'s no wrong answer, and help is available.',
    isSensitive: true,
  },
];

// ── GAD-7 Questions ─────────────────────────────────────────────────
export const gad7Questions = [
  {
    id: 'gad1',
    clinical: 'Feeling nervous, anxious, or on edge',
    conversational: 'Over the last two weeks, how often have you felt nervous, anxious, or on edge?',
    gentle: 'Anxiety can show up in so many ways. Let\'s just notice it together.',
  },
  {
    id: 'gad2',
    clinical: 'Not being able to stop or control worrying',
    conversational: 'Have you had trouble stopping or controlling your worrying?',
    gentle: 'When worry has a mind of its own, it can feel exhausting.',
  },
  {
    id: 'gad3',
    clinical: 'Worrying too much about different things',
    conversational: 'Have you been worrying a lot — about different things, maybe all at once?',
    gentle: 'When everything feels heavy, it makes sense that your mind is busy.',
  },
  {
    id: 'gad4',
    clinical: 'Trouble relaxing',
    conversational: 'Have you found it hard to relax, even when you want to?',
    gentle: 'Your body might be holding onto tension you don\'t even realize.',
  },
  {
    id: 'gad5',
    clinical: 'Being so restless that it is hard to sit still',
    conversational: 'Have you been so restless that it\'s hard to sit still?',
    gentle: 'That restless energy is your nervous system talking.',
  },
  {
    id: 'gad6',
    clinical: 'Becoming easily annoyed or irritable',
    conversational: 'Have you been more easily annoyed or irritable than usual?',
    gentle: 'Irritability is often anxiety wearing a different mask.',
  },
  {
    id: 'gad7',
    clinical: 'Feeling afraid, as if something awful might happen',
    conversational: 'Have you felt afraid — like something awful might happen?',
    gentle: 'That sense of dread is real, and naming it takes courage.',
  },
];

// ── Difficulty question (shared) ────────────────────────────────────
export const difficultyQuestion = {
  text: 'If any of these things have been present, how much have they made it harder to do your work, take care of things at home, or get along with people?',
  options: [
    { value: 'not_difficult', label: 'Not difficult at all' },
    { value: 'somewhat', label: 'Somewhat difficult' },
    { value: 'very', label: 'Very difficult' },
    { value: 'extremely', label: 'Extremely difficult' },
  ],
};

// ── Scoring functions ───────────────────────────────────────────────

export function scorePHQ9(answers) {
  const total = phq9Questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  let severity, color, interpretation, recommendation;

  if (total <= 4) {
    severity = 'Minimal';
    color = 'emerald';
    interpretation = 'Your responses suggest minimal symptoms of depression. That\'s a really positive sign.';
    recommendation = 'No specific intervention needed right now, but it\'s always good to keep checking in with yourself.';
  } else if (total <= 9) {
    severity = 'Mild';
    color = 'amber';
    interpretation = 'Your responses suggest mild symptoms. You might be going through a tough patch, and that\'s completely valid.';
    recommendation = 'Some self-care strategies — like regular movement, good sleep habits, and staying connected — can make a real difference. If things feel heavier, talking to someone can help.';
  } else if (total <= 14) {
    severity = 'Moderate';
    color = 'orange';
    interpretation = 'Your responses suggest moderate symptoms. What you\'re feeling is significant, and you deserve support.';
    recommendation = 'Connecting with a therapist or counselor is highly recommended. The resources below can help you find LGBTQ+ affirming care in NYC.';
  } else {
    severity = 'Severe';
    color = 'red';
    interpretation = 'Your responses suggest you may be experiencing significant symptoms. I want you to know — this is not your fault, and help is available.';
    recommendation = 'Please consider reaching out to a mental health professional. If you\'re in crisis, the numbers below are available 24/7. You don\'t have to go through this alone.';
  }

  // Check for suicidal ideation (question 9)
  const q9Score = answers['phq9'] ?? 0;
  const hasSuicidalIdeation = q9Score >= 1;

  return { total, maxScore: 27, severity, color, interpretation, recommendation, hasSuicidalIdeation };
}

export function scoreGAD7(answers) {
  const total = gad7Questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  let severity, color, interpretation, recommendation;

  if (total <= 4) {
    severity = 'Minimal';
    color = 'emerald';
    interpretation = 'Your responses suggest minimal anxiety. Your coping strategies seem to be working well.';
    recommendation = 'Keep doing what you\'re doing. Mindfulness, breathing exercises, and staying active can help maintain this.';
  } else if (total <= 9) {
    severity = 'Mild';
    color = 'amber';
    interpretation = 'Your responses suggest mild anxiety. Some worry is normal, but it\'s good you\'re paying attention to it.';
    recommendation = 'Monitoring and self-care can help — things like exercise, sleep hygiene, and breathing exercises. If scores are on the higher end (8-9), regular follow-up is a good idea.';
  } else if (total <= 14) {
    severity = 'Moderate';
    color = 'orange';
    interpretation = 'Your responses suggest moderate anxiety. This level of anxiety can really affect your day-to-day life, and you deserve support.';
    recommendation = 'Therapy is highly recommended, and some people also benefit from medication. The LGBTQ+ affirming providers below are a great starting point.';
  } else {
    severity = 'Severe';
    color = 'red';
    interpretation = 'Your responses suggest significant anxiety symptoms. Living with this level of anxiety is incredibly hard, and reaching out was brave.';
    recommendation = 'A combination of therapy and possibly medication is strongly recommended. Please reach out to one of the resources below — they understand what you\'re going through.';
  }

  return { total, maxScore: 21, severity, color, interpretation, recommendation };
}

// ── Persona transitions (warm messages between sections) ────────────
export const personaTransitions = {
  welcome: [
    "Hi there. I'm Sage, and I'm here to walk with you through a quick wellness check-in.",
    "This isn't a test — there are no right or wrong answers. It's just a way to understand how you've been feeling so we can point you toward the right support.",
    "Everything stays private on your device. Nothing is stored, shared, or sent anywhere.",
    "Ready when you are. Take your time.",
  ],
  startPHQ9: [
    "Let's start by exploring how your mood has been.",
    "Think about the last two weeks — I'll ask you some questions, and you just pick what feels closest to your experience.",
  ],
  phq9ToGad7: [
    "Thank you for sharing that. You're doing great.",
    "Now let's check in on anxiety — it often shows up alongside mood changes.",
    "Same idea: think about the last two weeks.",
  ],
  beforeResults: [
    "You've finished the check-in. Thank you for trusting this process.",
    "Let me put your responses together and share what I see.",
  ],
  crisisDetected: [
    "I noticed you mentioned having some difficult thoughts. I want you to know that you're not alone, and there are people who want to help — right now.",
    "Before we look at the full results, I want to make sure you have these numbers:",
  ],
};
