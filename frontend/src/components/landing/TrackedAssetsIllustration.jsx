/**
 * Original flat illustration: a shelf of tagged equipment, one crate marked
 * as located. Pairs with the "built for real operations" section - stands
 * in for a stock photo of a warehouse without the licensing/hotlinking risk.
 */
export default function TrackedAssetsIllustration() {
  const crate = (x, tone) => (
    <g transform={`translate(${x}, 0)`}>
      <rect x="0" y="30" width="86" height="70" rx="8" fill={tone.fill} stroke={tone.stroke} strokeWidth="2" />
      <path d={`M 0 46 L 86 46`} stroke={tone.stroke} strokeWidth="2" opacity="0.5" />
      <rect x="16" y="58" width="24" height="24" rx="4" fill="white" stroke={tone.stroke} strokeWidth="2" />
      <rect x="21" y="63" width="5" height="5" fill={tone.stroke} />
      <rect x="30" y="63" width="5" height="5" fill={tone.stroke} />
      <rect x="21" y="72" width="5" height="5" fill={tone.stroke} />
    </g>
  );

  return (
    <svg viewBox="0 0 420 220" className="w-full h-auto max-w-md mx-auto" aria-hidden="true">
      {/* shelf */}
      <rect x="10" y="130" width="400" height="10" rx="3" fill="#A3C3E7" />
      <rect x="10" y="176" width="400" height="10" rx="3" fill="#A3C3E7" />
      <rect x="26" y="0" width="10" height="186" fill="#D1E1F3" />
      <rect x="384" y="0" width="10" height="186" fill="#D1E1F3" />

      <g transform="translate(50, 10)">
        {crate(0, { fill: '#EAF1FA', stroke: '#75A5DB' })}
        {crate(110, { fill: '#EAF1FA', stroke: '#75A5DB' })}

        {/* the "located" crate, highlighted */}
        <g transform="translate(220, 0)">
          <rect x="-4" y="26" width="94" height="78" rx="10" fill="#7ED957" opacity="0.12" />
          <rect x="0" y="30" width="86" height="70" rx="8" fill="#F0FBEA" stroke="#5CB93A" strokeWidth="2.5" />
          <path d="M 0 46 L 86 46" stroke="#5CB93A" strokeWidth="2" opacity="0.5" />
          <rect x="16" y="58" width="24" height="24" rx="4" fill="white" stroke="#5CB93A" strokeWidth="2" />
          <rect x="21" y="63" width="5" height="5" fill="#5CB93A" />
          <rect x="30" y="63" width="5" height="5" fill="#5CB93A" />
          <rect x="21" y="72" width="5" height="5" fill="#5CB93A" />
          {/* located badge */}
          <circle cx="80" cy="24" r="13" fill="#5CB93A" />
          <path d="M 74 24 L 78 28 L 87 19" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}
