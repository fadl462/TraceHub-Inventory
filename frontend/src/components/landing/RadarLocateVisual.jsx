import { useMemo } from 'react';

/**
 * The page's signature moment: a literal visualization of "know where every
 * asset is, always." A radar sweep continuously rotates behind three asset
 * chips; each chip's pulse animation is time-offset to roughly match the
 * moment the sweep passes its angle, so it reads as "just been located."
 */
const SWEEP_SECONDS = 6;

const ASSETS = [
  { label: 'Dell Latitude 5420', sub: 'Accra HQ', angleDeg: 35, radiusPct: 78 },
  { label: 'Toyota Hilux · GR-4471-24', sub: 'En route · Kumasi', angleDeg: 165, radiusPct: 88 },
  { label: 'Generator Unit 04', sub: 'Warehouse B', angleDeg: 265, radiusPct: 70 },
];

function polarToPct(angleDeg, radiusPct) {
  const rad = (angleDeg * Math.PI) / 180;
  const x = 50 + radiusPct * 0.5 * Math.cos(rad);
  const y = 50 + radiusPct * 0.5 * Math.sin(rad);
  return { left: `${x}%`, top: `${y}%` };
}

export default function RadarLocateVisual() {
  const chips = useMemo(
    () => ASSETS.map((a) => ({
      ...a,
      pos: polarToPct(a.angleDeg, a.radiusPct),
      delay: -(((a.angleDeg + 270) % 360) / 360) * SWEEP_SECONDS,
    })),
    [],
  );

  return (
    <div className="relative w-full aspect-square max-w-[440px] mx-auto select-none">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_60px_rgba(77,163,255,0.25)]">
        <circle cx="50" cy="50" r="48" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.12" fill="none" />
        <circle cx="50" cy="50" r="36" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.16" fill="none" />
        <circle cx="50" cy="50" r="24" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.22" fill="none" />
        <circle cx="50" cy="50" r="12" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.3" fill="none" />

        <g style={{ transformOrigin: '50px 50px', animation: `th-sweep ${SWEEP_SECONDS}s linear infinite` }}>
          <path d="M 50 50 L 50 2 A 48 48 0 0 1 78 12 Z" fill="url(#sweepGrad)" />
        </g>

        <defs>
          <linearGradient id="sweepGrad" x1="50" y1="50" x2="78" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#4DA3FF" stopOpacity="0.55" />
            <stop offset="1" stopColor="#4DA3FF" stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="2.4" fill="#7ED957" />

        <style>{`
          @keyframes th-sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes th-ping {
            0%   { box-shadow: 0 0 0 0 rgba(126,217,87,0.55); }
            70%  { box-shadow: 0 0 0 10px rgba(126,217,87,0); }
            100% { box-shadow: 0 0 0 0 rgba(126,217,87,0); }
          }
        `}</style>
      </svg>

      {chips.map((chip, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/95 backdrop-blur rounded-full pl-2 pr-3.5 py-1.5 shadow-lg ring-1 ring-black/5 whitespace-nowrap"
          style={chip.pos}
        >
          <span
            className="w-2 h-2 rounded-full bg-accent shrink-0"
            style={{ animation: `th-ping ${SWEEP_SECONDS}s ease-out infinite`, animationDelay: `${chip.delay}s` }}
          />
          <span className="font-mono text-[11px] leading-tight text-ink">
            <span className="font-medium">{chip.label}</span>
            <span className="text-ink/45"> · {chip.sub}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
