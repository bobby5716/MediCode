const mongoose = require('mongoose');

const aiTaskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'clinical-note',
        'lab-explainer',
        'triage',
        'medication-check',
        'resource-forecast',
        'ambient-visit',
      ],
      required: true,
    },
    title: { type: String, default: '' },
    patientId: { type: String, default: '', index: true },
    input: { type: mongoose.Schema.Types.Mixed },
    output: { type: mongoose.Schema.Types.Mixed },
    notes: { type: String, default: '' },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },
    status: {
      type: String,
      enum: ['pending', 'done', 'failed'],
      default: 'done',
    },
    
    },
  { timestamps: true }
);

module.exports = mongoose.model('AiTask', aiTaskSchema);