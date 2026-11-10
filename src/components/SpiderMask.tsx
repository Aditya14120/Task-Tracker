import React, { useState } from 'react';
import { SuitTheme } from '../types/todo';
import { sound } from '../utils/audio';

interface SpiderMaskProps {
  suit: SuitTheme;
  isSpiderSenseAlert?: boolean;
  className?: string;
  size?: number;
}

export const SpiderMask: React.FC<SpiderMaskProps> = ({
  suit,
  isSpiderSenseAlert = false,
  className = '',
  size = 56,
}) => {
  const [isWinking, setIsWinking] = useState(false);

  const handleClick = () => {
    setIsWinking(true);
    sound.playSpiderSense();
    setTimeout(() => setIsWinking(false), 600);
  };

  const isSymbiote = suit.id === 'symbiote';
  const maskBaseColor = isSymbiote ? '#090d16' : '#dc2626';
  const webStrokeColor = isSymbiote ? '#334155' : '#1e1e24';
  const lensFill = isSymbiote ? '#f1f5f9' : '#ffffff';
  const lensBorder = isSymbiote ? '#020617' : '#09090b';

  return (
    <div
      onClick={handleClick}
      title="Click to trigger Spider-Sense!"
      className={`relative inline-flex items-center justify-center cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Spider-Sense Radiating Comic Waves */}
      {isSpiderSenseAlert && (
        <svg
          className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] pointer-events-none animate-pulse"
          viewBox="0 0 120 120"
          fill="none"
        >
          <path d="M20 30 Q12 18 28 10" stroke="#eab308" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M36 16 Q30 4 48 4" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <path d="M100 30 Q108 18 92 10" stroke="#eab308" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M84 16 Q90 4 72 4" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}

      {/* Spider-Man Mask SVG */}
      <svg
        viewBox="0 0 100 110"
        className="w-full h-full drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mask Head Shape */}
        <path
          d="M50 4C26 4 10 26 10 56C10 82 32 104 50 106C68 104 90 82 90 56C90 26 74 4 50 4Z"
          fill={maskBaseColor}
          stroke={suit.surfaceBorder}
          strokeWidth="2"
        />

        {/* Webbing Lines across Mask (Classic Suit) */}
        {!isSymbiote && (
          <g stroke={webStrokeColor} strokeWidth="1.2" opacity="0.65" strokeLinecap="round">
            <path d="M50 4V106" />
            <path d="M50 48L18 20" />
            <path d="M50 48L82 20" />
            <path d="M50 48L10 56" />
            <path d="M50 48L90 56" />
            <path d="M50 48L18 88" />
            <path d="M50 48L82 88" />
            <path d="M38 24C44 28 56 28 62 24" />
            <path d="M28 36C40 42 60 42 72 36" />
            <path d="M22 66C38 60 62 60 78 66" />
            <path d="M30 82C42 76 58 76 70 82" />
          </g>
        )}

        {/* Symbiote Tendril Highlights */}
        {isSymbiote && (
          <g opacity="0.8">
            <path
              d="M50 16C46 28 38 34 32 38M50 16C54 28 62 34 68 38"
              stroke="#475569"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M50 78C46 88 38 96 32 100M50 78C54 88 62 96 68 100"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.6"
            />
          </g>
        )}

        {/* Left Eye Lens */}
        <g
          className="transition-transform origin-[32px_50px] duration-200"
          style={{ transform: isWinking ? 'scaleY(0.18)' : 'scale(1)' }}
        >
          <path
            d="M45 42C38 36 24 40 20 54C19 58 24 68 33 68C42 68 47 52 45 42Z"
            fill={lensBorder}
          />
          <path
            d="M43 44C37 39 26 42 22 54C21 57 25 65 33 65C40 65 44 52 43 44Z"
            fill={lensFill}
          />
          <path
            d="M39 46C35 43 28 45 25 53"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>

        {/* Right Eye Lens */}
        <g
          className="transition-transform origin-[68px_50px] duration-200"
          style={{ transform: isWinking ? 'scaleY(0.95)' : 'scale(1)' }}
        >
          <path
            d="M55 42C62 36 76 40 80 54C81 58 76 68 67 68C58 68 53 52 55 42Z"
            fill={lensBorder}
          />
          <path
            d="M57 44C63 39 74 42 78 54C79 57 75 65 67 65C60 65 56 52 57 44Z"
            fill={lensFill}
          />
          <path
            d="M61 46C65 43 72 45 75 53"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>
      </svg>
    </div>
  );
};
