/**
 * Image Generation Routes — Direct local generation via Python subprocess
 *
 * Uses SDXL + Lightning LoRA (4 steps) for fast image generation.
 * No external server (Fooocus) needed — runs as a persistent child process.
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const { spawn } = require('child_process');
const { getSanctuaryStyles } = require('../utils/sanctuaryPrompt');

// ─── Configuration ───────────────────────────────────────────────────
const PYTHON_PATH = process.env.IMAGEGEN_PYTHON || path.join(__dirname, '..', 'imagegen_venv', 'Scripts', 'python.exe');
const SCRIPT_PATH = path.join(__dirname, '..', 'generate_image.py');
const GENERATED_DIR = path.join(__dirname, '..', 'generated_images');

const DEFAULT_WIDTH = 704;
const DEFAULT_HEIGHT = 1344;

const WONDER_NEGATIVE = 'nsfw, violent, scary, blood, weapon, gore, nude, adult, dark, horror, realistic photo, ugly, deformed';
const SANCTUARY_NEGATIVE = 'nsfw, violent, gore, nude, adult content, cartoon, childish, bright colors, happy faces, cute, anime, cheerful, comic style, deformed, ugly';

// ─── Persistent Python Subprocess Manager ────────────────────────────
let pythonProcess = null;
let isReady = false;
let requestQueue = [];
let currentResolve = null;
let currentReject = null;
let outputBuffer = '';

function startImageGen() {
  if (pythonProcess) return;

  console.log('[ImageGen] Starting Python subprocess...');
  console.log(`[ImageGen] Python: ${PYTHON_PATH}`);
  console.log(`[ImageGen] Script: ${SCRIPT_PATH}`);

  pythonProcess = spawn(PYTHON_PATH, [SCRIPT_PATH], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: path.dirname(SCRIPT_PATH),
  });

  pythonProcess.stdout.on('data', (data) => {
    const text = data.toString();
    
    // Check for READY signal
    if (!isReady && text.includes('READY')) {
      isReady = true;
      console.log('[ImageGen] ✅ Pipeline loaded and ready!');
      // Process any queued requests
      processQueue();
      return;
    }

    // Accumulate output and process complete JSON lines
    outputBuffer += text;
    const lines = outputBuffer.split('\n');
    outputBuffer = lines.pop(); // Keep incomplete line in buffer

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const result = JSON.parse(trimmed);
        if (currentResolve) {
          currentResolve(result);
          currentResolve = null;
          currentReject = null;
          processQueue();
        }
      } catch {
        // Not JSON, might be a log line
        console.log(`[ImageGen stdout] ${trimmed}`);
      }
    }
  });

  pythonProcess.stderr.on('data', (data) => {
    const text = data.toString().trim();
    if (text) console.log(`[ImageGen] ${text}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`[ImageGen] Process exited with code ${code}`);
    pythonProcess = null;
    isReady = false;
    outputBuffer = '';
    
    if (currentReject) {
      currentReject(new Error('ImageGen process died'));
      currentResolve = null;
      currentReject = null;
    }

    // Reject all queued requests
    while (requestQueue.length > 0) {
      const { reject } = requestQueue.shift();
      reject(new Error('ImageGen process died'));
    }

    // Auto-restart after 3 seconds
    console.log('[ImageGen] Will restart in 3s...');
    setTimeout(startImageGen, 3000);
  });

  pythonProcess.on('error', (err) => {
    console.error(`[ImageGen] Failed to start: ${err.message}`);
    pythonProcess = null;
    isReady = false;
  });
}

function processQueue() {
  if (!isReady || currentResolve || requestQueue.length === 0) return;

  const { request, resolve, reject } = requestQueue.shift();
  currentResolve = resolve;
  currentReject = reject;

  try {
    const jsonLine = JSON.stringify(request) + '\n';
    pythonProcess.stdin.write(jsonLine);
  } catch (err) {
    reject(err);
    currentResolve = null;
    currentReject = null;
    processQueue();
  }
}

function generateImage(prompt, negativePrompt, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
  return new Promise((resolve, reject) => {
    // Add a timeout
    const timeout = setTimeout(() => {
      reject(new Error('Image generation timed out (60s)'));
    }, 60000);

    const wrappedResolve = (result) => {
      clearTimeout(timeout);
      resolve(result);
    };
    const wrappedReject = (err) => {
      clearTimeout(timeout);
      reject(err);
    };

    requestQueue.push({
      request: { prompt, negative_prompt: negativePrompt, width, height },
      resolve: wrappedResolve,
      reject: wrappedReject,
    });

    if (!pythonProcess) {
      startImageGen();
    } else {
      processQueue();
    }
  });
}

// ─── Start on module load ────────────────────────────────────────────
startImageGen();

// ─── Serve generated images ──────────────────────────────────────────
const fs = require('fs');
if (!fs.existsSync(GENERATED_DIR)) fs.mkdirSync(GENERATED_DIR, { recursive: true });
router.use('/images', express.static(GENERATED_DIR));

// ─── Helper: Convert result to image URL ─────────────────────────────
function resultToImageUrls(result) {
  if (result.success && result.path) {
    const filename = path.basename(result.path);
    return [`http://localhost:${process.env.SERVER_PORT || 3001}/api/fooocus/images/${filename}`];
  }
  return [];
}

// ─── Routes ──────────────────────────────────────────────────────────

// Wonder mode
router.post('/wonder', async (req, res) => {
  try {
    const { imagePrompt } = req.body;
    const safePrompt = `children's storybook illustration, bright warm colors, friendly characters, ${imagePrompt}`;

    const result = await generateImage(safePrompt, WONDER_NEGATIVE);
    res.json({ success: true, images: resultToImageUrls(result) });
  } catch (error) {
    console.error('[ImageGen Wonder Error]', error.message);
    res.json({ success: false, images: [], error: error.message });
  }
});

// Sanctuary mode
router.post('/sanctuary', async (req, res) => {
  try {
    const { imagePrompt, emotionalTheme } = req.body;
    const safePrompt = `${imagePrompt}, muted desaturated palette with one warm accent color, atmospheric, impressionist, never pure black use deep midnight blue or charcoal grey, protagonist has warm light around them`;

    const result = await generateImage(safePrompt, SANCTUARY_NEGATIVE);
    res.json({ success: true, images: resultToImageUrls(result) });
  } catch (error) {
    console.error('[ImageGen Sanctuary Error]', error.message);
    res.json({ success: false, images: [], error: error.message });
  }
});

// AI Art Studio (generic)
router.post('/generate', async (req, res) => {
  try {
    const { imagePrompt } = req.body;
    const negativePrompt = 'nsfw, violent, scary, blood, weapon, gore, nude, adult, dark, horror, realistic photo, ugly, deformed';

    const result = await generateImage(imagePrompt, negativePrompt);
    res.json({ success: true, images: resultToImageUrls(result) });
  } catch (error) {
    console.error('[ImageGen Generate Error]', error.message);
    res.json({ success: false, images: [], error: error.message });
  }
});

// Health check
router.get('/health', async (req, res) => {
  res.json({ online: isReady, type: 'direct-local', gpu: true });
});

module.exports = router;
