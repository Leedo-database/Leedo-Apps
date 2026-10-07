import React from 'react';
import { BackgroundConfig } from '../types';

interface GeometricBackgroundProps {
  children: React.ReactNode;
  config?: BackgroundConfig;
  className?: string;
}

export const GeometricBackground: React.FC<GeometricBackgroundProps> = ({
  children,
  config = {
    type: 'pattern',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920&auto=format&fit=crop',
    blur: 8,
    dim: 45,
    overlayColor: '#0b2e46',
  },
  className = '',
}) => {
  const isImageMode = config.type === 'image' && config.imageUrl;

  return (
    <div className={`min-h-screen w-full relative overflow-x-hidden flex flex-col bg-[#59849e] ${className}`}>
      {/* Background layer */}
      {isImageMode ? (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Blurred Cover Image ("ঝাপসা" / Japsha aesthetic) */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 transform scale-110"
            style={{
              backgroundImage: `url(${config.imageUrl})`,
              filter: `blur(${config.blur}px)`,
              WebkitFilter: `blur(${config.blur}px)`,
            }}
          />

          {/* Dark / Tint Overlay for high contrast & text readability */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              backgroundColor: config.overlayColor || '#0b2e46',
              opacity: (config.dim ?? 45) / 100,
            }}
          />

          {/* Subtle vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        </div>
      ) : (
        /* Original Geometric Diamond Pattern */
        <div className="fixed inset-0 pointer-events-none z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: '#5d88a2',
            }}
          />
          <div
            className="absolute inset-0 opacity-45 mix-blend-soft-light"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.18) 0%, transparent 70%), url("data:image/svg+xml,%3Csvg width='140' height='140' viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.16' fill-rule='evenodd'%3E%3Cpath d='M70 0L140 70L70 140L0 70Z'/%3E%3Cpath d='M70 35L105 70L70 105L35 70Z' fill-opacity='0.10'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: 'auto, 140px 140px',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
        </div>
      )}

      {/* Main Content layer */}
      <div className="relative z-10 flex-1 flex flex-col">{children}</div>
    </div>
  );
};
