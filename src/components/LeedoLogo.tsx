import React, { useEffect, useState } from 'react';
import { storage } from '../services/storage';

interface LeedoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical';
  showSubtitle?: boolean;
}

export const LeedoLogo: React.FC<LeedoLogoProps> = ({
  className = '',
  size = 'md',
  layout = 'horizontal',
  showSubtitle = false,
}) => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    setCustomLogo(storage.getCustomLogo());
  }, []);

  const sizeMap = {
    sm: { icon: 38, text: 'text-xl', height: 'h-9' },
    md: { icon: 48, text: 'text-2xl', height: 'h-12' },
    lg: { icon: 68, text: 'text-3xl', height: 'h-16' },
    xl: { icon: 96, text: 'text-5xl', height: 'h-24' },
  };

  const current = sizeMap[size];

  // If HR uploaded an image logo file (e.g. leedo-logo-1.png)
  if (customLogo) {
    if (layout === 'vertical') {
      return (
        <div className={`flex flex-col items-center select-none ${className}`}>
          <img
            src={customLogo}
            alt="LEEDO"
            className={`${current.height} object-contain drop-shadow-sm`}
          />
        </div>
      );
    }
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <img
          src={customLogo}
          alt="LEEDO"
          className={`${current.height} object-contain drop-shadow-sm`}
        />
      </div>
    );
  }

  // Exact vector reproduction of the LEEDO two-children dancing emblem from leedo-logo-1.png
  const EmblemSvg = (
    <svg
      width={current.icon}
      height={current.icon}
      viewBox="0 0 500 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-xs"
    >
      {/* Left Child Head (oval tilted slightly) */}
      <circle cx="178" cy="72" r="38" fill="#E11E26" />

      {/* Right Child Head (oval tilted right) */}
      <circle cx="308" cy="40" r="38" fill="#E11E26" />

      {/* Unified body structure of the two joyful children holding hands */}
      <path
        d="M 160 115 
           C 145 145, 95 180, 52 195 
           C 40 200, 36 212, 42 222 
           C 48 232, 60 234, 74 228 
           C 112 212, 150 188, 168 160 
           C 168 185, 162 230, 140 270 
           C 120 305, 90 325, 65 338 
           C 52 344, 46 358, 55 370 
           C 64 382, 80 382, 95 372 
           C 125 352, 160 322, 180 275 
           C 192 305, 202 345, 208 375 
           C 214 395, 230 405, 246 398 
           C 260 390, 264 372, 256 355 
           C 242 320, 230 280, 222 250 
           C 240 248, 270 248, 292 230 
           C 285 260, 275 305, 260 345 
           C 252 365, 260 382, 276 388 
           C 292 392, 308 382, 316 360 
           C 334 315, 345 268, 350 230 
           C 368 265, 392 305, 410 325 
           C 422 340, 440 338, 450 326 
           C 460 312, 455 292, 440 280 
           C 418 255, 392 210, 376 165 
           C 405 148, 440 120, 465 100 
           C 478 90, 478 70, 464 60 
           C 450 50, 432 55, 420 66 
           C 388 92, 350 120, 320 140 
           C 296 110, 260 95, 225 100 
           C 198 104, 175 110, 160 115 
           Z"
        fill="#E11E26"
      />

      {/* Linking arm loop creating playful connection */}
      <path
        d="M 185 170 
           C 220 148, 265 145, 298 172 
           C 310 182, 318 176, 320 164 
           C 322 150, 312 138, 296 130 
           C 252 110, 198 114, 164 140 
           C 152 150, 154 164, 165 172 
           C 172 176, 178 175, 185 170 
           Z"
        fill="#E11E26"
      />
    </svg>
  );

  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        {EmblemSvg}
        <div className="mt-1 flex flex-col items-center">
          <span
            className={`font-black tracking-[0.08em] text-[#E11E26] ${current.text}`}
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            LEEDO
          </span>
          {showSubtitle && (
            <span className="text-[11px] text-slate-500 font-medium tracking-wide mt-0.5">
              Local Education & Economic Development Organization
            </span>
          )}
        </div>
      </div>
    );
  }

  // Horizontal layout for Top Navigation Bar
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {EmblemSvg}
      <div className="flex flex-col justify-center">
        <span
          className={`font-black tracking-[0.08em] text-[#E11E26] leading-none ${current.text}`}
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          LEEDO
        </span>
        {showSubtitle && (
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
            Employee Portal
          </span>
        )}
      </div>
    </div>
  );
};
