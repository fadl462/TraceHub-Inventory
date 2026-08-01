const ICONS = {
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.25c0-.87.24-1.46 1.5-1.46h1.6V4.14C15.8 4.06 14.9 4 13.86 4c-2.2 0-3.7 1.34-3.7 3.8V10.5H7.6v3h2.56V21z" />
    </svg>
  ),
};

/** Picks an icon based on the footer link's label - falls back to a generic dot if unrecognized */
export default function SocialIcon({ label }) {
  const key = label.toLowerCase();
  if (key.includes('twitter') || key === 'x' || key.startsWith('x ') || key.startsWith('x/')) return ICONS.x;
  if (key.includes('linkedin')) return ICONS.linkedin;
  if (key.includes('facebook')) return ICONS.facebook;
  return <span className="w-4 h-4 rounded-full bg-current inline-block" />;
}
