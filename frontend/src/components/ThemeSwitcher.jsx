import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme, THEMES } from '../context/ThemeContext';

const ICONS = { light: Sun, dark: Moon, emerald: Sparkles };

/** A single button that cycles Light -> Dark -> Emerald -> Light on each click. */
export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const currentIndex = THEMES.findIndex((t) => t.id === theme);
  const current = THEMES[currentIndex] || THEMES[0];
  const Icon = ICONS[current.id] || Sun;

  const cycle = () => {
    const next = THEMES[(currentIndex + 1) % THEMES.length];
    setTheme(next.id);
  };

  return (
    <button
      onClick={cycle}
      title={`Theme: ${current.label} (click to switch)`}
      aria-label={`Current theme: ${current.label}. Click to switch to the next theme.`}
      className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-primary-100 hover:bg-primary-50 transition-colors"
    >
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
        style={{ background: current.swatch }}
      >
        <Icon size={13} className={current.id === 'light' ? 'text-amber-500' : 'text-white'} />
      </span>
      <span className="text-xs font-medium text-ink/70">{current.label}</span>
    </button>
  );
}
