const { Faq, SiteContent, Testimonial, Asset, Assignment } = require('../models');
const { Op } = require('sequelize');
const { computeFleetIntelligence } = require('../utils/fleetIntelligence');
const { generateFleetInsights } = require('../utils/fleetInsights');

const MODEL = 'claude-sonnet-4-6';

/**
 * Real, data-grounded context for an authenticated user's own company -
 * this is what makes "which assets need replacing?" answerable with an
 * actual answer instead of a generic non-response. Every number here comes
 * from a real query against this company's data; nothing is invented.
 * Bounded and summarized (not a full data dump) to keep prompts small and
 * because dumping every asset's full record isn't necessary for the kind
 * of exec-level questions this is meant to answer.
 */
async function buildCompanyContext(company) {
  const companyId = company.id;
  const baseWhere = { companyId, isArchived: false };

  const [summary, flaggedAssets, nearDisposalAssets, overdueAssignments] = await Promise.all([
    computeFleetIntelligence(companyId),
    Asset.findAll({
      where: { ...baseWhere, disposalRecommendation: { [Op.in]: ['REPLACE', 'SCRAP', 'SELL', 'REPAIR'] } },
      attributes: ['name', 'assetTag', 'disposalRecommendation', 'healthScore', 'maintenanceCostTotal', 'repairCostTotal', 'currentReplacementCost', 'purchasePrice', 'currency', 'executiveRecommendation'],
      order: [['healthScore', 'ASC']],
      limit: 10,
    }),
    Asset.findAll({
      where: { ...baseWhere, aiSuggestedDisposalDate: { [Op.ne]: null, [Op.lte]: new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10) } },
      attributes: ['name', 'assetTag', 'aiSuggestedDisposalDate', 'healthScore'],
      order: [['aiSuggestedDisposalDate', 'ASC']],
      limit: 10,
    }),
    Assignment.findAll({
      where: { companyId, status: 'overdue' },
      attributes: ['id', 'assetId', 'expectedReturnDate', 'externalAssigneeName'],
      limit: 10,
    }),
  ]);

  const fleetInsights = await generateFleetInsights(companyId, { Asset, AssetCategory: require('../models').AssetCategory }).catch(() => []);

  const flaggedList = flaggedAssets.map((a) => `- ${a.name} (${a.assetTag}): health ${a.healthScore}%, recommendation ${a.disposalRecommendation}, upkeep so far ${a.currency} ${(Number(a.maintenanceCostTotal || 0) + Number(a.repairCostTotal || 0)).toLocaleString()}${a.executiveRecommendation ? ` \u2014 "${a.executiveRecommendation}"` : ''}`).join('\n') || 'None currently flagged.';
  const nearDisposalList = nearDisposalAssets.map((a) => `- ${a.name} (${a.assetTag}): suggested disposal ${a.aiSuggestedDisposalDate}, health ${a.healthScore}%`).join('\n') || 'None in the next 180 days.';
  const insightsList = fleetInsights.map((i) => `- ${i.text}`).join('\n') || 'No notable patterns detected.';

  return `
--- REAL DATA FOR ${company.name} (as of ${new Date().toISOString().slice(0, 10)}) ---
This section is ground truth from this company's actual database. Use it directly to answer
questions about their fleet - don't hedge or say you don't have access when the answer is right here.

Fleet overview: ${summary.totalAssets} total assets, total fleet value ${summary.totalFleetValue.toLocaleString()}.
Portfolio Health: ${summary.portfolioHealth ?? 'n/a'}%. Asset Availability: ${summary.assetAvailabilityPct ?? 'n/a'}%.
Capital Risk: ${summary.capitalRiskPct}% of fleet value is in High Risk/Critical health assets (${summary.financialRisk} financial risk, ${summary.operationalRisk} operational risk).
Overall Fleet Grade: ${summary.fleetGrade ?? 'n/a'}.
Health tiers: Excellent ${summary.healthTiers.excellent}, Healthy ${summary.healthTiers.healthy}, Needs Attention ${summary.healthTiers.needsAttention}, High Risk ${summary.healthTiers.highRisk}, Critical ${summary.healthTiers.critical}.
Disposal recommendations: Keep ${summary.recommendationBreakdown.KEEP}, Repair ${summary.recommendationBreakdown.REPAIR}, Sell ${summary.recommendationBreakdown.SELL}, Scrap ${summary.recommendationBreakdown.SCRAP}, Replace ${summary.recommendationBreakdown.REPLACE}.
Money already spent maintaining assets flagged for replacement/scrap/sale this cycle: ${summary.projectedSavings.toLocaleString()} - this is what they'd stop spending by acting on the recommendation.

Assets currently flagged for repair/replace/scrap/sell (worst health first, up to 10):
${flaggedList}

Assets with a suggested disposal date in the next 180 days:
${nearDisposalList}

Overdue assignments right now: ${overdueAssignments.length}

Rule-based fleet insights (real patterns detected across the fleet):
${insightsList}
--- END REAL DATA ---
`;
}

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

If a "REAL DATA" section appears below, the person is logged in and asking about their own company's
fleet - use those real numbers directly and specifically (asset names, dollar amounts, percentages)
rather than speaking generically. That data is a bounded, summarized snapshot (top ~10 flagged assets,
aggregate counts), not literally every asset - if asked something more granular than what's provided
(e.g. about one specific asset not listed), say you only have the summary and suggest they check that
asset's own page, rather than guessing.

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

    // Real, data-grounded context for the in-app (authenticated) version of
    // the widget - lets it answer with actual numbers about the visitor's
    // own company, not just a placeholder line saying who's logged in.
    let extraContext = '';
    if (req.user && req.company) {
      try {
        extraContext = `\nThe person asking is logged in as ${req.user.role} at "${req.company.name}".\n${await buildCompanyContext(req.company)}`;
      } catch (err) {
        // A failure building fleet context shouldn't break the whole chat -
        // fall back to the old minimal line rather than erroring out.
        console.error('[ai] Failed to build company context:', err.message);
        extraContext = `\nThe person asking is logged in as ${req.user.role} at "${req.company.name}" (status: ${req.company.status}).`;
      }
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
        max_tokens: 600,
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

module.exports = { chat, buildCompanyContext };
