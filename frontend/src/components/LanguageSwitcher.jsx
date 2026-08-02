import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

/**
 * Language switcher for TraceHub's real i18n system (English/French/Spanish).
 * Honest scope note: this switches the app's UI chrome (navigation, buttons,
 * forms, the marketing hero) - Super-Admin-editable CMS content (homepage
 * copy, blog posts, documentation articles) is authored in whichever
 * language it was written in and isn't machine-translated on the fly.
 */
export default function LanguageSwitcher({ dark = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const current = LANGUAGES.find((l) => l.code === i18n.language?.slice(0, 2)) || LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-lg transition-colors ${
          dark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-ink/60 hover:text-ink hover:bg-primary-50'
        }`}
        aria-label="Change language"
      >
        <Globe size={15} /> {current.code.toUpperCase()}
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-ink/10 py-1 z-50">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => { i18n.changeLanguage(l.code); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-ink hover:bg-primary-50/60 text-left"
            >
              {l.label}
              {l.code === current.code && <Check size={14} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
