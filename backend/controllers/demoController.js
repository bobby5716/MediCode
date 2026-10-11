const { generateJSON, generateJSONWithImage } = require('../services/ai');
const labExplainerPrompt = require('../services/prompts/labExplainer');

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_TEXT_LENGTH = 10000;
const MAX_IMAGE_LENGTH = 12 * 1024 * 1024;
const MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const requestsByIp = new Map();

exports.checkReport = async (req, res, next) => {
  try {
    res.set('Cache-Control', 'no-store');
    // Guest checks are deliberately stateless: no AiTask or MedicalRecord is created.
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const recent = (requestsByIp.get(ip) || []).filter((time) => now - time < WINDOW_MS);
    if (recent.length >= MAX_REQUESTS) {
      return res.status(429).json({ message: 'Please wait a few minutes before checking another report.' });
    }
    recent.push(now);
    requestsByIp.set(ip, recent);
    if (requestsByIp.size > 5000) {
      for (const [knownIp, timestamps] of requestsByIp) {
        if (timestamps.every((time) => now - time >= WINDOW_MS)) requestsByIp.delete(knownIp);
      }
    }

    const { reportText = '', language = 'English', imageBase64, imageMime = 'image/jpeg' } = req.body;
    if (typeof reportText !== 'string' || reportText.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ message: 'Report text must be under 10,000 characters.' });
    }
    if (!reportText.trim() && !imageBase64) {
      return res.status(400).json({ message: 'Paste report values or add a report image.' });
    }
    if (imageBase64 && (typeof imageBase64 !== 'string' || imageBase64.length > MAX_IMAGE_LENGTH)) {
      return res.status(400).json({ message: 'Image is too large. Please use an image under 8 MB.' });
    }
    if (imageBase64 && !MIME_TYPES.includes(imageMime)) {
      return res.status(400).json({ message: 'Use a JPG, PNG, WEBP, or GIF image.' });
    }

    const prompt = labExplainerPrompt(reportText.trim(), language);
    const visionPrompt = imageBase64
      ? `Read the lab report image and explain its results. If report text is also supplied, include it.\n\n${prompt}`
      : prompt;
    const output = imageBase64
      ? await generateJSONWithImage(visionPrompt, imageBase64, imageMime)
      : await generateJSON(prompt);

    res.set('Cache-Control', 'no-store');
    return res.json({
      output,
      input: { language },
      createdAt: new Date().toISOString(),
      patientId: '',
    });
  } catch (error) {
    return next(error);
  }
};
