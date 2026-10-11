const { resolveLanguage } = require('./languages');

module.exports = (conversation, language = 'English') => {
  const lang = resolveLanguage(language);
  return `
You are a medical scribe. Listen to the following doctor-patient conversation and produce a complete, professional clinical note as if you were writing it after the visit.

CRITICAL INSTRUCTIONS:
- Return STRICT JSON only (no markdown, no code fences, no commentary).
- Keep ALL JSON KEYS in English exactly as specified.
- Write ALL VALUES in ${lang}. Do NOT translate to English.
- The "severity" field MUST ALWAYS be exactly one of: low, medium, high, critical (in English, lowercase).
- Extract only what was actually discussed. Do not invent facts.
- If a section is not discussed, use an empty array or "Not discussed".
- Include "confidence" as a number between 0 and 1 (your certainty in this analysis).
- Include "reasoningTrace" as an array of 3-5 short strings describing your clinical reasoning steps.
Conversation:
"""
${conversation}
"""

Return exactly this JSON shape:
{
  "chiefComplaint": "primary reason for visit",
  "historyOfPresentIllness": "2-4 sentence narrative of the complaint",
  "symptoms": ["symptom 1", "symptom 2"],
  "vitals": { "bp": "", "hr": "", "temp": "", "spo2": "" },
  "examinationFindings": "what the doctor observed",
  "diagnosis": "primary diagnosis",
  "differentialDiagnosis": ["alternative 1", "alternative 2"],
  "prescriptions": [
    { "drug": "name", "dose": "e.g. 500mg", "frequency": "e.g. twice daily", "duration": "e.g. 5 days" }
  ],
  "advice": ["advice 1", "advice 2"],
  "followUp": "follow-up plan and timing",
  "icd10Codes": [
    { "code": "e.g. J06.9", "description": "description" }
  ],
  "redFlags": ["concerning finding 1"],
  "severity": "low | medium | high | critical",
  "confidence": 0.85
  "reasoningTrace": ["step 1 you took", "step 2 you took", "step 3 you took"]
}
`;
};