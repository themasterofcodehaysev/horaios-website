import React from 'react';

interface SectionDividerProps {
  /** Flip the wave so it blends from content above into the burgundy background below */
  flip?: boolean;
  className?: string;
}

/**
 * Soft wave transition between content sections and the brand burgundy backdrop.
 */
export const SectionDivider: React.FC<SectionDividerProps> = ({ flip = false, className = '' }) => (
  <div className={`relative h-12 md:h-16 overflow-hidden ${className}`} aria-hidden="true">
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`absolute inset-0 h-full w-full ${flip ? 'rotate-180' : ''}`}
    >
      <path
        d="M0,32 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z"
        fill="rgba(255,255,255,0.97)"
      />
    </svg>
  </div>
);

export default SectionDivider;
