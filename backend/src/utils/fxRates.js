/**
 * Live FX rate lookup, used by the "Purchase Price" currency conversion
 * helper on Asset Create: purchasePrice is always stored in USD (per
 * product decision), so a user pricing an asset in another currency needs
 * a rate to convert from.
 *
 * Uses open.er-api.com - a free, no-API-key exchange rate service - rather
 * than a paid provider, since this is a lightweight conversion aid, not a
 * financial-grade FX feed. If it's unreachable (network issues, rate
 * limits, the service being down), callers get a clear error rather than
 * a silently wrong rate; the frontend falls back to manual rate entry.
 *
 * NOTE: this specific network call could not be exercised end-to-end in
 * the sandbox this was built in, since that sandbox's network allowlist
 * doesn't include this domain - the code is written defensively (timeout,
 * explicit error surface, no silent fallback to a guessed rate) precisely
 * because of that, but it's worth a real smoke test in an environment with
 * open internet access before relying on it in production.
 */

const SUPPORTED_CURRENCIES = ['USD', 'GHS']; // CNY/EUR/GBP are a planned follow-up, not yet wired up

async function getExchangeRate(from, to = 'USD') {
  if (!SUPPORTED_CURRENCIES.includes(from) || !SUPPORTED_CURRENCIES.includes(to)) {
    throw new Error(`Currency conversion for ${from} is not supported yet.`);
  }
  if (from === to) return 1;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`, { signal: controller.signal });
    if (!res.ok) throw new Error(`FX provider returned ${res.status}`);
    const data = await res.json();
    if (data.result !== 'success' || !data.rates || typeof data.rates[to] !== 'number') {
      throw new Error('FX provider returned an unexpected response');
    }
    return data.rates[to];
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { getExchangeRate, SUPPORTED_CURRENCIES };
