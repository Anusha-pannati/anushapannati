// components/SplitGlassCard.tsx
import React from 'react';

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function SplitGlassCard({ className, children }: Props) {
  // Symmetrical vertical split polygon
  const fullClip = `
    polygon(
      100% 100%, 
      99.71% 55.39%, 
      94.74% 50.14%, 
      100% 45.17%, 
      100% 0%, 
      0% 0%, 
      0% 45.04%, 
      4.7% 50.14%, 
      0% 54.46%, 
      0% 100%
    )
  `;

  // SVG outline for the full shape
  const svgPoints = `
    100,100 99.71,55.39 94.74,50.14 100,45.17 100,0 0,0 
    0,45.04 4.7,50.14 0,54.46 0,100
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={`relative ${className}`}>
      {/* Full base panel with glassmorphism */}
      <div
        className="
          absolute inset-0
          bg-white/[0.03]
          ring-1 ring-inset ring-white/20
          shadow-none
        "
        style={{ clipPath: fullClip }}
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          clipPath: fullClip,
          background: [
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 6px)',
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)',
          ].join(', '),
        }}
      />

      {/* Edge sheen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: fullClip,
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
          strokeWidth="0.8"
          strokeLinejoin="miter"
        />
        <polygon
          points={svgPoints}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.8"
          strokeLinejoin="miter"
          strokeDasharray="3 3"
        />
      </svg>

      {/* Content slot */}
      <div
        className="absolute inset-0 p-6 text-white"
        style={{ clipPath: fullClip }}
      >
        {children}
      </div>

      {/* Outer halo (vignette) */}
      <div
        className="absolute inset-0 -z-10 opacity-35"
        style={{
          clipPath: fullClip,
          transform: 'scale(1.02)',
          background:
            'radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.08), rgba(255,255,255,0) 70%)',
        }}
      />
    </div>
  );
}
