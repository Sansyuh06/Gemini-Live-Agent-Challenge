/**
 * Safety Routes — Crisis response handling for Sanctuary mode
 */
const express = require('express');
const router = express.Router();

// This route handles explicit safety-related requests
// The main crisis detection happens in the middleware (index.js)

router.post('/check', async (req, res) => {
  const { screenInput } = require('../utils/safetyScreen');
  const { text, userId } = req.body;

  const result = await screenInput(text, userId);
  res.json(result);
});

// Log a safety event (called from frontend when crisis resources are displayed)
router.post('/log', async (req, res) => {
  const { userId, flagReason, timestamp } = req.body;
  // In production, this would log to Supabase safety_logs table
  console.warn(`[SAFETY LOG] User: ${userId || 'anonymous'}, Reason: ${flagReason}, Time: ${timestamp}`);
  res.json({ logged: true });
});

module.exports = router;
