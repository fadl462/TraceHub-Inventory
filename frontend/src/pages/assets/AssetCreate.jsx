import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import client from '../../api/client';
import { Card, Button, Input, Select } from '../../components/ui';
import { COLOR_NAMES } from '../../utils/colorList';

const CURRENCY_OPTIONS = [
  { code: 'USD', label: 'USD ($) - US Dollar' },
  { code: 'GHS', label: 'GHS (\u20b5) - Ghanaian Cedi' },
  { code: 'CNY', label: 'CNY (\u00a5) - Chinese Yuan (coming soon)', disabled: true },
  { code: 'EUR', label: 'EUR (\u20ac) - Euro (coming soon)', disabled: true },
  { code: 'GBP', label: 'GBP (\u00a3) - British Pound (coming soon)', disabled: true },
];

export default function AssetCreate() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceCurrency, setPriceCurrency] = useState('USD');
  const [foreignAmount, setForeignAmount] = useState('');
  const [fxRate, setFxRate] = useState('');
  const [fxLoading, setFxLoading] = useState(false);
  const [fxError, setFxError] = useState('');
  const [form, setForm] = useState({
    name: '', categoryId: '', brand: '', model: '', color: '', serialNumber: '',
    manufactureYear: '', purchaseDate: '', purchasePrice: '', condition: 'good',
    currentLocationId: '', freeTextLocation: '', description: '',
    // Intelligence Engine inputs - all optional, drive the health/failure/disposal scores
    depreciationMethod: 'straight_line', warrantyExpiry: '', currentMarketValue: '', currentReplacementCost: '',
    unitsProductionCapacity: '', customDepreciationFormula: '',
    hoursUsed: '', maintenanceCount: '', repairCount: '', failureCount: '', inspectionScore: '',
    lastMaintenanceDate: '', maintenanceIntervalDaysOverride: '',
    maintenanceCostTotal: '', repairCostTotal: '',
    usageIntensity: 'normal', assetReliability: '', maintenanceCompliance: '', criticalityScore: '',
    corrosionRisk: 'low', dustExposure: 'low', resaleDemand: 'moderate',
  });

  useEffect(() => {
    client.get('/categories').then(({ data }) => setCategories(data.categories));
    client.get('/locations').then(({ data }) => setLocations(data.locations));
  }, []);

  const fetchLiveRate = async () => {
    setFxLoading(true);
    setFxError('');
    try {
      const { data } = await client.get('/fx-rate', { params: { from: priceCurrency, to: 'USD' } });
      setFxRate(data.rate);
    } catch (err) {
      setFxError(err.response?.data?.error || 'Could not fetch a live rate - enter it manually below.');
    } finally {
      setFxLoading(false);
    }
  };

  const usdEquivalent = foreignAmount && fxRate ? (Number(foreignAmount) * Number(fxRate)) : null;

  const applyConversion = () => {
    if (!usdEquivalent) return;
    setForm((f) => ({ ...f, purchasePrice: usdEquivalent.toFixed(2) }));
    setPriceCurrency('USD');
    setForeignAmount('');
    setFxRate('');
    toast.success(`Set purchase price to $${usdEquivalent.toFixed(2)}`);
  };

  const selectedCategory = categories.find((c) => c.id === form.categoryId);
  const profile = selectedCategory?.DepreciationProfile;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      Object.keys(payload).forEach((k) => { if (payload[k] === '') delete payload[k]; });
      const { data } = await client.post('/assets', payload);
      toast.success('Asset registered successfully');
      navigate(`/assets/${data.asset.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to register asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Register a new asset</h1>
        <p className="text-sm text-ink/60 mt-0.5">A QR code and AI-estimated disposal timeline will be generated automatically.</p>
      </div>

      <form onSubmit={onSubmit}>
        <Card className="p-6 space-y-5">
          <Input label="Asset name *" required placeholder="e.g. Dell Latitude Laptop" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Category" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select label="Condition" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="damaged">Damaged</option>
            </Select>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <Input label="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
            <Input
              label="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
              list="th-color-list" placeholder="Start typing or pick a color..." autoComplete="off"
            />
            <datalist id="th-color-list">
              {COLOR_NAMES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>

          <Input label="Serial number" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} />

          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="Manufacture year" type="number" placeholder="2023" value={form.manufactureYear} onChange={(e) => setForm({ ...form, manufactureYear: e.target.value })} />
            <Input label="Purchase date" type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} />
            <Input label="Purchase price (USD)" type="number" step="0.01" placeholder="500" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })} />
          </div>

          <div className="rounded-lg border border-primary-100 p-4">
            <p className="text-sm font-medium text-ink/80 mb-1">Paid in a different currency?</p>
            <p className="text-xs text-ink/50 mb-3">Purchase price is always stored in USD - convert your local amount here and it'll fill in the field above.</p>
            <div className="grid sm:grid-cols-3 gap-3 items-end">
              <Select label="Currency" value={priceCurrency} onChange={(e) => { setPriceCurrency(e.target.value); setFxRate(''); setFxError(''); }}>
                {CURRENCY_OPTIONS.map((c) => <option key={c.code} value={c.code} disabled={c.disabled}>{c.label}</option>)}
              </Select>
              <Input label={`Amount in ${priceCurrency}`} type="number" step="0.01" value={foreignAmount} onChange={(e) => setForeignAmount(e.target.value)} disabled={priceCurrency === 'USD'} />
              <div className="flex gap-2">
                <Input label="Rate (1 USD =)" type="number" step="0.0001" value={fxRate} onChange={(e) => setFxRate(e.target.value)} disabled={priceCurrency === 'USD'} />
                <Button type="button" variant="outline" onClick={fetchLiveRate} disabled={priceCurrency === 'USD' || fxLoading} className="mb-0.5">
                  {fxLoading ? '...' : 'Fetch rate'}
                </Button>
              </div>
            </div>
            {fxError && <p className="text-xs text-red-600 mt-2">{fxError}</p>}
            {usdEquivalent != null && (
              <div className="flex items-center justify-between mt-3 bg-primary-50/60 rounded-lg px-3 py-2">
                <span className="text-sm text-ink">\u2248 <strong>${usdEquivalent.toFixed(2)}</strong> USD</span>
                <Button type="button" onClick={applyConversion}>Use this amount</Button>
              </div>
            )}
          </div>

          {profile && form.purchasePrice && (
            <div className="rounded-lg bg-accent/10 border border-accent/30 p-4 flex gap-3">
              <Sparkles size={18} className="text-accent-dark shrink-0 mt-0.5" />
              <div className="text-sm text-ink/80">
                <p className="font-medium text-ink">AI depreciation preview ({selectedCategory.name})</p>
                <p className="mt-1">
                  Useful life: <strong>{profile.usefulLifeYears} years</strong> · Scrap value: <strong>~{profile.scrapValuePercent}%</strong> of purchase price
                  ({(form.purchasePrice * profile.scrapValuePercent / 100).toFixed(2)}) once registered, TraceHub will calculate the current value and suggested disposal date automatically.
                </p>
              </div>
            </div>
          )}

          <Select label="Current location" value={form.currentLocationId} onChange={(e) => setForm({ ...form, currentLocationId: e.target.value })}>
            <option value="">No fixed checkpoint / not set</option>
            {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </Select>

          {locations.length === 0 && (
            <Input label="Or describe location (e.g. 'Accra office, 2nd floor store')" value={form.freeTextLocation} onChange={(e) => setForm({ ...form, freeTextLocation: e.target.value })} />
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink/80">Description</span>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm focus-ring focus:border-secondary"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <div className="border border-primary-100 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-ink bg-primary-50/50 hover:bg-primary-50"
            >
              <span className="flex items-center gap-2"><Sparkles size={15} className="text-link" /> Asset Intelligence Engine data (optional)</span>
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showAdvanced && (
              <div className="p-4 space-y-5">
                <p className="text-xs text-ink/50 -mt-1">
                  None of this is required to register the asset. The more you fill in, the more
                  accurate the health, failure-risk, and disposal recommendations will be \u2014 and the
                  higher the AI confidence score. This covers the fields with the most direct impact
                  on those scores, not every field the engine can use.
                </p>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Depreciation</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select label="Depreciation method" value={form.depreciationMethod} onChange={(e) => setForm({ ...form, depreciationMethod: e.target.value })}>
                      <option value="straight_line">Straight line</option>
                      <option value="reducing_balance">Reducing balance</option>
                      <option value="double_declining_balance">Double declining balance</option>
                      <option value="sum_of_years_digits">Sum of years' digits</option>
                      <option value="units_of_production">Units of production</option>
                      <option value="machine_hours">Machine hours</option>
                      <option value="mileage_based">Mileage based</option>
                      <option value="ai_adaptive">AI Adaptive (factors in usage, maintenance, environment)</option>
                      <option value="custom_formula">Custom formula</option>
                    </Select>
                    <Input label="Warranty expiry" type="date" value={form.warrantyExpiry} onChange={(e) => setForm({ ...form, warrantyExpiry: e.target.value })} />
                  </div>
                  {['units_of_production', 'machine_hours', 'mileage_based'].includes(form.depreciationMethod) && (
                    <div className="mt-4">
                      <Input
                        label="Total expected capacity over useful life (units / hours / miles, matching the method above)"
                        type="number" value={form.unitsProductionCapacity}
                        onChange={(e) => setForm({ ...form, unitsProductionCapacity: e.target.value })}
                      />
                    </div>
                  )}
                  {form.depreciationMethod === 'custom_formula' && (
                    <div className="mt-4">
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-ink/80">Custom formula</span>
                        <input
                          type="text" placeholder="e.g. cost - (repairCount * 25) - (age * 100)"
                          className="w-full rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm font-mono focus-ring focus:border-secondary"
                          value={form.customDepreciationFormula}
                          onChange={(e) => setForm({ ...form, customDepreciationFormula: e.target.value })}
                        />
                      </label>
                      <p className="text-xs text-ink/50 mt-1.5">
                        Basic arithmetic only (+ - * / ^ and parentheses) - no functions. Available variables:{' '}
                        <code className="text-[11px]">cost, residual, lifeYears, age, hoursUsed, mileage, operatingCycles, repairCount, maintenanceCount, maintenanceCostTotal, repairCostTotal</code>.
                        An invalid formula safely falls back to straight-line rather than breaking the asset.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Operational history</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input label="Hours used" type="number" value={form.hoursUsed} onChange={(e) => setForm({ ...form, hoursUsed: e.target.value })} />
                    <Input label="Maintenance count" type="number" value={form.maintenanceCount} onChange={(e) => setForm({ ...form, maintenanceCount: e.target.value })} />
                    <Input label="Repair count" type="number" value={form.repairCount} onChange={(e) => setForm({ ...form, repairCount: e.target.value })} />
                    <Input label="Failure count" type="number" value={form.failureCount} onChange={(e) => setForm({ ...form, failureCount: e.target.value })} />
                    <Input label="Latest inspection score (0-100)" type="number" min="0" max="100" value={form.inspectionScore} onChange={(e) => setForm({ ...form, inspectionScore: e.target.value })} />
                    <Select label="Usage intensity" value={form.usageIntensity} onChange={(e) => setForm({ ...form, usageIntensity: e.target.value })}>
                      <option value="light">Light</option>
                      <option value="normal">Normal</option>
                      <option value="heavy">Heavy</option>
                      <option value="extreme">Extreme</option>
                    </Select>
                    <Input label="Last maintenance date" type="date" value={form.lastMaintenanceDate} onChange={(e) => setForm({ ...form, lastMaintenanceDate: e.target.value })} />
                    <Input
                      label="Service interval override (days, optional)" type="number" placeholder="e.g. 90"
                      value={form.maintenanceIntervalDaysOverride} onChange={(e) => setForm({ ...form, maintenanceIntervalDaysOverride: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Financial (beyond purchase price)</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Total maintenance cost to date" type="number" step="0.01" value={form.maintenanceCostTotal} onChange={(e) => setForm({ ...form, maintenanceCostTotal: e.target.value })} />
                    <Input label="Total repair cost to date" type="number" step="0.01" value={form.repairCostTotal} onChange={(e) => setForm({ ...form, repairCostTotal: e.target.value })} />
                    <Input label="Current market value" type="number" step="0.01" value={form.currentMarketValue} onChange={(e) => setForm({ ...form, currentMarketValue: e.target.value })} />
                    <Input label="Current replacement cost" type="number" step="0.01" value={form.currentReplacementCost} onChange={(e) => setForm({ ...form, currentReplacementCost: e.target.value })} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Condition &amp; environment</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input label="Reliability score (0-100)" type="number" min="0" max="100" value={form.assetReliability} onChange={(e) => setForm({ ...form, assetReliability: e.target.value })} />
                    <Input label="Maintenance compliance (0-100)" type="number" min="0" max="100" value={form.maintenanceCompliance} onChange={(e) => setForm({ ...form, maintenanceCompliance: e.target.value })} />
                    <Input label="Criticality to operations (0-100)" type="number" min="0" max="100" value={form.criticalityScore} onChange={(e) => setForm({ ...form, criticalityScore: e.target.value })} />
                    <Select label="Corrosion risk" value={form.corrosionRisk} onChange={(e) => setForm({ ...form, corrosionRisk: e.target.value })}>
                      <option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option>
                    </Select>
                    <Select label="Dust exposure" value={form.dustExposure} onChange={(e) => setForm({ ...form, dustExposure: e.target.value })}>
                      <option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option>
                    </Select>
                    <Select label="Resale demand" value={form.resaleDemand} onChange={(e) => setForm({ ...form, resaleDemand: e.target.value })}>
                      <option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register asset'}</Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
