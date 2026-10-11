const { resolveLanguage } = require('./languages');

module.exports = ({ age, symptoms, duration, vitals }, language = 'English') => {
  const lang = resolveLanguage(language);
  return `
You are an ER triage assistant. Classify urgency based on patient data.

CRITICAL INSTRUCTIONS:
- Return STRICT JSON only (no markdown, no code fences, no commentary).
- Keep ALL JSON KEYS in English exactly as specified.
- Write ALL VALUES in ${lang}. Do NOT translate to English.
- urgencyLevel stays a NUMBER (1-5). severity stays one of: low|medium|high|critical.
- Include "confidence" as a number between 0 and 1.
- Include "reasoningTrace" as an array of 3-5 short strings.
Patient:
- Age: ${age}
- Symptoms: ${symptoms}
- Duration: ${duration}
- Vitals: ${vitals || 'not provided'}

Return exactly this JSON shape:
{
  "urgencyLevel": 1,
  "urgencyLabel": "1=Resuscitation | 2=Emergency | 3=Urgent | 4=Semi-urgent | 5=Non-urgent",
  "reasoning": "2-3 sentence justification",
  "recommendedAction": "specific next step",
  "redFlags": ["concerning finding 1", "concerning finding 2"],
  "estimatedWaitTime": "e.g. Immediate | 10 min | 1-2 hours",
  "severity": "low | medium | high | critical"
}  "confidence": 0.85,
  "reasoningTrace": ["Evaluated vitals", "Assessed symptom severity", "Assigned urgency level"]
}
`;
};