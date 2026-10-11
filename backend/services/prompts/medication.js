const { resolveLanguage } = require('./languages');

module.exports = (medications, language = 'English') => {
  const lang = resolveLanguage(language);
  return `
You are a pharmacist assistant. Analyze drug interactions for the following medications.

CRITICAL INSTRUCTIONS:
- Return STRICT JSON only (no markdown, no code fences, no commentary).
- Keep ALL JSON KEYS in English exactly as specified.
- Write ALL VALUES in ${lang}. Do NOT translate to English.
- Keep drug names in their original English/generic form (e.g. Warfarin, Aspirin).
- overallRisk stays one of: safe|monitor|dangerous
- riskLevel stays one of: low|moderate|high|severe
- The "severity" field MUST ALWAYS be exactly one of: low, medium, high, critical (in English, lowercase). NEVER translate this field.
Medications:
- Include "confidence" as a number between 0 and 1.
- Include "reasoningTrace" as an array of 3-5 short strings.
${medications.map((m, i) => `${i + 1}. ${m}`).join('\n')}

Return exactly this JSON shape:
{
  "overallRisk": "safe | monitor | dangerous",
  "interactions": [
    {
      "pair": ["Drug A", "Drug B"],
      "riskLevel": "low | moderate | high | severe",
      "effect": "what happens when these are combined",
      "recommendation": "what to do"
    }
  ],
  "warnings": ["general warning 1", "general warning 2"],
  "severity": "low | medium | high | critical"
}
    "confidence": 0.85,
  "reasoningTrace": ["Reviewed drug list", "Cross-checked interaction database", "Rated pairwise risk"]
}
`;
};