const AiTask = require('../models/AiTask');
const {
  generateJSON,
  generateJSONWithImage,
  streamJSON,
} = require('../services/ai');

const clinicalNotePrompt = require('../services/prompts/clinicalNote');
const labExplainerPrompt = require('../services/prompts/labExplainer');
const triagePrompt = require('../services/prompts/triage');
const medicationPrompt = require('../services/prompts/medication');
const resourceForecastPrompt = require('../services/prompts/resourceForecast');
const ambientVisitPrompt = require('../services/prompts/ambientVisit');

// ─────────────────────────────────────────────────────────────
// Severity normalization — protects against LLM translating enums
// ─────────────────────────────────────────────────────────────
const SEVERITY_SET = ['low', 'medium', 'high', 'critical'];
const CRITICAL_WORDS = ['critical', 'క్రిటికల్', 'गंभीर', 'கடுமையான', 'ক্রিটিক্যাল', 'गंभीर', 'severe'];
const HIGH_WORDS = ['high', 'అధిక', 'उच्च', 'அதிக', 'উচ্চ', 'उच्च'];
const MEDIUM_WORDS = ['medium', 'moderate', 'మధ్యస్థ', 'मध्यम', 'நடுத்தர', 'মাঝারি'];

function normalizeSeverity(raw) {
  const s = String(raw || 'low').toLowerCase().trim();
  if (SEVERITY_SET.includes(s)) return s;

  if (CRITICAL_WORDS.some((w) => s.includes(w.toLowerCase()))) return 'critical';
  if (HIGH_WORDS.some((w) => s.includes(w.toLowerCase()))) return 'high';
  if (MEDIUM_WORDS.some((w) => s.includes(w.toLowerCase()))) return 'medium';
  return 'low';
}

// ─────────────────────────────────────────────────────────────
// Emit real-time alert for high/critical tasks
// ─────────────────────────────────────────────────────────────
function emitAlert(req, task) {
  const io = req.app.get('io');
  if (!io) return;
  if (task.severity !== 'high' && task.severity !== 'critical') return;

  io.emit('alert:new', {
    _id: task._id,
    type: task.type,
    title: task.title,
    severity: task.severity,
    patientId: task.patientId || '',
    createdAt: task.createdAt,
    summary: task.output?.summary || task.output?.reasoning || '',
  });
}

// ─────────────────────────────────────────────────────────────
// Prompt map
// ─────────────────────────────────────────────────────────────
const HANDLERS = {
  'clinical-note': {
    build: (input) => clinicalNotePrompt(input.noteText, input.language || 'English'),
    title: (input) => (input.noteText || '').slice(0, 60) || 'Clinical Note',
  },
  'lab-explainer': {
    build: (input) => labExplainerPrompt(input.reportText, input.language || 'English'),
    title: () => 'Lab Report Analysis',
  },
  triage: {
    build: (input) => triagePrompt(input, input.language || 'English'),
    title: (input) => `Triage – ${input.age}y ${input.symptoms?.slice(0, 40) || ''}`,
  },
  'medication-check': {
    build: (input) => medicationPrompt(input.medications, input.language || 'English'),
    title: (input) => `Medication Check (${input.medications?.length || 0} drugs)`,
  },
  'resource-forecast': {
    build: (input) => resourceForecastPrompt(input, input.language || 'English'),
    title: (input) => `Forecast – ${input.department}`,
  },
  'ambient-visit': {
    build: (input) => ambientVisitPrompt(input.conversation, input.language || 'English'),
    title: () => `Ambient Visit – ${new Date().toLocaleDateString()}`,
  },
};

