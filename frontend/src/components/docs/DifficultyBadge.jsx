import { useTranslation } from 'react-i18next';

const STYLES = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
};

const LABEL_KEYS = {
  beginner: 'diffBeginner', intermediate: 'diffIntermediate', advanced: 'diffAdvanced',
};

export default function DifficultyBadge({ level, className = '' }) {
  const { t } = useTranslation();
  if (!level || !STYLES[level]) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${STYLES[level]} ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {t(`docsHome.${LABEL_KEYS[level]}`)}
    </span>
  );
}
