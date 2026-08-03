import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

/**
 * A genuinely working calculator, not a static mockup - uses the exact same
 * straight-line formula as the real Smart Depreciation Engine
 * (backend/src/utils/assetIntelligence.js): annual depreciation =
 * (cost - residual) / lifeYears, current value = max(residual, cost -
 * annual * age). Embedded directly in the doc article that explains this
 * engine, so readers can try real numbers immediately rather than only
 * reading about it.
 */
export default function DepreciationCalculator() {
  const { t } = useTranslation();
  const [cost, setCost] = useState(12000);
  const [lifeYears, setLifeYears] = useState(5);
  const [residualPct, setResidualPct] = useState(10);
  const [age, setAge] = useState(2);

  const residual = (cost * residualPct) / 100;
  const depreciableBase = Math.max(0, cost - residual);
  const annualDepreciation = lifeYears > 0 ? depreciableBase / lifeYears : 0;
  const currentValue = Math.max(residual, cost - annualDepreciation * age);
  const percentDepreciated = cost > 0 ? Math.round(((cost - currentValue) / cost) * 100) : 0;

  const field = (label, value, setValue, opts = {}) => (
    <label className="block">
      <span className="text-xs font-medium text-ink/60 mb-1 block">{label}</span>
      <input
        type="number"
        value={value}
        min={opts.min ?? 0}
        step={opts.step ?? 1}
        onChange={(e) => setValue(Number(e.target.value) || 0)}
        className="w-full rounded-lg border border-ink/10 px-3 py-2 text-sm focus-ring focus:border-secondary"
      />
    </label>
  );

  return (
    <div className="not-prose my-6 rounded-2xl border border-primary/15 bg-primary-50/40 p-5 sm:p-6">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary mb-4">
        <Sparkles size={13} /> {t('docArticle.tryItYourself')}
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-3">
          {field(t('docArticle.calcPurchasePrice'), cost, setCost, { step: 100 })}
          {field(t('docArticle.calcUsefulLifeYears'), lifeYears, setLifeYears, { min: 1 })}
          {field(t('docArticle.calcResidualPct'), residualPct, setResidualPct, { min: 0 })}
          {field(t('docArticle.calcAgeYears'), age, setAge, { step: 0.5 })}
        </div>
        <div className="bg-white rounded-xl border border-ink/5 p-4 font-mono text-sm flex flex-col justify-center">
          <div className="flex justify-between py-1.5 border-b border-ink/5">
            <span className="text-ink/50">{t('docArticle.calcAnnualDepreciation')}</span>
            <span className="font-semibold text-ink">${annualDepreciation.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-ink/5">
            <span className="text-ink/50">{t('docArticle.calcCurrentValue')}</span>
            <span className="font-bold text-accent-dark text-base">${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-ink/50">{t('docArticle.calcPercentDepreciated')}</span>
            <span className="font-semibold text-ink">{percentDepreciated}%</span>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-ink/40 mt-3">{t('docArticle.calcDisclaimer')}</p>
    </div>
  );
}
