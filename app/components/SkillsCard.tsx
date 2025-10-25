// components/SymmetricCyberCard.tsx
import React from 'react';

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function SkillsCard({ className = '', children }: Props) {
  // Exact symmetrical polygon (square-friendly)
  const clip = `
    polygon(
      0% 15%,
      5% 10%,
      20% 10%,
      25% 5%,
      75% 5%,
      80% 10%,
      95% 10%,
      100% 15%,
      100% 85%,
      95% 90%,
      80% 90%,
      75% 95%,
      25% 95%,
      20% 90%,
      5% 90%,
      0% 85%
    )
  `;

  // Same polygon as normalized SVG points (100x100 viewBox)
  const svgPoints = `
    0,15 5,10 20,10 25,5 75,5 80,10 95,10 100,15
    100,85 95,90 80,90 75,95 25,95 20,90 5,90 0,85
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={`relative ${className}`}>
      {/* Base panel: flat, monochrome, 2D */}
      <div
        className="
          absolute inset-0
          bg-white/[0.03]
          ring-1 ring-inset ring-white/20
          shadow-none
        "
        style={{ clipPath: clip as any }}
      />

      {/* Scanline overlay (monochrome) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          clipPath: clip as any,
          background:
            // horizontal scanlines, 2px line + 4px gap, grayscale only
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 6px)',
        }}
      />

      {/* Subtle edge sheen (monochrome linear gradient) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: clip as any,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 35%, rgba(0,0,0,0.12) 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.20)',
        }}
      />

      {/* SVG outline: thin + dashed for cyber accent */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Solid hairline */}
        <polygon
          points={svgPoints}
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="0.8"
          strokeLinejoin="miter"
        />
        {/* Dashed accent on same path */}
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
        className="absolute inset-0 p-8 text-white"
        style={{ clipPath: clip as any }}
      >
        {children}
      </div>

      {/* Flat vignette (no blur), monochrome halo */}
      <div
        className="absolute inset-0 -z-10 opacity-35"
        style={{
          clipPath: clip as any,
          transform: 'scale(1.02)',
          background:
            'radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.08), rgba(255,255,255,0) 70%)',
        }}
      />
    </div>
  );
}
