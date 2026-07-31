/**
 * Original line-art illustration: a phone scanning an asset's QR tag.
 * Built to match the radar mark's stroke-based visual language rather than
 * using a stock photo of someone holding a device.
 */
export default function ScanIllustration() {
  return (
    <svg viewBox="0 0 320 320" className="w-full h-auto max-w-sm mx-auto" aria-hidden="true">
      {/* Asset crate the code sits on */}
      <rect x="40" y="180" width="150" height="100" rx="10" fill="#EAF1FA" stroke="#A3C3E7" strokeWidth="2" />
      <line x1="40" y1="215" x2="190" y2="215" stroke="#A3C3E7" strokeWidth="2" />

      {/* QR tag on the crate */}
      <g transform="translate(65, 216)">
        <rect width="54" height="54" rx="6" fill="white" stroke="#1A4D8F" strokeWidth="2" />
        {[[6,6],[24,6],[42,6],[6,24],[15,15],[33,24],[6,42],[24,42],[42,42],[15,33]].map(([x,y], i) => (
          <rect key={i} x={x} y={y} width="6" height="6" fill="#1A4D8F" />
        ))}
      </g>

      {/* Phone */}
      <g transform="translate(150, 40)">
        <rect x="0" y="0" width="120" height="220" rx="20" fill="#0A1F3A" />
        <rect x="8" y="12" width="104" height="188" rx="10" fill="#F4F7FA" />

        {/* viewfinder brackets */}
        <g stroke="#4DA3FF" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M 24 40 L 24 28 L 36 28" />
          <path d="M 96 40 L 96 28 L 84 28" />
          <path d="M 24 160 L 24 172 L 36 172" />
          <path d="M 96 160 L 96 172 L 84 172" />
        </g>

        {/* scanning beam, animated */}
        <rect x="24" y="40" width="72" height="4" rx="2" fill="#4DA3FF">
          <animate attributeName="y" values="40;158;40" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.4;1" dur="2.6s" repeatCount="indefinite" />
        </rect>

        <circle cx="60" cy="100" r="4" fill="#7ED957">
          <animate attributeName="opacity" values="0;0;1;1;0" dur="2.6s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* connecting scan line from phone to crate tag */}
      <path d="M 175 200 Q 140 210 118 236" stroke="#7ED957" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.6" />
    </svg>
  );
}
