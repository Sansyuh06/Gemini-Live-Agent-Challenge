/**
 * Safety Screening — Crisis Detection & Safe Messaging
 * Screens ALL user input in Sanctuary mode BEFORE Gemini processes it.
 */

const CRISIS_PHRASES = [
  'want to die', 'wanna die', 'kill myself', 'hurt myself',
  'end it all', 'end it', "can't go on", 'cannot go on',
  'goodbye forever', 'no reason to live', 'better off dead',
  'not worth living', 'take my life', 'suicidal', 'self harm',
  'cut myself', 'nobody would miss me', 'disappear forever',
];

const CRISIS_RESPONSE = {
  crisis: true,
  crisisResponse: `I hear you, and I want you to know you matter deeply. Please reach out to a crisis line right now:

🇺🇸 Call or text 988 (Suicide & Crisis Lifeline)
🇬🇧 Call 116 123 (Samaritans)
🇮🇳 Call 9152987821 (iCall)
🌍 Visit findahelpline.com for your country

You are not alone. I will be here when you come back. 💙`,
};

/**
 * Screen user input for crisis indicators.
 * This runs BEFORE Gemini generates a response.
 */
async function screenInput(text, userId) {
  if (!text) return { crisis: false };

  const lowerText = text.toLowerCase().trim();

  // Direct phrase matching
  for (const phrase of CRISIS_PHRASES) {
    if (lowerText.includes(phrase)) {
      console.warn(`[SAFETY] Crisis flag triggered for user ${userId || 'anonymous'}: matched "${phrase}"`);
      return CRISIS_RESPONSE;
    }
  }

  return { crisis: false };
}

/**
 * Screen Sage's output for safe messaging compliance.
 * Ensures the AI response doesn't reinforce hopelessness or include harmful content.
 */
async function screenOutput(text) {
  if (!text) return { safe: true, text };

  const UNSAFE_PATTERNS = [
    /there is no hope/i,
    /you should give up/i,
    /nobody cares/i,
    /it('s| is) hopeless/i,
    /you('re| are) right to feel that way about (dying|death|ending)/i,
    /method(s)? (of|for|to) (suicide|self.harm|killing)/i,
  ];

  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(text)) {
      console.warn(`[SAFETY] Output flagged for unsafe pattern: ${pattern}`);
      return {
        safe: false,
        text: "I'm here with you. Your story matters, and so do you. Would you like to continue, or would you prefer to take a gentle pause?",
        reason: `Matched unsafe pattern: ${pattern}`,
      };
    }
  }

  return { safe: true, text };
}

module.exports = { screenInput, screenOutput, CRISIS_PHRASES, CRISIS_RESPONSE };
