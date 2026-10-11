// Maps the language NAME (sent from frontend) to native script for the LLM.
// This prevents the LLM from misinterpreting and defaulting to English.
const LANGUAGE_MAP = {
  English:  'English',
  Hindi:    'Hindi (हिन्दी)',
  Telugu:   'Telugu (తెలుగు)',
  Tamil:    'Tamil (தமிழ்)',
  Bengali:  'Bengali (বাংলা)',
  Marathi:  'Marathi (मराठी)',
  Kannada:  'Kannada (ಕನ್ನಡ)',
  Malayalam:'Malayalam (മലയാളം)',
  Gujarati: 'Gujarati (ગુજરાતી)',
  Punjabi:  'Punjabi (ਪੰਜਾਬੀ)',
  Urdu:     'Urdu (اردو)',
};

function resolveLanguage(input) {
  if (!input) return LANGUAGE_MAP.English;
  return LANGUAGE_MAP[input] || input; // fall back to whatever was sent
}

module.exports = { LANGUAGE_MAP, resolveLanguage };