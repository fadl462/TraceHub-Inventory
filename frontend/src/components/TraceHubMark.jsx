/**
 * TraceHub Inventory brand mark, rebuilt as SVG instead of the raster PNGs in
 * /public/branding. Renders perfectly crisp at any size (the PNGs were
 * 6000px+ originals that blurred badly when scaled down to navbar/login
 * sizes) and the "radar" rings actually sweep, like the icon is continuously
 * scanning/locating - which a static image could never do.
 *
 * Usage:
 *   <TraceHubMark size={40} />                 icon only
 *   <TraceHubMark size={36} withWordmark />    icon + "TraceHub Inventory" text
 *   <TraceHubMark size={36} withWordmark tone="white" />  for dark backgrounds
 */
export default function TraceHubMark({ size = 40, withWordmark = false, tone = 'color', animate = true, className = '' }) {
  const isWhite = tone === 'white';
  const ringColor = isWhite ? '#FFFFFF' : '#1A4D8F';
  const sweepColor = isWhite ? '#8CC2FF' : '#4DA3FF';
  const dotColor = isWhite ? '#7ED957' : '#7ED957';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Static concentric radar rings - crisp vector, never blurs */}
        <circle cx="50" cy="50" r="46" stroke={ringColor} strokeWidth="3" opacity="0.25" />
        <circle cx="50" cy="50" r="33" stroke={ringColor} strokeWidth="3" opacity="0.45" />
        <circle cx="50" cy="50" r="20" stroke={ringColor} strokeWidth="3" opacity="0.7" />

        {/* Rotating sweep wedge - the "tracing/locating" motion */}
        <g style={{
          transformOrigin: '50px 50px',
          animation: animate ? 'th-radar-spin 4.5s linear infinite' : 'none',
        }}
        >
          <path
            d="M 50 50 L 50 4 A 46 46 0 0 1 88.8 27 Z"
            fill={`url(#th-sweep-gradient-${tone})`}
          />
        </g>

        <defs>
          <linearGradient id={`th-sweep-gradient-${tone}`} x1="50" y1="50" x2="88.8" y2="27" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={sweepColor} stopOpacity="0.85" />
            <stop offset="1" stopColor={sweepColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Center locator dot */}
        <circle cx="50" cy="50" r="6" fill={dotColor} />

        <style>{`
          @keyframes th-radar-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </svg>

      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-bold tracking-tight ${isWhite ? 'text-white' : 'text-ink'}`}
            style={{ fontSize: size * 0.44 }}
          >
            TraceHub
          </span>
          <span
            className={`font-semibold tracking-[0.25em] uppercase ${isWhite ? 'text-white/60' : 'text-ink/45'}`}
            style={{ fontSize: Math.max(size * 0.16, 8) }}
          >
            Inventory
          </span>
        </span>
      )}
    </div>
  );
}
