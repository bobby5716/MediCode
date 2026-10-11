const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─────────────────────────────────────────────
// Standard text → JSON
// ─────────────────────────────────────────────
async function generateJSON(prompt) {
  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.4,
  });
  const text = completion.choices[0]?.message?.content || '{}';
  try {
    return JSON.parse(text);
  } catch {
    console.error('❌ Non-JSON response:', text.slice(0, 300));
    throw new Error('AI returned invalid response format');
  }
}

// ─────────────────────────────────────────────
// Vision (image + prompt) → JSON
// Uses Groq's current multimodal model: Qwen 3.8 27B
// ─────────────────────────────────────────────
async function generateJSONWithImage(prompt, base64Image, mimeType = 'image/jpeg') {
  console.log('🔍 [VISION] Request started');

  const models = [
    'qwen/qwen3.8-27b',
    'qwen/qwen3.6-27b',
  ];

  let lastError = null;

  for (const model of models) {
    try {
      console.log(`🔍 [VISION] Trying model: ${model}`);

      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const text = completion.choices[0]?.message?.content || '{}';

      try {
        const parsed = JSON.parse(text);
        return parsed;
      } catch {
        lastError = new Error('Vision AI returned invalid JSON');
        continue;
      }
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error('Vision extraction failed');
}

// ─────────────────────────────────────────────
// Streaming text → JSON
// ─────────────────────────────────────────────
async function streamJSON(prompt, onChunk) {
  const stream = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.4,
    stream: true,
  });

  for await (const part of stream) {
    const chunk = part.choices[0]?.delta?.content || '';
    if (chunk) onChunk(chunk);
  }
}

module.exports = { generateJSON, generateJSONWithImage, streamJSON };
