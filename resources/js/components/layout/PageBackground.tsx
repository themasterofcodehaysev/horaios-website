import React from 'react';

/**
 * Fixed decorative background layer using brand burgundy (#74121c).
 * Sits behind all public page content.
 */
export const PageBackground: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0 bg-brand-burgundy" />
    <div className="absolute inset-0 bg-gradient-to-br from-brand-burgundy via-brand-burgundy-dark to-brand-burgundy-deep" />
    <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-burgundy-light/25 blur-3xl" />
    <div className="absolute bottom-0 right-0 h-[420px] w-[420px] translate-x-1/4 translate-y-1/4 rounded-full bg-primary-navy/20 blur-3xl" />
    <div className="absolute top-1/3 -left-24 h-[360px] w-[360px] rounded-full bg-black/15 blur-3xl" />
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="1.5" fill="white"/></svg>',
        )}")`,
        backgroundSize: '60px 60px',
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><path d="M60 20v80M20 60h80" stroke="white" stroke-width="1" fill="none"/></svg>',
        )}")`,
        backgroundSize: '120px 120px',
      }}
    />
  </div>
);

export default PageBackground;
