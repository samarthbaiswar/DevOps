import React from 'react';

export const RocketIllustration: React.FC<{ className?: string }> = ({ className = 'w-44 h-44' }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="circleBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#246BFD" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#142453" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="rocketBody" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="100%" stopColor="#EE5253" />
      </linearGradient>
      <linearGradient id="rocketFlame" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FF9F43" />
        <stop offset="100%" stopColor="#FECA57" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Ambient Glow */}
    <circle cx="100" cy="100" r="90" fill="url(#circleBg)" />
    
    {/* Floating clouds */}
    <ellipse cx="60" cy="140" rx="32" ry="16" fill="#FFFFFF" fillOpacity="0.85" />
    <ellipse cx="85" cy="148" rx="24" ry="14" fill="#FFFFFF" fillOpacity="0.9" />
    <ellipse cx="140" cy="80" rx="28" ry="14" fill="#FFFFFF" fillOpacity="0.7" />

    {/* Rocket Exhaust Trail */}
    <path d="M78 128 Q60 155 45 170 Q70 160 90 138 Z" fill="url(#rocketFlame)" />
    <circle cx="70" cy="145" r="7" fill="#FECA57" fillOpacity="0.8" />
    <circle cx="58" cy="160" r="4" fill="#FF9F43" fillOpacity="0.6" />

    {/* Rocket Fuselage */}
    <g transform="rotate(-35 105 95)">
      {/* Fin Left */}
      <path d="M85 110 L68 130 L90 125 Z" fill="#246BFD" />
      {/* Fin Right */}
      <path d="M125 110 L142 130 L120 125 Z" fill="#1D4ED8" />
      
      {/* Rocket Main Shell */}
      <path d="M88 120 C88 65 105 40 105 40 C105 40 122 65 122 120 Z" fill="url(#rocketBody)" />
      
      {/* Porthole Window */}
      <circle cx="105" cy="78" r="14" fill="#1E293B" stroke="#FFFFFF" strokeWidth="3" />
      <circle cx="105" cy="78" r="9" fill="#38BDF8" />
      <circle cx="108" cy="75" r="3" fill="#FFFFFF" />

      {/* Thruster Base */}
      <rect x="95" y="120" width="20" height="7" rx="3" fill="#334155" />
    </g>

    {/* Floating stars */}
    <circle cx="155" cy="45" r="3" fill="#FFD166" />
    <circle cx="45" cy="65" r="2.5" fill="#FFD166" />
    <circle cx="160" cy="130" r="3" fill="#60A5FA" />
  </svg>
);

export const CelebrationIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Floating Confetti Shapes matching Behance screenshot */}
    <g opacity="0.9">
      {/* Triangles */}
      <polygon points="40,35 48,50 32,50" fill="#34D399" />
      <polygon points="160,40 170,55 152,54" fill="#F472B6" />
      <polygon points="175,135 185,150 168,152" fill="#F472B6" />
      <polygon points="30,140 42,150 25,158" fill="#60A5FA" />

      {/* Donuts / Rings */}
      <circle cx="70" cy="45" r="6" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
      <circle cx="140" cy="60" r="8" stroke="#A78BFA" strokeWidth="3" fill="none" />
      <circle cx="165" cy="95" r="7" stroke="#34D399" strokeWidth="2.5" fill="none" />
      <circle cx="35" cy="100" r="5" stroke="#F87171" strokeWidth="2" fill="none" />
      
      {/* Diamonds & Stars */}
      <rect x="50" y="160" width="8" height="8" rx="1.5" transform="rotate(45 54 164)" fill="#38BDF8" />
      <rect x="135" y="160" width="9" height="9" rx="1.5" transform="rotate(25 139 164)" fill="#FBBF24" />
    </g>

    {/* Center Character - Victorious Runner / Joyful Pose */}
    <g transform="translate(60, 50)">
      {/* Head */}
      <circle cx="40" cy="18" r="14" fill="#FCD34D" />
      {/* Hair bun */}
      <circle cx="48" cy="10" r="7" fill="#4B5563" />
      <path d="M30 18 C30 9 40 8 48 10 C50 16 46 22 40 22 C34 22 30 20 30 18 Z" fill="#374151" />

      {/* Blue Sweater / Torso */}
      <path d="M22 32 C26 30 54 30 58 32 L64 68 C64 72 16 72 16 68 Z" fill="#246BFD" />

      {/* Arms out in celebration */}
      <path d="M22 36 L0 25 C-3 23 -4 18 -1 15 C2 12 7 13 9 16 L22 30" stroke="#FCD34D" strokeWidth="6" strokeLinecap="round" />
      <path d="M58 36 L80 25 C83 23 87 25 88 28 C89 31 87 35 84 37 L62 48" stroke="#FCD34D" strokeWidth="6" strokeLinecap="round" />

      {/* Legs running forward */}
      <path d="M26 68 L15 95 L2 98" stroke="#334155" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 68 L62 88 L78 94" stroke="#334155" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />

      {/* Shoes */}
      <ellipse cx="2" cy="98" rx="6" ry="3.5" fill="#E2E8F0" />
      <ellipse cx="78" cy="94" rx="6" ry="3.5" fill="#E2E8F0" />
    </g>
  </svg>
);

export const EmptyTasksIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-36' }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="80" cy="80" r="70" fill="#246BFD" fillOpacity="0.08" />
    <rect x="42" y="38" width="76" height="92" rx="14" fill="#252834" stroke="#2E3344" strokeWidth="2.5" />
    {/* Clipboard Header */}
    <rect x="58" y="30" width="44" height="14" rx="7" fill="#246BFD" />
    <circle cx="80" cy="37" r="3.5" fill="#FFFFFF" />

    {/* Task Check Lines */}
    <g transform="translate(54, 58)">
      <circle cx="6" cy="6" r="6" fill="#22C55E" />
      <path d="M3.5 6 L5.2 7.8 L8.5 4.5" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="18" y="3" width="42" height="6" rx="3" fill="#8E94A7" fillOpacity="0.4" />
    </g>
    <g transform="translate(54, 80)">
      <circle cx="6" cy="6" r="6" fill="#22C55E" />
      <path d="M3.5 6 L5.2 7.8 L8.5 4.5" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="18" y="3" width="34" height="6" rx="3" fill="#8E94A7" fillOpacity="0.4" />
    </g>
    <g transform="translate(54, 102)">
      <circle cx="6" cy="6" r="6" stroke="#779FF2" strokeWidth="1.5" fill="none" />
      <rect x="18" y="3" width="46" height="6" rx="3" fill="#779FF2" fillOpacity="0.6" />
    </g>

    {/* Sparkles */}
    <circle cx="128" cy="46" r="2.5" fill="#FFB524" />
    <circle cx="32" cy="116" r="3" fill="#22C55E" />
  </svg>
);
