const express = require('express');
const { authenticate, requireCompanyContext } = require('../middleware/auth');
const { getExchangeRate, SUPPORTED_CURRENCIES } = require('../utils/fxRates');

const router = express.Router();

router.use(authenticate, requireCompanyContext);

/** GET /api/fx-rate?from=GHS&to=USD - live exchange rate for the Purchase Price conversion helper */
router.get('/', async (req, res, next) => {
  try {
    const { from, to = 'USD' } = req.query;
    if (!from) return res.status(400).json({ error: 'from currency is required' });
    const rate = await getExchangeRate(from.toUpperCase(), to.toUpperCase());
    res.json({ from: from.toUpperCase(), to: to.toUpperCase(), rate, fetchedAt: new Date().toISOString() });
  } catch (err) {
    res.status(502).json({ error: err.message || 'Could not fetch a live exchange rate right now. Enter the rate manually instead.' });
  }
});

router.get('/supported-currencies', (req, res) => res.json({ currencies: SUPPORTED_CURRENCIES }));

module.exports = router;