// ─────────────────────────────────────────────────────────────
// POST /api/ai/:type — standard non-streaming analysis
// ─────────────────────────────────────────────────────────────
exports.runAiTask = async (req, res, next) => {
  try {
    const { type } = req.params;
    const handler = HANDLERS[type];

    if (!handler) {
      res.status(400);
      throw new Error(`Unknown task type: ${type}`);
    }

    const input = req.body;
    const imageBase64 = input.imageBase64;
    const imageMime = input.imageMime || 'image/jpeg';

    let prompt = handler.build(input);

    if (imageBase64) {
      prompt = `Extract all readable content from the attached image (handwriting, printed text, tables, lab values). Then perform the analysis below.\n\n${prompt}`;
    }

    let output;
    try {
      output = imageBase64
        ? await generateJSONWithImage(prompt, imageBase64, imageMime)
        : await generateJSON(prompt);
    } catch (aiErr) {
      await AiTask.create({
        user: req.user._id,
        type,
        title: handler.title(input),
        patientId: input.patientId || '',
        input: { ...input, imageBase64: undefined, imageMime: undefined },
        status: 'failed',
        output: { error: aiErr.message },
      });
      throw aiErr;
    }

    // Normalize severity
    const severity = normalizeSeverity(output.severity);
    output.severity = severity;

    // Strip base64 before storage
    const storedInput = { ...input };
    delete storedInput.imageBase64;
    delete storedInput.imageMime;

    const task = await AiTask.create({
      user: req.user._id,
      type,
      title: handler.title(input),
      patientId: input.patientId || '',
      input: storedInput,
      output,
      severity,
      status: 'done',
    });

    // Real-time alert
    emitAlert(req, task);

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/ai/:type/stream — streaming via Server-Sent Events
// ─────────────────────────────────────────────────────────────
exports.streamAiTask = async (req, res, next) => {
  try {
    const { type } = req.params;
    const handler = HANDLERS[type];

    if (!handler) {
      res.status(400);
      return next(new Error(`Unknown task type: ${type}`));
    }

    const input = req.body;
    const prompt = handler.build(input);

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    let fullText = '';

    try {
      await streamJSON(prompt, (chunk) => {
        fullText += chunk;
        try {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        } catch {}
      });

      // Parse accumulated JSON
      let output;
      try {
        const cleaned = fullText
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        output = JSON.parse(cleaned);
      } catch {
        output = { raw: fullText, severity: 'low' };
      }

      // Normalize severity
      const severity = normalizeSeverity(output.severity);
      output.severity = severity;

      // Strip base64 before storage
      const storedInput = { ...input };
      delete storedInput.imageBase64;
      delete storedInput.imageMime;

      const task = await AiTask.create({
        user: req.user._id,
        type,
        title: handler.title(input),
        patientId: input.patientId || '',
        input: storedInput,
        output,
        severity,
        status: 'done',
      });

      // Real-time alert
      emitAlert(req, task);

      res.write(`event: done\ndata: ${JSON.stringify(task)}\n\n`);
      res.end();
    } catch (aiErr) {
      res.write(
        `event: error\ndata: ${JSON.stringify({ message: aiErr.message })}\n\n`
      );
      res.end();
    }
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/ai/tasks/all
// ─────────────────────────────────────────────────────────────
exports.listTasks = async (req, res, next) => {
  try {
    const { type, limit = 50, patientId } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.type = type;
    if (patientId) filter.patientId = patientId;

    const tasks = await AiTask.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/ai/tasks/:id
// ─────────────────────────────────────────────────────────────
exports.getTask = async (req, res, next) => {
  try {
    const task = await AiTask.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/ai/stats/summary
// ─────────────────────────────────────────────────────────────
exports.getStats = async (req, res, next) => {
  try {
    const stats = await AiTask.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const severityCounts = await AiTask.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);

    res.json({ byType: stats, bySeverity: severityCounts });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/ai/tasks/:id
// ─────────────────────────────────────────────────────────────
exports.deleteTask = async (req, res, next) => {
  try {
    await AiTask.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// PATCH /api/ai/tasks/:id/notes
// ─────────────────────────────────────────────────────────────
exports.updateNotes = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const task = await AiTask.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { notes: notes || '' },
      { new: true }
    );
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
};