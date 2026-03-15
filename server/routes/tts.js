/**
 * TTS Routes — Using VITA (Kokoro-82M + XTTS-v2) for voice synthesis
 * https://github.com/moulish-dev/vita
 *
 * Luna (Wonder): Kokoro model, bright/warm voice
 * Sage (Sanctuary): Kokoro model, calm/slow voice
 *
 * Falls back to browser SpeechSynthesis if VITA is not running.
 */
const express = require('express');
const router = express.Router();
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const VITA_DIR = process.env.VITA_DIR || path.join(__dirname, '..', '..', 'vita');
const TTS_OUTPUT_DIR = path.join(__dirname, '..', 'tts_output');

// Ensure output directory exists
if (!fs.existsSync(TTS_OUTPUT_DIR)) {
  fs.mkdirSync(TTS_OUTPUT_DIR, { recursive: true });
}

const VOICE_PROFILES = {
  luna: {
    model: 'kokoro',
    description: 'Warm, bright, playful — for children',
    extraArgs: ['--voice', 'af_heart'],
  },
  sage: {
    model: 'kokoro',
    description: 'Calm, grounded, unhurried — for adults',
    extraArgs: ['--voice', 'am_michael'],
  },
};

/**
 * Check if VITA is available
 */
router.get('/health', async (req, res) => {
  try {
    // Check if vita module can be found
    const vitaSrcExists = fs.existsSync(path.join(VITA_DIR, 'src', 'vita'));
    const vitaRootExists = fs.existsSync(path.join(VITA_DIR, 'vita'));
    res.json({ online: vitaSrcExists || vitaRootExists, vitaDir: VITA_DIR });
  } catch {
    res.json({ online: false });
  }
});

/**
 * Synthesize speech using VITA
 * Supports streaming via --stream flag for real-time playback
 */
router.post('/synthesize', async (req, res) => {
  try {
    const { text, voice = 'luna', stream = false } = req.body;
    const profile = VOICE_PROFILES[voice] || VOICE_PROFILES.luna;

    if (!text || !text.trim()) {
      return res.json({ success: false, error: 'No text provided' });
    }

    // Check if VITA directory exists
    const hasVita = fs.existsSync(path.join(VITA_DIR, 'src', 'vita')) || fs.existsSync(path.join(VITA_DIR, 'vita'));
    if (!hasVita) {
      return res.json({ success: false, fallback: true, message: 'VITA not found.', voiceConfig: profile });
    }

    const outputFile = path.join(TTS_OUTPUT_DIR, `${voice}_${Date.now()}.wav`);
    const sanitizedText = text.replace(/"/g, '\\"').replace(/\n/g, ' ').substring(0, 500);

    // Call the persistent VITA Python Server running on port 8002
    try {
      const fetchResponse = await fetch('http://127.0.0.1:8002/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sanitizedText,
          voice: voice,
          output_path: outputFile
        }),
      });

      if (!fetchResponse.ok) {
        throw new Error(`VITA Server returned ${fetchResponse.status}`);
      }

      const data = await fetchResponse.json();
      if (!data.success) {
        throw new Error(data.error || 'VITA Server generation failed');
      }

      // Read generated audio and return as base64
      if (fs.existsSync(outputFile)) {
        const audioBuffer = fs.readFileSync(outputFile);
        const base64Audio = audioBuffer.toString('base64');

        // Clean up temp file
        try { fs.unlinkSync(outputFile); } catch {}

        return res.json({
          success: true,
          audio: base64Audio,
          format: 'wav',
          voice,
          model: profile.model,
        });
      } else {
        throw new Error('Audio file was not created by VITA Server');
      }
    } catch (err) {
      console.error('[VITA API Error]', err.message);
      return res.json({
        success: false,
        fallback: true,
        text,
        voiceConfig: profile,
        message: 'VITA local server not running or failed. Fallback to browser TTS.',
      });
    }
  } catch (error) {
    console.error('[TTS Error]', error.message);
    // Always provide a fallback
    res.json({
      success: false,
      fallback: true,
      text: req.body?.text,
      voiceConfig: VOICE_PROFILES[req.body?.voice || 'luna'],
      message: `VITA error: ${error.message}. Use browser SpeechSynthesis.`,
    });
  }
});

/**
 * Stream TTS — uses VITA's --stream flag for real-time sentence-level chunks
 * Returns an event stream that the frontend can consume
 */
router.post('/stream', async (req, res) => {
  const { text, voice = 'luna' } = req.body;
  const profile = VOICE_PROFILES[voice] || VOICE_PROFILES.luna;

  const hasVita = fs.existsSync(path.join(VITA_DIR, 'src', 'vita')) || fs.existsSync(path.join(VITA_DIR, 'vita'));
  if (!hasVita) {
    return res.json({ success: false, fallback: true, message: 'VITA not installed' });
  }

  const sanitizedText = text.replace(/"/g, '\\"').replace(/\n/g, ' ').substring(0, 500);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let pythonPath = 'python';
  if (fs.existsSync(path.join(VITA_DIR, '.venv', 'Scripts', 'python.exe'))) {
    pythonPath = path.join(VITA_DIR, '.venv', 'Scripts', 'python.exe');
  }

  const child = spawn(pythonPath, [
    '-m', 'vita',
    '--text', sanitizedText,
    '--model', profile.model,
    '--stream',
    ...profile.extraArgs,
  ], { cwd: VITA_DIR, env: { ...process.env, PYTHONPATH: path.join(VITA_DIR, 'src') } });

  child.stdout.on('data', (data) => {
    res.write(`data: ${JSON.stringify({ chunk: data.toString() })}\n\n`);
  });

  child.stderr.on('data', (data) => {
    console.error(`[VITA Stream] ${data}`);
  });

  child.on('close', (code) => {
    res.write(`data: ${JSON.stringify({ done: true, code })}\n\n`);
    res.end();
  });

  req.on('close', () => {
    child.kill();
  });
});

router.get('/voices', (req, res) => {
  res.json(VOICE_PROFILES);
});

module.exports = router;
