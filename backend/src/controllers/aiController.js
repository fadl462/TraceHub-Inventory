const { Faq, SiteContent, Testimonial } = require('../models');

const MODEL = 'claude-sonnet-4-6';

async function buildSystemPrompt(extraContext) {
  const [faqs, content] = await Promise.all([
    Faq.findAll({ where: { isPublished: true }, order: [['sortOrder', 'ASC']] }),
    SiteContent.findByPk('default'),
  ]);

  const faqText = faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');

  return `You are the TraceHub Inventory assistant - a friendly, concise product expert embedded on the
TraceHub Inventory website and app. TraceHub Inventory is an asset & inventory management platform:
companies register equipment (laptops, vehicles, machinery, tools, etc.), an AI-driven depreciation
engine estimates scrap value/useful life/current book value automatically from category profiles,
assets are tracked via QR-code phone-camera scans at checkpoints (no RFID or GPS hardware needed),
assets can be assigned to staff or outside contacts with automatic return reminders, and companies
choose from Trial/Basic/Pro/Enterprise subscription tiers billed through Flutterwave.

Answer questions using the knowledge base below whenever it's relevant. If a question is outside
what you know about TraceHub, say so honestly rather than inventing details - don't make up pricing,
features, or policies that aren't in this context. Keep answers short (2-4 sentences) and conversational,
like a helpful person, not a wall of text. If someone seems ready to sign up, encourage them to click
"Get started free" - the first 10 assets are free for 30 days, no card required.

--- Knowledge base (published FAQs) ---
${faqText}

--- Homepage headline/positioning currently live ---
${content?.heroHeadline || ''}
${content?.heroSubheadline || ''}
${extraContext || ''}`;
}

async function chat(req, res, next) {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message is too long' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({
        reply: "I'm not fully set up yet \u2014 the platform owner hasn't added an AI API key. In the meantime, check the FAQ section or reach out directly!",
        configured: false,
      });
    }

    // Optional extra grounding for the in-app (authenticated) version of the
    // widget - lets it answer with real numbers about the visitor's own company.
    let extraContext = '';
    if (req.user && req.company) {
      extraContext = `\nThe person asking is logged in as ${req.user.role} at "${req.company.name}" (status: ${req.company.status}).`;
    }

    const systemPrompt = await buildSystemPrompt(extraContext);

    const messages = [
      ...(Array.isArray(history) ? history.slice(-10).map((h) => ({
        role: h.role === 'assistant' ? 'assistant' : 'user',
        content: String(h.content || '').slice(0, 2000),
      })) : []),
      { role: 'user', content: message },
    ];

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: systemPrompt,
        messages,
      }),
    });

    if (!resp.ok) {
      const errBody = await resp.text();
      console.error('[ai] Anthropic API error:', resp.status, errBody);
      return res.status(502).json({ error: 'The AI assistant is temporarily unavailable. Please try again shortly.' });
    }

    const data = await resp.json();
    const reply = data.content?.map((b) => b.text || '').join('') || "Sorry, I couldn't come up with a response to that.";

    res.json({ reply, configured: true });
  } catch (err) { next(err); }
}

module.exports = { chat };
