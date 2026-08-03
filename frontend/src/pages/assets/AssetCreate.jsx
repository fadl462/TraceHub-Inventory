import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    toast.success(t('assetCreate.priceSetTo', { amount: usdEquivalent.toFixed(2) }));
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
      toast.success(t('assetCreate.assetRegisteredSuccess'));
      navigate(`/assets/${data.asset.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || t('assetCreate.failedToRegister'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">{t('assetCreate.title')}</h1>
        <p className="text-sm text-ink/60 mt-0.5">A QR code and AI-estimated disposal timeline will be generated automatically.</p>
      </div>

      <form onSubmit={onSubmit}>
        <Card className="p-6 space-y-5">
          <Input label={t('assetCreate.nameLabel')} required placeholder={t('assetCreate.namePlaceholder')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <div className="grid sm:grid-cols-2 gap-4">
            <Select label={t('assetCreate.categoryLabel')} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">{t('assetCreate.selectCategory')}</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select label={t('assetCreate.conditionLabel')} value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
              <option value="new">{t('assetCreate.conditionNew')}</option>
              <option value="good">{t('assetCreate.conditionGood')}</option>
              <option value="fair">{t('assetCreate.conditionFair')}</option>
              <option value="poor">{t('assetCreate.conditionPoor')}</option>
              <option value="damaged">{t('assetCreate.conditionDamaged')}</option>
            </Select>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Input label={t('assetCreate.brandLabel')} value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <Input label={t('assetCreate.modelLabel')} value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
            <Input
              label={t('assetCreate.colorLabel')} value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
              list="th-color-list" placeholder={t('assetCreate.colorPlaceholder')} autoComplete="off"
            />
            <datalist id="th-color-list">
              {COLOR_NAMES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>

          <Input label={t('assetCreate.serialNumberLabel')} value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} />

          <div className="grid sm:grid-cols-3 gap-4">
            <Input label={t('assetCreate.manufactureYearLabel')} type="number" placeholder="2023" value={form.manufactureYear} onChange={(e) => setForm({ ...form, manufactureYear: e.target.value })} />
            <Input label={t('assetCreate.purchaseDateLabel')} type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} />
            <Input label={t('assetCreate.purchasePriceLabel')} type="number" step="0.01" placeholder="500" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })} />
          </div>

          <div className="rounded-lg border border-primary-100 p-4">
            <p className="text-sm font-medium text-ink/80 mb-1">Paid in a different currency?</p>
            <p className="text-xs text-ink/50 mb-3">Purchase price is always stored in USD - convert your local amount here and it'll fill in the field above.</p>
            <div className="grid sm:grid-cols-3 gap-3 items-end">
              <Select label={t('assetCreate.currencyLabel')} value={priceCurrency} onChange={(e) => { setPriceCurrency(e.target.value); setFxRate(''); setFxError(''); }}>
                {CURRENCY_OPTIONS.map((c) => <option key={c.code} value={c.code} disabled={c.disabled}>{c.label}</option>)}
              </Select>
              <Input label={`Amount in ${priceCurrency}`} type="number" step="0.01" value={foreignAmount} onChange={(e) => setForeignAmount(e.target.value)} disabled={priceCurrency === 'USD'} />
              <div className="flex gap-2">
                <Input label={t('assetCreate.rateLabel')} type="number" step="0.0001" value={fxRate} onChange={(e) => setFxRate(e.target.value)} disabled={priceCurrency === 'USD'} />
                <Button type="button" variant="outline" onClick={fetchLiveRate} disabled={priceCurrency === 'USD' || fxLoading} className="mb-0.5">
                  {fxLoading ? '...' : 'Fetch rate'}
                </Button>
              </div>
            </div>
            {fxError && <p className="text-xs text-red-600 mt-2">{fxError}</p>}
            {usdEquivalent != null && (
              <div className="flex items-center justify-between mt-3 bg-primary-50/60 rounded-lg px-3 py-2">
                <span className="text-sm text-ink">\u2248 <strong>${usdEquivalent.toFixed(2)}</strong> USD</span>
                <Button type="button" onClick={applyConversion}>{t('assetCreate.useThisAmount')}</Button>
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

          <Select label={t('assetCreate.currentLocationLabel')} value={form.currentLocationId} onChange={(e) => setForm({ ...form, currentLocationId: e.target.value })}>
            <option value="">{t('assetCreate.noFixedCheckpoint')}</option>
            {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </Select>

          {locations.length === 0 && (
            <Input label={t('assetCreate.freeTextLocationLabel')} value={form.freeTextLocation} onChange={(e) => setForm({ ...form, freeTextLocation: e.target.value })} />
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
                  accurate the health, failure-risk, and disposal recommendations will be — and the
                  higher the AI confidence score. This covers the fields with the most direct impact
                  on those scores, not every field the engine can use.
                </p>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Depreciation</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select label={t('assetCreate.depreciationMethodLabel')} value={form.depreciationMethod} onChange={(e) => setForm({ ...form, depreciationMethod: e.target.value })}>
                      <option value="straight_line">{t('assetCreate.methodStraightLine')}</option>
                      <option value="reducing_balance">{t('assetCreate.methodReducingBalance')}</option>
                      <option value="double_declining_balance">{t('assetCreate.methodDoubleDecliningBalance')}</option>
                      <option value="sum_of_years_digits">{t('assetCreate.methodSumOfYearsDigits')}</option>
                      <option value="units_of_production">{t('assetCreate.methodUnitsOfProduction')}</option>
                      <option value="machine_hours">{t('assetCreate.methodMachineHours')}</option>
                      <option value="mileage_based">{t('assetCreate.methodMileageBased')}</option>
                      <option value="ai_adaptive">{t('assetCreate.methodAiAdaptive')}</option>
                      <option value="custom_formula">{t('assetCreate.methodCustomFormula')}</option>
                    </Select>
                    <Input label={t('assetCreate.warrantyExpiryLabel')} type="date" value={form.warrantyExpiry} onChange={(e) => setForm({ ...form, warrantyExpiry: e.target.value })} />
                  </div>
                  {['units_of_production', 'machine_hours', 'mileage_based'].includes(form.depreciationMethod) && (
                    <div className="mt-4">
                      <Input
                        label={t('assetCreate.totalExpectedCapacityLabel')}
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
                          type="text" placeholder={t('assetCreate.customFormulaPlaceholder')}
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
                    <Input label={t('assetCreate.hoursUsedLabel')} type="number" value={form.hoursUsed} onChange={(e) => setForm({ ...form, hoursUsed: e.target.value })} />
                    <Input label={t('assetCreate.maintenanceCountLabel')} type="number" value={form.maintenanceCount} onChange={(e) => setForm({ ...form, maintenanceCount: e.target.value })} />
                    <Input label={t('assetCreate.repairCountLabel')} type="number" value={form.repairCount} onChange={(e) => setForm({ ...form, repairCount: e.target.value })} />
                    <Input label={t('assetCreate.failureCountLabel')} type="number" value={form.failureCount} onChange={(e) => setForm({ ...form, failureCount: e.target.value })} />
                    <Input label={t('assetCreate.latestInspectionScoreLabel')} type="number" min="0" max="100" value={form.inspectionScore} onChange={(e) => setForm({ ...form, inspectionScore: e.target.value })} />
                    <Select label={t('assetCreate.usageIntensityLabel')} value={form.usageIntensity} onChange={(e) => setForm({ ...form, usageIntensity: e.target.value })}>
                      <option value="light">{t('assetCreate.intensityLight')}</option>
                      <option value="normal">{t('assetCreate.intensityNormal')}</option>
                      <option value="heavy">{t('assetCreate.intensityHeavy')}</option>
                      <option value="extreme">{t('assetCreate.intensityExtreme')}</option>
                    </Select>
                    <Input label={t('assetCreate.lastMaintenanceDateLabel')} type="date" value={form.lastMaintenanceDate} onChange={(e) => setForm({ ...form, lastMaintenanceDate: e.target.value })} />
                    <Input
                      label={t('assetCreate.serviceIntervalOverrideLabel')} type="number" placeholder={t('assetCreate.serviceIntervalPlaceholder')}
                      value={form.maintenanceIntervalDaysOverride} onChange={(e) => setForm({ ...form, maintenanceIntervalDaysOverride: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Financial (beyond purchase price)</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label={t('assetCreate.totalMaintenanceCostLabel')} type="number" step="0.01" value={form.maintenanceCostTotal} onChange={(e) => setForm({ ...form, maintenanceCostTotal: e.target.value })} />
                    <Input label={t('assetCreate.totalRepairCostLabel')} type="number" step="0.01" value={form.repairCostTotal} onChange={(e) => setForm({ ...form, repairCostTotal: e.target.value })} />
                    <Input label={t('assetCreate.currentMarketValueLabel')} type="number" step="0.01" value={form.currentMarketValue} onChange={(e) => setForm({ ...form, currentMarketValue: e.target.value })} />
                    <Input label={t('assetCreate.currentReplacementCostLabel')} type="number" step="0.01" value={form.currentReplacementCost} onChange={(e) => setForm({ ...form, currentReplacementCost: e.target.value })} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Condition &amp; environment</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input label={t('assetCreate.reliabilityScoreLabel')} type="number" min="0" max="100" value={form.assetReliability} onChange={(e) => setForm({ ...form, assetReliability: e.target.value })} />
                    <Input label={t('assetCreate.maintenanceComplianceLabel')} type="number" min="0" max="100" value={form.maintenanceCompliance} onChange={(e) => setForm({ ...form, maintenanceCompliance: e.target.value })} />
                    <Input label={t('assetCreate.criticalityScoreLabel')} type="number" min="0" max="100" value={form.criticalityScore} onChange={(e) => setForm({ ...form, criticalityScore: e.target.value })} />
                    <Select label={t('assetCreate.corrosionRiskLabel')} value={form.corrosionRisk} onChange={(e) => setForm({ ...form, corrosionRisk: e.target.value })}>
                      <option value="low">{t('assetCreate.levelLow')}</option><option value="moderate">{t('assetCreate.levelModerate')}</option><option value="high">{t('assetCreate.levelHigh')}</option>
                    </Select>
                    <Select label={t('assetCreate.dustExposureLabel')} value={form.dustExposure} onChange={(e) => setForm({ ...form, dustExposure: e.target.value })}>
                      <option value="low">{t('assetCreate.levelLow')}</option><option value="moderate">{t('assetCreate.levelModerate')}</option><option value="high">{t('assetCreate.levelHigh')}</option>
                    </Select>
                    <Select label={t('assetCreate.resaleDemandLabel')} value={form.resaleDemand} onChange={(e) => setForm({ ...form, resaleDemand: e.target.value })}>
                      <option value="low">{t('assetCreate.levelLow')}</option><option value="moderate">{t('assetCreate.levelModerate')}</option><option value="high">{t('assetCreate.levelHigh')}</option>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>{t('common.cancel')}</Button>
            <Button type="submit" disabled={loading}>{loading ? t('assetCreate.registering') : t('assetCreate.registerAsset')}</Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
