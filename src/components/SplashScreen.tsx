import React, { useEffect, useState } from 'react';

interface Props {
  onFinish?: () => void;
  minDuration?: number; // duration in ms, default 2400ms
}

export const SplashScreen: React.FC<Props> = ({
  onFinish,
  minDuration = 2400
}) => {
  const [progress, setProgress] = useState(15);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Step-by-step progress simulation matching the segmented bar
    const step1 = setTimeout(() => setProgress(35), 400);
    const step2 = setTimeout(() => setProgress(65), 900);
    const step3 = setTimeout(() => setProgress(88), 1500);
    const step4 = setTimeout(() => setProgress(100), 2000);

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, minDuration);

    const completeTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, minDuration + 500);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(step4);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [minDuration, onFinish]);

  // Calculate active segmented bars out of 7 segments
  const activeSegments = Math.round((progress / 100) * 7);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between px-6 py-12 sm:py-16 bg-[#0A0F1D] text-slate-100 transition-opacity duration-500 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: 'radial-gradient(ellipse at 50% 30%, #0F2042 0%, #0A0F1D 70%)',
      }}
    >
      {/* Top spacer */}
      <div className="w-full flex justify-end">
        <button
          onClick={() => {
            setIsFadingOut(true);
            setTimeout(() => onFinish && onFinish(), 200);
          }}
          className="text-[11px] font-mono text-slate-500 hover:text-slate-300 px-3 py-1 rounded-full border border-slate-800/80 transition-colors cursor-pointer"
        >
          Skip ➔
        </button>
      </div>

      {/* Center Branding Content */}
      <div className="flex flex-col items-center justify-center text-center max-w-sm w-full my-auto space-y-6">
        {/* Stylized Campus Link Emblem */}
        <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 shrink-0 drop-shadow-[0_15px_35px_rgba(2,132,199,0.35)] animate-in zoom-in-90 duration-700">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="splashCGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0099FF" />
                <stop offset="45%" stopColor="#0055D4" />
                <stop offset="100%" stopColor="#002277" />
              </linearGradient>
              <linearGradient id="splashLGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0077EE" />
                <stop offset="100%" stopColor="#0044AA" />
              </linearGradient>
              <linearGradient id="splashLinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00CCFF" />
                <stop offset="50%" stopColor="#0088FF" />
                <stop offset="100%" stopColor="#0044DD" />
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Main Outer Sweeping 'C' Ring with tapered tail */}
            <path
              d="M 100 22 C 57 22 22 57 22 100 C 22 143 57 178 100 178 C 131 178 158 160 171 133 L 148 122 C 139 141 121 154 100 154 C 70 154 46 130 46 100 C 46 70 70 46 100 46 C 122 46 141 59 150 79 L 173 68 C 160 41 132 22 100 22 Z"
              fill="url(#splashCGrad)"
            />

            {/* Inner Bold Letter 'L' */}
            <path
              d="M 85 54 L 105 54 L 105 130 L 142 130 C 146 130 148 133 148 136 C 148 140 146 148 138 148 L 85 148 Z"
              fill="url(#splashLGrad)"
            />

            {/* Floating Pixel Blocks from upper right of the 'L' */}
            <rect x="146" y="44" width="9" height="9" fill="#00AAFF" />
            <rect x="158" y="44" width="9" height="9" fill="#0077EE" />
            <rect x="158" y="56" width="9" height="9" fill="#0099FF" />
            <rect x="170" y="56" width="9" height="9" fill="#00CCFF" />
            <rect x="170" y="68" width="9" height="9" fill="#0077EE" />
            <rect x="146" y="68" width="9" height="9" fill="#0055DD" />
            <rect x="134" y="56" width="8" height="8" fill="#0088FF" />
            <rect x="122" y="68" width="8" height="8" fill="#00AAFF" />
            <rect x="122" y="80" width="8" height="8" fill="#0055CC" />

            {/* Interlinked Chain Loop (Connecting out from lower L) */}
            <rect
              x="116"
              y="114"
              width="48"
              height="28"
              rx="14"
              stroke="url(#splashLinkGrad)"
              strokeWidth="9"
              fill="none"
              filter="url(#softGlow)"
            />
            {/* Center link cutout */}
            <circle cx="140" cy="128" r="4" fill="#00CCFF" />
          </svg>
        </div>

        {/* Company Title & Metadata */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-white uppercase drop-shadow-md">
            CAMPUS <span className="text-[#00A3FF]">LINK</span>
          </h1>

          <div className="flex items-center justify-center gap-2 pt-0.5">
            <span className="h-[1px] w-8 bg-slate-700" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-slate-300 uppercase">
              TECHNOLOGIES
            </span>
            <span className="h-[1px] w-8 bg-slate-700" />
          </div>

          <div className="text-[9px] font-semibold text-slate-400 tracking-wider">
            SDN. BHD.
          </div>

          <div className="flex items-center justify-center gap-2 pt-1 text-[10px] text-slate-400 font-mono">
            <span className="h-[1px] w-6 bg-slate-800" />
            <span>EST. 2026</span>
            <span className="h-[1px] w-6 bg-slate-800" />
          </div>
        </div>

        {/* Brand Slogan */}
        <div className="pt-4 space-y-0.5">
          <p className="text-xl sm:text-2xl font-extrabold tracking-tight">
            <span className="text-[#00A3FF] drop-shadow-sm">Made</span>{' '}
            <span className="text-white">for Students</span>
          </p>
          <p className="text-xl sm:text-2xl font-extrabold tracking-tight">
            <span className="text-[#00A3FF] drop-shadow-sm">Built</span>{' '}
            <span className="text-white">for Success</span>
          </p>
        </div>
      </div>

      {/* Bottom Loading Indicator (Segmented Progress Bar) */}
      <div className="flex flex-col items-center justify-center text-center w-full max-w-xs space-y-3 pb-2">
        <div className="space-y-1">
          <div className="text-xs font-bold text-white flex items-center justify-center gap-2">
            <span>Loading...</span>
            <span className="text-[10px] font-mono text-[#00A3FF]">{progress}%</span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-xs leading-snug">
            Please wait while we connect you to your campus community
          </p>
        </div>

        {/* 7-Segmented Loading Bar (faithful to attached graphic) */}
        <div className="flex items-center gap-1.5 w-full justify-center">
          {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
            const isActive = idx < activeSegments;

            return (
              <div
                key={idx}
                className={`h-2.5 flex-1 rounded-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0077EE] to-[#00A3FF] shadow-sm shadow-[#0088FF]/50 scale-100'
                    : 'bg-slate-800/80 scale-95'
                } ${idx === 0 ? 'rounded-l-full' : ''} ${idx === 6 ? 'rounded-r-full' : ''}`}
              />
            );
          })}
        </div>

        <div className="text-[10px] font-mono text-slate-400 pt-1">
          Politeknik Sultan Azlan Shah (PSAS)
        </div>
      </div>
    </div>
  );
};
