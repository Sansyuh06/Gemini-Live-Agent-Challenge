/**
 * Gemini Routes — Cloud Story generation for Wonder (Luna) and Sanctuary (Sage)
 * Built for the Gemini Live Agent Challenge (Creative Storyteller Category)
 * Includes AUTOMATIC FALLBACK to local Ollama if Gemini rate limits (429) occur.
 */
const express = require('express');
const router = require('express').Router();
const { GoogleGenerativeAI, Schema, Type } = require('@google/generative-ai');
const { buildWonderSystemPrompt, buildWonderUserPrompt } = require('../utils/promptBuilder');
const { buildSanctuarySystemPrompt, buildSanctuaryUserPrompt, buildReflectionPrompt } = require('../utils/sanctuaryPrompt');
const { screenOutput } = require('../utils/safetyScreen');

// Gemini Config
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAwZaGEde2ly7basNHKBhCySXQ9U_3zh9k';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Ollama Fallback Config
const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

/**
 * Helper to call local Ollama as a fallback
 */
async function generateFromOllama(systemPrompt, userPrompt, temperature = 0.7) {
  console.log('🔄 Gemini Rate Limited. Falling back to local Ollama...');
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
      options: { temperature: temperature, num_predict: 1024 }
    })
  });

  if (!response.ok) throw new Error(`Ollama Fallback Failed: ${response.status}`);
  const data = await response.json();
  return JSON.parse(data.message.content.replace(/```json\n?|\n?```/g, '').trim());
}

// ========== WONDER MODE (Luna) ==========
router.post('/wonder', async (req, res) => {
  const { userMessage, childProfile, turnNumber, previousNarration } = req.body;
  const systemPrompt = buildWonderSystemPrompt(childProfile);
  const userPrompt = buildWonderUserPrompt(userMessage, turnNumber, previousNarration);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    });

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'I understand. I am Luna, ready to co-create stories!' }] }
      ]
    });

    const result = await chat.sendMessage(userPrompt);
    const parsed = JSON.parse(result.response.text());
    res.json({ success: true, data: parsed, provider: 'gemini' });
  } catch (error) {
    console.error('[Gemini Wonder Error]', error.message);
    
    // Automatic Fallback on 429 or other errors
    try {
      const fallbackData = await generateFromOllama(
        systemPrompt + "\n\nCRITICAL: Return ONLY valid JSON.", 
        userPrompt, 
        0.7
      );
      res.json({ success: true, data: fallbackData, provider: 'ollama_fallback' });
    } catch (fallbackError) {
      res.status(500).json({ success: false, error: 'Both Gemini and local fallback failed.' });
    }
  }
});

// ========== SANCTUARY MODE (Sage) ==========
router.post('/sanctuary', async (req, res) => {
  const { userMessage, profile, turnNumber, moodLevel, previousNarration } = req.body;
  const systemPrompt = buildSanctuarySystemPrompt(profile);
  const userPrompt = buildSanctuaryUserPrompt(userMessage, turnNumber, moodLevel, previousNarration);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 1200,
        responseMimeType: 'application/json',
      },
    });

    const chat = model.startChat({ 
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] }, 
        { role: 'model', parts: [{ text: 'I am Sage. I am here to listen.' }] }
      ] 
    });
    const result = await chat.sendMessage(userPrompt);
    const parsed = JSON.parse(result.response.text());

    // Screen Sage's output
    if (parsed.sageDialogue) {
      const screened = await screenOutput(parsed.sageDialogue);
      if (!screened.safe) parsed.sageDialogue = screened.text;
    }

    res.json({ success: true, data: parsed, provider: 'gemini' });
  } catch (error) {
    console.error('[Gemini Sanctuary Error]', error.message);
    
    try {
      const fallbackData = await generateFromOllama(
        systemPrompt + "\n\nCRITICAL: Return ONLY valid JSON.", 
        userPrompt, 
        0.6
      );
      if (fallbackData.sageDialogue) {
        const screened = await screenOutput(fallbackData.sageDialogue);
        if (!screened.safe) fallbackData.sageDialogue = screened.text;
      }
      res.json({ success: true, data: fallbackData, provider: 'ollama_fallback' });
    } catch (fallbackError) {
      res.status(500).json({ success: false, error: 'Sanctuary generation failed across all providers.' });
    }
  }
});

// ========== REFLECTION GENERATION ==========
router.post('/reflection', async (req, res) => {
  const { sessionSummary } = req.body;
  const prompt = buildReflectionPrompt(sessionSummary);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { temperature: 0.6, maxOutputTokens: 200 },
    });
    const result = await model.generateContent(prompt);
    res.json({ success: true, reflection: result.response.text().trim(), provider: 'gemini' });
  } catch (error) {
    console.error('[Gemini Reflection Error]', error.message);
    try {
      const resp = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages: [{ role: 'user', content: prompt + "\n\nReturn ONLY the reflection." }],
          stream: false
        })
      });
      const data = await resp.json();
      res.json({ success: true, reflection: data.message.content.trim(), provider: 'ollama_fallback' });
    } catch {
      res.status(500).json({ success: false, error: 'Reflection failed.' });
    }
  }
});

module.exports = router;
