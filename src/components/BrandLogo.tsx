import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 30, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 40, text: 'text-xl', sub: 'text-xs' },
    lg: { icon: 54, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 72, text: 'text-3xl', sub: 'text-sm' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Behance Hexagon Logo with Chart Bars & Green Check Badge */}
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg
          width={current.icon}
          height={current.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg filter transition-transform duration-300 hover:scale-105"
        >
          {/* Hexagon Base with Gradient */}
          <defs>
            <linearGradient id="logoHexGrad" x1="15" y1="10" x2="85" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="0.6" stopColor="#246BFD" />
              <stop offset="1" stopColor="#1D4ED8" />
            </linearGradient>
            <filter id="hexGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#246BFD" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Hexagon Path */}
          <path
            d="M50 8
               L86 28.5
               Q90 31 90 35.5
               L90 64.5
               Q90 69 86 71.5
               L50 92
               Q46 94.5 42 92
               L14 71.5
               Q10 69 10 64.5
               L10 35.5
               Q10 31 14 28.5
               L42 8
               Q46 5.5 50 8 Z"
            fill="url(#logoHexGrad)"
            filter="url(#hexGlow)"
          />

          {/* 3 Ascending Vertical Chart Bars */}
          <rect x="29" y="52" width="9" height="20" rx="4.5" fill="white" fillOpacity="0.95" />
          <rect x="45.5" y="40" width="9" height="32" rx="4.5" fill="white" fillOpacity="0.95" />
          <rect x="62" y="28" width="9" height="44" rx="4.5" fill="white" fillOpacity="0.95" />

          {/* Top Right Green Check Badge */}
          <circle cx="82" cy="18" r="12" fill="#22C55E" />
          <path
            d="M76 18.5 L80 22.5 L88 14.5"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-poppins font-bold tracking-tight text-white leading-tight ${current.text}`}>
            To do list
          </span>
          <span className={`text-brand-300/80 font-medium tracking-wide uppercase ${current.sub}`}>
            Task Master
          </span>
        </div>
      )}
    </div>
  );
};
