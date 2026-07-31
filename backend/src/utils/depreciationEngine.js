/**
 * TraceHub "AI-Driven Disposable Period" engine.
 *
 * How it works (matches the worked example agreed on in the project spec):
 *   - Each asset category has a depreciation profile: an expected useful life
 *     (years) and an expected scrap value (% of purchase price at end of life).
 *   - At registration, given only Manufacturer Year/Purchase Price and category,
 *     the engine derives: scrap price, max useful-life years, and a straight-line
 *     depreciation schedule -> current value + suggested disposal date.
 *
 *   Worked example from spec: $500 laptop, profile says 5yr life / 10% scrap.
 *     scrap = 500 * 0.10 = $50
 *     annual depreciation = (500 - 50) / 5 = $90/yr
 *     after 3 years -> 500 - (90*3) = $230   (matches "$230 after 3 years")
 *
 * This ships as a rule-based engine seeded with real-world category defaults
 * (src/seed/depreciationProfiles.js) so it works immediately with zero external
 * dependencies. If ANTHROPIC_API_KEY (or another provider key) is present in the
 * environment, `refineWithAI()` can be wired up to sharpen a category's profile
 * using model-assisted research instead of the static defaults - the calculation
 * math itself does not change, only where usefulLifeYears/scrapValuePercent come
 * from. This satisfies the "basic rule-based logic, upgradeable to predictive
 * modeling" requirement raised during scoping.
 */

const DEFAULT_PROFILE = { usefulLifeYears: 5, scrapValuePercent: 10 };

function monthsBetween(fromDate, toDate) {
  return (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth());
}

/**
 * @param {Object} params
 * @param {number} params.purchasePrice
 * @param {number} [params.manufactureYear]
 * @param {string|Date} [params.purchaseDate]
 * @param {{usefulLifeYears:number, scrapValuePercent:number}} [params.profile]
 * @param {number} [params.usefulLifeYearsOverride] - user/company override
 * @param {Date} [params.asOf] - date to compute "current value" as of (defaults to now)
 */
function estimateDepreciation({
  purchasePrice,
  manufactureYear,
  purchaseDate,
  profile = DEFAULT_PROFILE,
  usefulLifeYearsOverride,
  asOf = new Date(),
}) {
  const price = Number(purchasePrice) || 0;
  const usefulLifeYears = Number(usefulLifeYearsOverride) || Number(profile.usefulLifeYears) || DEFAULT_PROFILE.usefulLifeYears;
  const scrapValuePercent = Number(profile.scrapValuePercent) ?? DEFAULT_PROFILE.scrapValuePercent;
  const scrapValue = Math.round((price * (scrapValuePercent / 100)) * 100) / 100;

  const annualDepreciation = usefulLifeYears > 0 ? (price - scrapValue) / usefulLifeYears : 0;
  const monthlyDepreciation = annualDepreciation / 12;

  // Establish the "age" anchor: prefer purchaseDate, fall back to Jan 1 of manufactureYear
  let anchorDate;
  if (purchaseDate) {
    anchorDate = new Date(purchaseDate);
  } else if (manufactureYear) {
    anchorDate = new Date(Number(manufactureYear), 0, 1);
  } else {
    anchorDate = asOf;
  }

  const ageMonths = Math.max(0, monthsBetween(anchorDate, asOf));
  const depreciatedSoFar = monthlyDepreciation * ageMonths;
  const currentValue = Math.max(scrapValue, Math.round((price - depreciatedSoFar) * 100) / 100);

  const disposalDate = new Date(anchorDate);
  disposalDate.setFullYear(disposalDate.getFullYear() + Math.floor(usefulLifeYears));
  disposalDate.setMonth(disposalDate.getMonth() + Math.round((usefulLifeYears % 1) * 12));

  return {
    usefulLifeYears,
    scrapValuePercent,
    scrapValue,
    annualDepreciation: Math.round(annualDepreciation * 100) / 100,
    currentValue,
    suggestedDisposalDate: disposalDate.toISOString().slice(0, 10),
    ageMonths,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Optional hook: sharpen a category's profile using an LLM when an API key is
 * configured. Falls back silently to the existing profile if no key is set or
 * the call fails, so callers never need special-case handling.
 */
async function refineWithAI(categoryName, currentProfile) {
  if (!process.env.ANTHROPIC_API_KEY) return currentProfile;
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: `For asset category "${categoryName}", respond ONLY with JSON like {"usefulLifeYears": number, "scrapValuePercent": number} representing typical industry-standard useful life and scrap value percentage for this kind of asset.`,
        }],
      }),
    });
    const data = await resp.json();
    const text = data?.content?.map((b) => b.text || '').join('') || '';
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    if (parsed.usefulLifeYears && parsed.scrapValuePercent != null) {
      return {
        usefulLifeYears: Number(parsed.usefulLifeYears),
        scrapValuePercent: Number(parsed.scrapValuePercent),
      };
    }
    return currentProfile;
  } catch {
    return currentProfile;
  }
}

module.exports = { estimateDepreciation, refineWithAI, DEFAULT_PROFILE };
