import React from 'react';

interface SectionDividerProps {
  /** Flip the wave so it blends from content above into the background below */
  flip?: boolean;
  className?: string;
  fill?: string;
}

/**
 * Solid wave transition between content sections and backgrounds.
 */
export const SectionDivider: React.FC<SectionDividerProps> = ({ flip = false, className = '', fill = '#FFFFFF' }) => (
  <div className={`relative h-12 md:h-16 overflow-hidden ${className}`} aria-hidden="true">
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`absolute inset-0 h-full w-full ${flip ? 'rotate-180' : ''}`}
    >
      <path
        d="M0,32 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z"
        fill={fill}
      />
    </svg>
  </div>
);

export default SectionDivider;
