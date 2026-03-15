/**
 * Gemini Routes — Cloud Story generation for Wonder (Luna) and Sanctuary (Sage)
 * Built for the Gemini Live Agent Challenge (Creative Storyteller Category)
 * Utilizes native interleaved JSON output.
 */
const express = require('express');
const router = require('express').Router();
const { GoogleGenerativeAI, Schema, Type } = require('@google/generative-ai');
const { buildWonderSystemPrompt, buildWonderUserPrompt } = require('../utils/promptBuilder');
const { buildSanctuarySystemPrompt, buildSanctuaryUserPrompt, buildReflectionPrompt } = require('../utils/sanctuaryPrompt');
const { screenOutput } = require('../utils/safetyScreen');

// Initialize Gemini with the provided API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAwZaGEde2ly7basNHKBhCySXQ9U_3zh9k';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ========== WONDER MODE (Luna) ==========
router.post('/wonder', async (req, res) => {
  try {
    const { userMessage, childProfile, turnNumber, previousNarration } = req.body;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    });

    const systemPrompt = buildWonderSystemPrompt(childProfile);
    const userPrompt = buildWonderUserPrompt(userMessage, turnNumber, previousNarration);

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'I understand. I am Luna, ready to co-create stories!' }] }
      ]
    });

    const result = await chat.sendMessage(userPrompt);
    const text = result.response.text();

    console.log('[Gemini Wonder Response length]', text.length);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.warn('[Gemini Parse Error] Raw text was:', text);
      parsed = { narration: text, lunaDialogue: "Wow, let's see what happens next!", imagePrompt: '', educationalMoment: null, emotionalTone: 'joyful' };
    }

    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error('[Gemini Wonder Error Full]', error);
    res.status(500).json({ success: false, error: 'Story generation failed. Luna is taking a quick nap! 💤', details: error.message });
  }
});

// ========== SANCTUARY MODE (Sage) ==========
router.post('/sanctuary', async (req, res) => {
  try {
    const { userMessage, profile, turnNumber, moodLevel, previousNarration } = req.body;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 1200,
        responseMimeType: 'application/json',
      },
    });

    const systemPrompt = buildSanctuarySystemPrompt(profile);
    const userPrompt = buildSanctuaryUserPrompt(userMessage, turnNumber, moodLevel, previousNarration);

    const chat = model.startChat({ history: [{ role: 'user', parts: [{ text: systemPrompt }] }, { role: 'model', parts: [{ text: 'I am Sage. I am here to listen and facilitate. Ready when you are.' }] }] });
    const result = await chat.sendMessage(userPrompt);
    const text = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { sageDialogue: text, narration: '', imagePrompt: '', emotionalTheme: 'default', narrativeStage: 'naming' };
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
    console.error('[Gemini Sanctuary Error]', error.message);
    res.status(500).json({ success: false, error: 'Sage needs a moment. Please try again.' });
  }
});

// ========== REFLECTION GENERATION ==========
router.post('/reflection', async (req, res) => {
  try {
    const { sessionSummary } = req.body;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { temperature: 0.6, maxOutputTokens: 200 },
    });

    const prompt = buildReflectionPrompt(sessionSummary);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ success: true, reflection: text.trim() });
  } catch (error) {
    console.error('[Gemini Reflection Error]', error.message);
    res.status(500).json({ success: false, error: 'Could not generate reflection.' });
  }
});

module.exports = router;
