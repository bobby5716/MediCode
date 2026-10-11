const { resolveLanguage } = require('./languages');

module.exports = ({ department, historicalData, currentLoad }, language = 'English') => {
  const lang = resolveLanguage(language);
  return `
You are a hospital operations analyst. Forecast resource demand.

CRITICAL INSTRUCTIONS:
- Return STRICT JSON only (no markdown, no code fences, no commentary).
- Keep ALL JSON KEYS in English exactly as specified.
- Write ALL VALUES in ${lang}. Do NOT translate to English.
- "day" stays in English (Mon, Tue, Wed...).
- severity stays one of: low|medium|high|critical.
- The "severity" field MUST ALWAYS be exactly one of: low, medium, high, critical (in English, lowercase). NEVER translate this field.
- Include "confidence" as a number between 0 and 1.
- Include "reasoningTrace" as an array of 3-5 short strings.
Department: ${department}
Current load: ${currentLoad}
Historical admissions (last 7 days): ${historicalData}

Return exactly this JSON shape:
{
  "forecast": [
    { "day": "Mon", "predictedAdmissions": 12, "confidence": 0.85 }
  ],
  "peakDay": "day with highest predicted load",
  "staffingRecommendation": "specific staffing advice",
  "resourceAlerts": ["resource that may run short 1", "resource 2"],
  "severity": "low | medium | high | critical"
}
    "confidence": 0.85,
  "reasoningTrace": ["Analyzed weekly pattern", "Projected demand", "Recommended staffing"]
}
`;
};