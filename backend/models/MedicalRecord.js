const mongoose = require('mongoose');

const observationSchema = new mongoose.Schema({
  code: { type: String, default: '' },
  value: { type: String, default: '' },
  unit: { type: String, default: '' },
  referenceRange: { type: String, default: '' },
  status: {
    type: String,
    enum: ['normal', 'low', 'high', 'critical', 'unknown'],
    default: 'unknown',
  },
  interpretation: { type: String, default: '' },
}, { _id: false });

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, default: '' },
  frequency: { type: String, default: '' },
  duration: { type: String, default: '' },
  route: { type: String, default: '' },
}, { _id: false });

const medicalRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  // ABDM readiness
  abhaId: { type: String, default: '' },
  recordType: {
    type: String,
    enum: ['prescription', 'lab-report', 'discharge-summary', 'diagnostic', 'other'],
    default: 'other',
  },
  recordDate: { type: Date, default: Date.now },
  facilityName: { type: String, default: '' },
  doctorName: { type: String, default: '' },
  patientName: { type: String, default: '' },

  // Source file
  fileName: { type: String, default: '' },
  fileMime: { type: String, default: '' },
  fileSize: { type: Number, default: 0 },
  pageCount: { type: Number, default: 1 },
  pagesProcessed: { type: Number, default: 1 },

  // Extracted
  observations: [observationSchema],
  medications: [medicationSchema],
  diagnoses: [{ type: String }],
  symptoms: [{ type: String }],

  // Summary
  summary: { type: String, default: '' },
  abnormalFindings: [{ type: String }],
  language: { type: String, default: 'English' },

  // Status
  status: {
    type: String,
    enum: ['pending', 'extracted', 'reviewed', 'failed'],
    default: 'pending',
  },
  extractionConfidence: { type: Number, default: 0 },
  rawExtraction: { type: mongoose.Schema.Types.Mixed },
  reviewedByUser: { type: Boolean, default: false },

  disclaimer: {
    type: String,
    default: 'This is an AI-generated summary for informational purposes only. It is not a medical diagnosis. Always consult a qualified healthcare professional before making health decisions.',
  },
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);