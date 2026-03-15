const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middleware
app.use(cors({ origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json({ limit: '10mb' }));

// Safety screening middleware — runs on ALL Sanctuary routes
const { screenInput } = require('./utils/safetyScreen');
app.use('/api/sanctuary', async (req, res, next) => {
  if (req.body?.userMessage) {
    const safetyResult = await screenInput(req.body.userMessage, req.body?.userId);
    if (safetyResult.crisis) {
      return res.json({
        safetyFlag: true,
        safetyResponse: safetyResult.crisisResponse,
        type: 'crisis'
      });
    }
    req.safetyResult = safetyResult;
  }
  next();
});

// Setup routes
app.use('/api/gemini', require('./routes/gemini'));
app.use('/api/fooocus', require('./routes/fooocus'));
app.use('/api/tts', require('./routes/tts'));
app.use('/api/safety', require('./routes/safety'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'StoryWeaver Orchestration', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🧶 StoryWeaver server running on http://localhost:${PORT}`);
  console.log(`   Gemini API: ${process.env.GEMINI_API_KEY ? '✅ configured' : '❌ missing GEMINI_API_KEY'}`);
  console.log(`   Local ImageGen: ✅ running as subprocess`);
});
