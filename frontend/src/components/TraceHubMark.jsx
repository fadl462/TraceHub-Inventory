/**
 * TraceHub Inventory brand mark: animated SVG radar icon (crisp at any size,
 * genuinely rotating/scanning) paired with the ORIGINAL wordmark artwork
 * (cropped from the source logo files, preserving the exact two-tone
 * "Trace"/"Hub" styling and swoosh detail - this is real brand typography,
 * not a re-typed approximation).
 *
 * Usage:
 *   <TraceHubMark size={44} />                 icon only
 *   <TraceHubMark size={44} withWordmark />    icon + wordmark, brand colors
 *   <TraceHubMark size={44} withWordmark tone="white" />  for dark backgrounds
 */
export default function TraceHubMark({ size = 44, withWordmark = false, tone = 'color', animate = true, className = '' }) {
  const isWhite = tone === 'white';
  const ringColor = isWhite ? '#FFFFFF' : '#1A4D8F';
  const sweepColor = isWhite ? '#8CC2FF' : '#4DA3FF';
  const dotColor = '#7ED957';

  const wordmarkSrc = isWhite
    ? '/branding/tracehub-wordmark-white.png'
    : '/branding/tracehub-wordmark-color.png';

  // Source wordmark crop is 4369x977px (aspect ratio ~4.47:1)
  const wordmarkHeight = size * 0.62;
  const wordmarkWidth = wordmarkHeight * 4.4718;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <circle cx="50" cy="50" r="46" stroke={ringColor} strokeWidth="3" opacity="0.25" />
        <circle cx="50" cy="50" r="33" stroke={ringColor} strokeWidth="3" opacity="0.45" />
        <circle cx="50" cy="50" r="20" stroke={ringColor} strokeWidth="3" opacity="0.7" />

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

        <circle cx="50" cy="50" r="6" fill={dotColor} />

        <style>{`
          @keyframes th-radar-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </svg>

      {withWordmark && (
        <img
          src={wordmarkSrc}
          alt="TraceHub Inventory"
          style={{ height: wordmarkHeight, width: wordmarkWidth }}
        />
      )}
    </div>
  );
}
