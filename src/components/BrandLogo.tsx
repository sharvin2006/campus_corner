import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const iconPixelSize =
    size === 'sm' ? 36 : size === 'lg' ? 52 : size === 'xl' ? 68 : 44;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Original Campus Link Emblem Card from Picture11.png */}
      <div
        className="relative flex items-center justify-center rounded-2xl bg-white border border-slate-200/90 shadow-md shadow-cyan-950/20 p-1 shrink-0 overflow-hidden group transition-transform hover:scale-105"
        style={{ width: iconPixelSize, height: iconPixelSize }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="brandCGrad" x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#00A3FF" />
              <stop offset="35%" stopColor="#0066EE" />
              <stop offset="70%" stopColor="#0037B3" />
              <stop offset="100%" stopColor="#001F7A" />
            </linearGradient>
            <linearGradient id="brandLGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0088FF" />
              <stop offset="50%" stopColor="#004EC2" />
              <stop offset="100%" stopColor="#00298A" />
            </linearGradient>
            <linearGradient id="brandLinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D2FF" />
              <stop offset="50%" stopColor="#0088FF" />
              <stop offset="100%" stopColor="#004ED4" />
            </linearGradient>
            <filter id="brandGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Sweeping 'C' Ring */}
          <path
            d="M 100 22 C 57 22 22 57 22 100 C 22 143 57 178 100 178 C 131 178 158 160 171 133 L 148 122 C 139 141 121 154 100 154 C 70 154 46 130 46 100 C 46 70 70 46 100 46 C 122 46 141 59 150 79 L 173 68 C 160 41 132 22 100 22 Z"
            fill="url(#brandCGrad)"
          />

          {/* Inner Bold Letter 'L' */}
          <path
            d="M 85 54 L 105 54 L 105 130 L 142 130 C 146 130 148 133 148 136 C 148 140 146 148 138 148 L 85 148 Z"
            fill="url(#brandLGrad)"
          />

          {/* Pixel Matrix blocks */}
          <rect x="146" y="44" width="9" height="9" fill="#00B4FF" />
          <rect x="158" y="44" width="9" height="9" fill="#0084FF" />
          <rect x="158" y="56" width="9" height="9" fill="#00A8FF" />
          <rect x="170" y="56" width="9" height="9" fill="#00E5FF" />
          <rect x="170" y="68" width="9" height="9" fill="#0084FF" />
          <rect x="146" y="68" width="9" height="9" fill="#005CE6" />
          <rect x="134" y="56" width="8" height="8" fill="#0094FF" />
          <rect x="122" y="68" width="8" height="8" fill="#00B4FF" />
          <rect x="122" y="80" width="8" height="8" fill="#005CE6" />

          {/* Connected horizontal chain link loop */}
          <rect
            x="116"
            y="114"
            width="48"
            height="28"
            rx="14"
            stroke="url(#brandLinkGrad)"
            strokeWidth="9"
            fill="none"
            filter="url(#brandGlow)"
          />
          {/* Core Cyan Dot */}
          <circle cx="140" cy="128" r="4.5" fill="#00E5FF" />
        </svg>
      </div>

      <div className="flex flex-col">
        {/* Brand Title matching Picture11 typography */}
        <div className="flex items-center gap-1.5">
          <span className="font-black tracking-tight text-white leading-none text-base sm:text-lg">
            CAMPUS <span className="text-[#00A3FF]">LINK</span>
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-500/40 text-cyan-300 uppercase tracking-wider">
            Corner
          </span>
        </div>

        {showSubtitle && (
          <div className="flex flex-col mt-0.5">
            <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium tracking-tight">
              Politeknik Sultan Azlan Shah (PSAS)
            </span>
            <span className="text-[9px] text-[#00A3FF] font-semibold hidden sm:inline italic">
              Made for Students • Built for Success
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
