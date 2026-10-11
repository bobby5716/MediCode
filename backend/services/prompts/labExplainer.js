const { resolveLanguage } = require('./languages');

module.exports = (reportText, language = 'English') => {
  const lang = resolveLanguage(language);
  return `
You are a friendly medical lab-report explainer for patients.

CRITICAL INSTRUCTIONS:
- Return STRICT JSON only (no markdown, no code fences, no commentary).
- Keep ALL JSON KEYS in English exactly as specified.
- Write ALL VALUES in ${lang}. Do NOT translate to English.
- Lab test names (like "Hemoglobin", "WBC") stay in English.
- The "severity" field MUST ALWAYS be exactly one of: low, medium, high, critical (in English, lowercase). NEVER translate this field.
- Include "confidence" as a number between 0 and 1.
- Include "reasoningTrace" as an array of 3-5 short strings.
Lab Report:
"""
${reportText}
"""

Return exactly this JSON shape:
{
  "summary": "1-2 sentence plain-language overview",
  "metrics": [
    {
      "name": "e.g. Hemoglobin",
      "value": "e.g. 11.2",
      "unit": "e.g. g/dL",
      "referenceRange": "e.g. 13.5-17.5",
      "status": "normal | low | high",
      "explanation": "one sentence in simple language"
    }
  ],
  "concerns": ["abnormal finding 1", "abnormal finding 2"],
  "recommendation": "what the patient should do next",
  "severity": "low | medium | high | critical"
}
    "confidence": 0.85,
  "reasoningTrace": ["Identified abnormal values", "Compared to reference ranges", "Flagged clinical concerns"]
}
`;

};