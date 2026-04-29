import React from 'react';
// DiamondLoader — brand loading animation.
//   • Brilliant-cut diamond at center, rotates and gently breathes
//   • Eight gilt sparkles orbit at varied radii, fading in/out on staggered loops
//   • Two shapes: <DiamondLoader/> for inline use; <DiamondLoaderScreen/> as a
//     full-bleed boot/transition splash.

const DL_GILT     = '#C9A77A';
const DL_GILT_DK  = '#9B7148';
const DL_INK      = '#2F3430';
const DL_INK_SOFT = '#6E655C';
const DL_BG_TOP    = '#FAF8F4';
const DL_BG_BOTTOM = '#F2EAD8';

// Sparkle constellation around the diamond. Positions are %-relative to the
// outer canvas. Mixed sizes / delays so the orbit feels organic, not metronomic.
const SPARKLES = [
  { x: 14, y: 18, size: 10, delay: 0.0,  duration: 1.6 },
  { x: 86, y: 14, size: 12, delay: 0.4,  duration: 1.8 },
  { x: 6,  y: 52, size: 8,  delay: 0.2,  duration: 1.4 },
  { x: 94, y: 50, size: 9,  delay: 0.65, duration: 1.5 },
  { x: 16, y: 84, size: 11, delay: 0.9,  duration: 1.7 },
  { x: 84, y: 88, size: 9,  delay: 1.1,  duration: 1.6 },
  { x: 50, y: 3,  size: 7,  delay: 0.3,  duration: 1.5 },
  { x: 50, y: 97, size: 8,  delay: 0.75, duration: 1.6 },
];

function DiamondLoader({ size = 96, label }) {
  return (
    <div style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 14,
    }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {SPARKLES.map((s, i) => (
          <span key={i} style={{
            position: 'absolute',
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            transform: 'translate(-50%, -50%)',
            animation: `dl-sparkle ${s.duration}s ease-in-out ${s.delay}s infinite both`,
            color: DL_GILT,
            filter: `drop-shadow(0 0 4px ${DL_GILT}AA)`,
            pointerEvents: 'none',
          }}>
            <SparkleIcon/>
          </span>
        ))}
        <div style={{
          position: 'absolute', inset: '22%',
          animation: 'dl-rotate 7s linear infinite, dl-breathe 2.4s ease-in-out infinite',
          filter: `drop-shadow(0 6px 14px rgba(107,74,46,0.32))`,
        }}>
          <DiamondIcon/>
        </div>
      </div>

      {label && (
        <div style={{
          fontFamily: `'Manrope', sans-serif`,
          fontSize: 11, fontWeight: 700, letterSpacing: 2.2,
          color: DL_INK_SOFT, textTransform: 'uppercase',
        }}>{label}</div>
      )}

      <style>{`
        @keyframes dl-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes dl-breathe {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
        @keyframes dl-sparkle {
          0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.4) rotate(0deg); }
          50%      { opacity: 1; transform: translate(-50%, -50%) scale(1)   rotate(45deg); }
        }
      `}</style>
    </div>
  );
}

function DiamondIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <linearGradient id="dl-dia-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FFFFFF"/>
          <stop offset="40%"  stopColor="#F4E5C7"/>
          <stop offset="100%" stopColor={DL_GILT}/>
        </linearGradient>
        <linearGradient id="dl-dia-table" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.85)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0.10)"/>
        </linearGradient>
      </defs>

      {/* Diamond silhouette (kite) */}
      <polygon
        points="50,8 90,42 50,92 10,42"
        fill="url(#dl-dia-fill)"
        stroke={DL_GILT_DK} strokeWidth="1.4" strokeLinejoin="round"
      />

      {/* Crown — top half table */}
      <polygon
        points="50,8 90,42 50,42 10,42"
        fill="url(#dl-dia-table)"
      />

      {/* Inner highlight gleam */}
      <polygon
        points="50,8 65,28 50,42 35,28"
        fill="rgba(255,255,255,0.55)"
      />

      {/* Facet lines */}
      <line x1="50" y1="8"  x2="50" y2="92" stroke="rgba(107,74,46,0.35)" strokeWidth="0.6"/>
      <line x1="10" y1="42" x2="90" y2="42" stroke="rgba(107,74,46,0.35)" strokeWidth="0.6"/>
      <line x1="10" y1="42" x2="50" y2="92" stroke="rgba(107,74,46,0.30)" strokeWidth="0.5"/>
      <line x1="90" y1="42" x2="50" y2="92" stroke="rgba(107,74,46,0.30)" strokeWidth="0.5"/>
      <line x1="30" y1="42" x2="50" y2="92" stroke="rgba(107,74,46,0.20)" strokeWidth="0.4"/>
      <line x1="70" y1="42" x2="50" y2="92" stroke="rgba(107,74,46,0.20)" strokeWidth="0.4"/>
      <line x1="30" y1="25" x2="50" y2="42" stroke="rgba(107,74,46,0.20)" strokeWidth="0.4"/>
      <line x1="70" y1="25" x2="50" y2="42" stroke="rgba(107,74,46,0.20)" strokeWidth="0.4"/>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
      <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"/>
    </svg>
  );
}

// Full-bleed boot / transition screen.
function DiamondLoaderScreen({ label = 'Polishing your experience', size = 124 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: `linear-gradient(180deg, ${DL_BG_TOP} 0%, ${DL_BG_BOTTOM} 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 24,
      animation: 'dl-fade 280ms ease',
    }}>
      <DiamondLoader size={size}/>
      {label && (
        <div style={{
          fontFamily: `'Noto Serif', serif`,
          fontSize: 13, fontWeight: 600, letterSpacing: 2.4,
          color: DL_INK, textTransform: 'uppercase',
        }}>{label}</div>
      )}
      <style>{`
        @keyframes dl-fade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

window.DiamondLoader       = DiamondLoader;
window.DiamondLoaderScreen = DiamondLoaderScreen;
