const MedicalRecord = require('../models/MedicalRecord');
const { generateJSONWithImage } = require('../services/ai');
const medicalRecordPrompt = require('../services/prompts/medicalRecord');

const VALID_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// POST /api/records
// Body: { imageBase64, imageMime, fileName, fileSize, pageCount, pagesProcessed, language, abhaId }
exports.createRecord = async (req, res, next) => {
  try {
    const {
      imageBase64,
      imageMime = 'image/jpeg',
      fileName = '',
      fileSize = 0,
      pageCount = 1,
      pagesProcessed = 1,
      language = 'English',
      abhaId = '',
    } = req.body;

    if (!imageBase64) {
      res.status(400);
      throw new Error('No document image provided');
    }
    if (!VALID_MIMES.includes(imageMime)) {
      res.status(400);
      throw new Error('Unsupported file type. Use JPG, PNG, WEBP, or GIF.');
    }

    const prompt = medicalRecordPrompt(language);

    let extracted;
    try {
      extracted = await generateJSONWithImage(prompt, imageBase64, imageMime);
    } catch (aiErr) {
      const failed = await MedicalRecord.create({
        user: req.user._id,
        fileName,
        fileSize,
        pageCount,
        pagesProcessed,
        language,
        abhaId,
        status: 'failed',
        rawExtraction: { error: aiErr.message },
      });
      return res.status(201).json(failed);
    }

    const record = await MedicalRecord.create({
      user: req.user._id,
      abhaId,
      recordType: extracted.recordType || 'other',
      recordDate: extracted.recordDate ? new Date(extracted.recordDate) : new Date(),
      facilityName: extracted.facilityName || '',
      doctorName: extracted.doctorName || '',
      patientName: extracted.patientName || '',
      fileName,
      fileMime: imageMime,
      fileSize,
      pageCount,
      pagesProcessed,
      observations: extracted.observations || [],
      medications: extracted.medications || [],
      diagnoses: extracted.diagnoses || [],
      symptoms: extracted.symptoms || [],
      summary: extracted.summary || '',
      abnormalFindings: extracted.abnormalFindings || [],
      language,
      status: 'extracted',
      extractionConfidence: Number(extracted.confidence) || 0,
      rawExtraction: extracted,
    });

    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};

// GET /api/records
exports.listRecords = async (req, res, next) => {
  try {
    const { limit = 100 } = req.query;
    const records = await MedicalRecord.find({ user: req.user._id })
      .sort({ recordDate: -1, createdAt: -1 })
      .limit(Number(limit));
    res.json(records);
  } catch (err) {
    next(err);
  }
};

// GET /api/records/:id
exports.getRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!record) {
      res.status(404);
      throw new Error('Record not found');
    }
    res.json(record);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/records/:id
exports.updateRecord = async (req, res, next) => {
  try {
    const allowed = [
      'recordType', 'recordDate', 'facilityName', 'doctorName', 'patientName',
      'observations', 'medications', 'diagnoses', 'symptoms', 'summary',
      'abnormalFindings', 'language', 'abhaId',
    ];
    const update = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) update[k] = req.body[k];
    });
    update.status = 'reviewed';
    update.reviewedByUser = true;

    const record = await MedicalRecord.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      update,
      { new: true }
    );
    if (!record) {
      res.status(404);
      throw new Error('Record not found');
    }
    res.json(record);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/records/:id
exports.deleteRecord = async (req, res, next) => {
  try {
    await MedicalRecord.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

// GET /api/records/:id/translate?language=Hindi
exports.translateSummary = async (req, res, next) => {
  try {
    const { language = 'Hindi' } = req.query;
    const record = await MedicalRecord.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!record) {
      res.status(404);
      throw new Error('Record not found');
    }

    const prompt = medicalRecordPrompt(language);
    // Use a text-only prompt asking for translation
    const { generateJSON } = require('../services/ai');
    const translation = await generateJSON(
      `Translate the following medical summary into ${language}. Return JSON: {"summary": "...", "abnormalFindings": ["..."]}.\n\nSummary: ${record.summary}\n\nAbnormal findings: ${JSON.stringify(record.abnormalFindings)}`
    );

    record.summary = translation.summary || record.summary;
    record.abnormalFindings = translation.abnormalFindings || record.abnormalFindings;
    record.language = language;
    await record.save();

    res.json(record);
  } catch (err) {
    next(err);
  }
};