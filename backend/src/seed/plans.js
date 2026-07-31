// Subscription tiers: differentiated by asset limits, seats, and feature flags,
// per "different subscription tiers for companies based on features and usage."
module.exports = [
  {
    name: 'Trial', code: 'trial', description: '10 assets free for 30 days',
    assetLimit: 10, userLimit: 3, priceMonthly: 0, priceAnnual: 0, currency: 'GHS',
    features: ['reporting'], sortOrder: 0,
  },
  {
    name: 'Basic', code: 'basic', description: 'For small teams getting started',
    assetLimit: 100, userLimit: 5, priceMonthly: 150, priceAnnual: 1500, currency: 'GHS',
    features: ['reporting', 'qr_scanning'], sortOrder: 1,
  },
  {
    name: 'Pro', code: 'pro', description: 'For growing companies with multiple locations',
    assetLimit: 1000, userLimit: 25, priceMonthly: 450, priceAnnual: 4500, currency: 'GHS',
    features: ['reporting', 'qr_scanning', 'api_access', 'custom_fields', 'multi_location'], sortOrder: 2,
  },
  {
    name: 'Enterprise', code: 'enterprise', description: 'Unlimited scale with custom domain and priority support',
    assetLimit: -1, userLimit: -1, priceMonthly: 1200, priceAnnual: 12000, currency: 'GHS',
    features: ['reporting', 'qr_scanning', 'api_access', 'custom_fields', 'multi_location', 'custom_domain', 'priority_support'],
    sortOrder: 3,
  },
];
