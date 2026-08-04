// Subscription tiers - restructured from the original 4-tier Trial/Basic/
// Pro/Enterprise into 5 tiers (adding a genuine mid-market "Business" tier
// between Professional and Enterprise), with real regional pricing.
//
// A note on honesty, since this took real thought: the AI Intelligence
// Engine (depreciation, health scoring, failure prediction, disposal
// recommendations) runs identically for every asset regardless of plan -
// there is no existing code that gates these by subscription tier, and
// this seed deliberately does NOT claim otherwise on any tier. Tier
// differentiation here is real and enforced: asset/user limits (checked in
// planLimits.js middleware) plus the genuinely gateable feature flags
// (api_access, custom_fields, multi_location, custom_domain,
// priority_support). Nothing here promises a capability that doesn't
// actually exist in the product.
//
// Regional pricing: Ghana and the rest of Africa pay less than the global
// (US/Europe) rate for Essential/Professional/Business - a deliberate
// choice to keep the platform accessible in the markets it's actually
// built for (no hardware requirement, local Flutterwave billing, full
// language support) while still capturing willingness-to-pay in
// higher-income markets. Enterprise stays "starting at" everywhere since
// it's a negotiated/custom tier regardless of region.
//
// Annual pricing reflects a real ~15% discount vs. paying monthly for 12
// months, standard SaaS practice to improve cash flow and reduce churn.
module.exports = [
  {
    name: 'Free', code: 'trial', description: '10 assets free for 30 days, evaluate before you commit',
    assetLimit: 10, userLimit: 3, priceMonthly: 0, priceAnnual: 0, currency: 'USD',
    regionalPricing: {}, // free is free everywhere
    features: ['reporting', 'qr_scanning'], sortOrder: 0,
  },
  {
    name: 'Essential', code: 'essential', description: 'For small businesses getting off spreadsheets',
    assetLimit: 250, userLimit: 5, priceMonthly: 29, priceAnnual: 296, currency: 'USD', // 296 = 29*12*0.85, rounded
    regionalPricing: {
      ghana: { monthly: 19, annual: 194 },
      africa: { monthly: 24, annual: 245 },
    },
    features: ['reporting', 'qr_scanning'], sortOrder: 1,
  },
  {
    name: 'Professional', code: 'professional', description: 'For growing companies with multiple locations',
    assetLimit: 2500, userLimit: 25, priceMonthly: 69, priceAnnual: 704, currency: 'USD', // 704 = 69*12*0.85
    regionalPricing: {
      ghana: { monthly: 45, annual: 459 },
      africa: { monthly: 55, annual: 561 },
    },
    features: ['reporting', 'qr_scanning', 'api_access', 'custom_fields', 'multi_location'], sortOrder: 2,
  },
  {
    name: 'Business', code: 'business', description: 'For organizations running multiple sites at real scale',
    assetLimit: 10000, userLimit: 100, priceMonthly: 179, priceAnnual: 1825, currency: 'USD', // 1825 = 179*12*0.85
    regionalPricing: {
      ghana: { monthly: 99, annual: 1010 },
      africa: { monthly: 135, annual: 1377 },
    },
    features: ['reporting', 'qr_scanning', 'api_access', 'custom_fields', 'multi_location', 'priority_support'], sortOrder: 3,
  },
  {
    name: 'Enterprise', code: 'enterprise', description: 'Unlimited scale, custom domain, and a dedicated account team',
    assetLimit: -1, userLimit: -1, priceMonthly: 499, priceAnnual: 5090, currency: 'USD', // "starting at" - final price is negotiated
    regionalPricing: {
      ghana: { monthly: 299, annual: 3050 },
      africa: { monthly: 399, annual: 4070 },
    },
    features: ['reporting', 'qr_scanning', 'api_access', 'custom_fields', 'multi_location', 'custom_domain', 'priority_support'],
    sortOrder: 4,
  },
];
