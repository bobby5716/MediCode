const { resolveLanguage } = require('./languages');

module.exports = (noteText, language = 'English') => {
  const lang = resolveLanguage(language);
  return `
You are a clinical documentation assistant. Analyze the doctor's raw visit note below.

CRITICAL INSTRUCTIONS:
- Return STRICT JSON only (no markdown, no code fences, no commentary).
- Keep ALL JSON KEYS in English exactly as specified.
- Write ALL VALUES in ${lang}. Do NOT translate to English.
- The "severity" field MUST ALWAYS be exactly one of: low, medium, high, critical (in English, lowercase). NEVER translate this field.
- The "status" field (if present) MUST ALWAYS be: normal, low, or high (in English, lowercase).
- The "riskLevel" field (if present) MUST ALWAYS be: low, moderate, high, or severe (in English, lowercase).
- The "overallRisk" field (if present) MUST ALWAYS be: safe, monitor, or dangerous (in English, lowercase).
- Include "confidence" as a number between 0 and 1 (your certainty in this analysis).
- Include "reasoningTrace" as an array of 3-5 short strings describing your clinical reasoning steps.
Raw Note:
"""
${noteText}
"""

Return exactly this JSON shape:
{
  "summary": "2-3 sentence summary of the visit",
  "symptoms": ["symptom 1", "symptom 2"],
  "diagnosis": "primary diagnosis",
  "prescriptions": [
    { "drug": "name", "dose": "e.g. 500mg", "frequency": "e.g. twice daily", "duration": "e.g. 5 days" }
  ],
  "followUp": "follow-up instruction or 'None'",
  "icd10Codes": [
    { "code": "e.g. J06.9", "description": "description" }
  ],
  "severity": "low | medium | high | critical",
  "redFlags": ["concerning finding 1", "concerning finding 2"]
    "confidence": 0.85,
  "reasoningTrace": ["Reviewed symptoms and vitals", "Cross-checked against ICD-10", "Considered differentials"]

  }
    "differentialDiagnosis": [
    { "name": "Acute bronchitis", "probability": 0.75 },
    { "name": "Pneumonia", "probability": 0.15 },
    { "name": "Upper respiratory infection", "probability": 0.10 }
  ],
  }

`;
};