/**
 * Ollama Routes — 100% Offline Story generation for Wonder (Luna) and Sanctuary (Sage)
 */
const express = require('express');
const router = express.Router();
const { buildWonderSystemPrompt, buildWonderUserPrompt } = require('../utils/promptBuilder');
const { buildSanctuarySystemPrompt, buildSanctuaryUserPrompt, buildReflectionPrompt } = require('../utils/sanctuaryPrompt');
const { screenOutput } = require('../utils/safetyScreen');

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

/**
 * Helper function to call Ollama
 */
async function generateFromOllama(systemPrompt, userPrompt, temperature) {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      format: 'json',
      stream: false,
      options: {
        temperature: temperature,
        num_predict: 1024
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }

  const data = await response.json();
  return data.message.content;
}

// ========== WONDER MODE (Luna) ==========
router.post('/wonder', async (req, res) => {
  try {
    const { userMessage, childProfile, turnNumber, previousNarration } = req.body;

    const systemPrompt = buildWonderSystemPrompt(childProfile) + "\n\nCRITICAL: You MUST ONLY return a valid, parsable JSON object. Do not include any markdown fences or conversational text outside the JSON.";
    const userPrompt = buildWonderUserPrompt(userMessage, turnNumber, previousNarration);

    const text = await generateFromOllama(systemPrompt, userPrompt, 0.7);

    let parsed;
    try {
      parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
    } catch {
      console.warn('[Ollama Parse Error] Raw text was:', text);
      parsed = { narration: text, lunaDialogue: "Wow, let's see what happens next!", imagePrompt: 'beautiful scenery', educationalMoment: null, emotionalTone: 'joyful' };
    }

    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error('[Ollama Wonder Error]', error.message);
    res.status(500).json({ success: false, error: 'Story generation failed. Luna is taking a quick nap! 💤', details: error.message });
  }
});

// ========== SANCTUARY MODE (Sage) ==========
router.post('/sanctuary', async (req, res) => {
  try {
    const { userMessage, profile, turnNumber, moodLevel, previousNarration } = req.body;

    const systemPrompt = buildSanctuarySystemPrompt(profile) + "\n\nCRITICAL: You MUST ONLY return a valid, parsable JSON object. Do not include any markdown fences or conversational text outside the JSON.";
    const userPrompt = buildSanctuaryUserPrompt(userMessage, turnNumber, moodLevel, previousNarration);
    const text = await generateFromOllama(systemPrompt, userPrompt, 0.6);

    let parsed;
    try {
      parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
    } catch {
      console.warn('[Ollama Parse Error] Raw text was:', text);
      parsed = { sageDialogue: text, narration: '', imagePrompt: 'calm landscape', emotionalTheme: 'default', narrativeStage: 'naming' };
    }

    // Screen Sage's output for safe messaging
    if (parsed.sageDialogue) {
      const screened = await screenOutput(parsed.sageDialogue);
      if (!screened.safe) {
        parsed.sageDialogue = screened.text;
        parsed._safetyOverride = true;
      }
    }

    if (parsed.safetyFlag) {
      return res.json({ safetyFlag: true, safetyResponse: parsed.safetyResponse, type: 'crisis' });
    }

    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error('[Ollama Sanctuary Error]', error.message);
    res.status(500).json({ success: false, error: 'Sage needs a moment. Please try again.' });
  }
});

// ========== REFLECTION GENERATION ==========
router.post('/reflection', async (req, res) => {
  try {
    const { sessionSummary } = req.body;
    const prompt = buildReflectionPrompt(sessionSummary) + "\n\nCRITICAL: Return ONLY the reflection text, nothing else.";
    
    const text = await generateFromOllama("You are Sage, a reflective guide.", prompt, 0.6);

    res.json({ success: true, reflection: text.trim() });
  } catch (error) {
    console.error('[Ollama Reflection Error]', error.message);
    res.status(500).json({ success: false, error: 'Could not generate reflection.' });
  }
});

module.exports = router;
