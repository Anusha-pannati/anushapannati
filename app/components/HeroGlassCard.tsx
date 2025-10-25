import React from 'react';

type Props = {
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

export default function HeroGlassCard({ className = '', children }: Props) {
  // ✅ exact clipPath as specified
  const clip =
    'polygon(0% 32.07%, 0% 13.54%, 6.24% 0%, 44.67% 0%, 91.75% 0%, 100% 14.3%, 100% 91.5%, 94.64% 100%, 72.98% 100%, 68.38% 94.85%, 9.87% 94.85%, 2.84% 84.53%, 2.84% 42.05%)';

  // same points for SVG outline
  const svgPoints =
    '0,32.07 0,13.54 6.24,0 44.67,0 91.75,0 100,14.3 100,91.5 94.64,100 72.98,100 68.38,94.85 9.87,94.85 2.84,84.53 2.84,42.05';

  return (
    <div className={`relative ${className}`}>
      {/* Base panel */}
      <div
        className="absolute inset-0 bg-white/[0.03] ring-1 ring-inset ring-white/20 shadow-none"
        style={{ clipPath: clip }}
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          clipPath: clip,
          background:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 6px)',
        }}
      />

      {/* Edge sheen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: clip,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 35%, rgba(0,0,0,0.12) 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.20)',
        }}
      />

      {/* SVG outline */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon
          points={svgPoints}
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="0.6"
          strokeLinejoin="miter"
        />
        <polygon
          points={svgPoints}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.6"
          strokeLinejoin="miter"
          strokeDasharray="3 3"
        />
      </svg>

      {/* Content slot */}
      <div
        className="absolute inset-0 p-8 md:p-12 lg:p-16 text-white"
        style={{ clipPath: clip }}
      >
        {children}
      </div>

      {/* Outer halo */}
      <div
        className="absolute inset-0 -z-10 opacity-35"
        style={{
          clipPath: clip,
          transform: 'scale(1.02)',
          background:
            'radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.08), rgba(255,255,255,0) 70%)',
        }}
      />
    </div>
  );
}
