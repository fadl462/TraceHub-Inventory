import { useEffect, useRef, useState } from 'react';

/**
 * The page's signature moment: a literal visualization of "know where every
 * asset is, always." Each tracked asset moves independently around its own
 * ring at its own speed and direction - genuinely simulating scattered
 * equipment - while a radar beam continuously sweeps. Whenever the beam
 * passes over an asset, that asset lights up (colour shift + glow + its
 * label surfaces), then fades back as the beam moves on. This is driven by
 * a real animation loop (not just CSS keyframes) so the "sweep hits asset"
 * moment is an actual computed collision, not a coincidence.
 */
const SWEEP_SECONDS = 7;
// The SVG wedge path itself points from the top toward up-right before any
// rotation is applied - its true center angle (in the same 0=east,
// clockwise-positive convention used for asset angles below) is ~ -71.8deg,
// not 0. The rotation transform is added ON TOP of that base angle, so
// collision detection has to use (baseAngle + currentRotation), not the
// rotation amount alone - using the rotation alone was the bug that made
// assets light up at the wrong moment.
const SWEEP_BASE_ANGLE = -71.8;
const HALF_BEAM_DEG = 15; // matches the wedge's real half-width (~18.2deg), slightly tighter so the glow reads as precise
const FADE_SECONDS = 1.3; // how long a label lingers after being scanned

const ASSETS = [
  { id: 'a1', label: 'Dell Latitude 5420', sub: 'Accra HQ', radius: 14, angle0: 40, degPerSec: 9 },
  { id: 'a2', label: 'Toyota Hilux · GR-4471-24', sub: 'En route · Kumasi', radius: 26, angle0: 190, degPerSec: -6.5 },
  { id: 'a3', label: 'Generator Unit 04', sub: 'Warehouse B', radius: 38, angle0: 300, degPerSec: 4.5 },
  { id: 'a4', label: 'Forklift 02', sub: 'Loading Bay', radius: 46, angle0: 120, degPerSec: -8 },
];

function norm360(deg) {
  return ((deg % 360) + 360) % 360;
}

function angularDistance(a, b) {
  const d = Math.abs(norm360(a) - norm360(b));
  return Math.min(d, 360 - d);
}

export default function RadarLocateVisual() {
  const [tick, setTick] = useState(0); // forces re-render; actual values read from refs each frame
  const stateRef = useRef({
    startTime: null,
    sweepDeg: 0,
    assets: ASSETS.map((a) => ({ ...a, x: 50, y: 50, lit: false, lastHitAt: -Infinity })),
  });
  const rafRef = useRef(null);
  const frameCountRef = useRef(0);

  useEffect(() => {
    function frame(now) {
      const s = stateRef.current;
      if (s.startTime === null) s.startTime = now;
      const t = (now - s.startTime) / 1000; // seconds elapsed

      s.sweepDeg = norm360((t / SWEEP_SECONDS) * 360);
      const sweepPointingAngle = norm360(SWEEP_BASE_ANGLE + s.sweepDeg);

      s.assets.forEach((asset) => {
        const angle = norm360(asset.angle0 + asset.degPerSec * t);
        const rad = (angle * Math.PI) / 180;
        asset.x = 50 + asset.radius * Math.cos(rad);
        asset.y = 50 + asset.radius * Math.sin(rad);

        const dist = angularDistance(angle, sweepPointingAngle);
        const wasLit = asset.lit;
        asset.lit = dist < HALF_BEAM_DEG;
        if (asset.lit && !wasLit) asset.lastHitAt = t;
        asset.labelOpacity = asset.lit
          ? 1
          : Math.max(0, 1 - (t - asset.lastHitAt) / FADE_SECONDS);
      });

      // Throttle re-renders to ~30fps - plenty smooth, half the render cost
      frameCountRef.current += 1;
      if (frameCountRef.current % 2 === 0) setTick((n) => n + 1);

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const { sweepDeg, assets } = stateRef.current;

  return (
    <div className="relative w-full aspect-square max-w-[460px] mx-auto select-none">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_60px_rgba(77,163,255,0.25)]">
        <circle cx="50" cy="50" r="46" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.12" fill="none" />
        <circle cx="50" cy="50" r="38" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.14" fill="none" />
        <circle cx="50" cy="50" r="26" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.18" fill="none" />
        <circle cx="50" cy="50" r="14" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.24" fill="none" />

        <g style={{ transform: `rotate(${sweepDeg}deg)`, transformOrigin: '50px 50px' }}>
          <path d="M 50 50 L 50 2 A 48 48 0 0 1 78 12 Z" fill="url(#sweepGrad)" />
        </g>

        <defs>
          <linearGradient id="sweepGrad" x1="50" y1="50" x2="78" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#4DA3FF" stopOpacity="0.55" />
            <stop offset="1" stopColor="#4DA3FF" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="litGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7ED957" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7ED957" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="2.4" fill="#7ED957" />

        {assets.map((a) => (
          <g key={a.id}>
            {a.lit && <circle cx={a.x} cy={a.y} r="6" fill="url(#litGlow)" />}
            <circle
              cx={a.x}
              cy={a.y}
              r={a.lit ? 2.1 : 1.4}
              fill={a.lit ? '#7ED957' : '#8CC2FF'}
              opacity={a.lit ? 1 : 0.55}
              style={{ transition: 'r 150ms ease-out, fill 150ms ease-out' }}
            />
          </g>
        ))}
      </svg>

      {assets.map((a) => (
        a.labelOpacity > 0.02 && (
          <div
            key={a.id}
            className="absolute -translate-x-1/2 flex items-center gap-2 bg-white/95 backdrop-blur rounded-full pl-2 pr-3.5 py-1.5 shadow-lg ring-1 ring-black/5 whitespace-nowrap pointer-events-none"
            style={{
              left: `${a.x}%`,
              top: `${a.y}%`,
              transform: `translate(-50%, ${a.y > 50 ? '4px' : '-100%'})`,
              opacity: a.labelOpacity,
            }}
          >
            <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
            <span className="font-mono text-[11px] leading-tight text-ink">
              <span className="font-medium">{a.label}</span>
              <span className="text-ink/45"> · {a.sub}</span>
            </span>
          </div>
        )
      ))}
    </div>
  );
}
