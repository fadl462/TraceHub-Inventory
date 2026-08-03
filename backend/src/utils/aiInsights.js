const MODEL = 'claude-sonnet-4-6';

const LANGUAGE_NAMES = { en: 'English', fr: 'French', es: 'Spanish' };

/**
 * Generates a short (2-4 sentence), plain-language executive summary from
 * real aggregated numbers - never fabricates figures, only narrates the
 * ones it's given. Falls back to a simple templated sentence if no
 * ANTHROPIC_API_KEY is configured, so the dashboard never breaks.
 *
 * Locale support: when a real API call is made, Claude is simply
 * instructed to respond in the requested language (it writes fluent
 * French/Spanish natively) - this is the one genuinely dynamic,
 * LLM-authored piece of text in the app, so it's also the one place where
 * "translate the output" literally means "ask the model to write in that
 * language" rather than a lookup table. The fallback string (used when no
 * API key is configured) is passed in pre-translated by the caller.
 */
async function generateInsight({
  systemContext, stats, fallback, locale = 'en',
}) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { insight: fallback, configured: false };
  }

  try {
    const languageInstruction = locale !== 'en'
      ? ` Respond entirely in ${LANGUAGE_NAMES[locale] || 'English'} - not English, even if the data below has English labels.`
      : '';
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 220,
        system: `${systemContext} Respond with 2-4 short, plain-language sentences summarizing what's notable in the data below - trends, risks, or things worth a human's attention. Only reference numbers actually present in the data; never invent figures. No markdown, no bullet points, just prose. If nothing stands out, say the numbers look steady.${languageInstruction}`,
        messages: [{ role: 'user', content: JSON.stringify(stats) }],
      }),
    });

    if (!resp.ok) return { insight: fallback, configured: false };

    const data = await resp.json();
    const text = data.content?.map((b) => b.text || '').join('').trim();
    return { insight: text || fallback, configured: true };
  } catch {
    return { insight: fallback, configured: false };
  }
}

module.exports = { generateInsight };
