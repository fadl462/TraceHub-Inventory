import { Check } from 'lucide-react';
import { useTheme, THEMES } from '../context/ThemeContext';

export default function ThemeSwitcher({ compact = false }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={compact ? 'flex items-center gap-2' : 'space-y-2'}>
      {!compact && <p className="text-xs font-semibold uppercase tracking-wide text-primary-200/50 px-1">Theme</p>}
      <div className="flex items-center gap-2">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={t.label}
            aria-label={`Switch to ${t.label} theme`}
            aria-pressed={theme === t.id}
            className={`relative w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
              theme === t.id ? 'border-accent' : 'border-white/20'
            }`}
            style={{ background: t.swatch }}
          >
            {theme === t.id && (
              <Check size={12} className="absolute inset-0 m-auto text-white drop-shadow" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
