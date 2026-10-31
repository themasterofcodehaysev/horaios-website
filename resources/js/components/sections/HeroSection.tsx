import React from 'react';
import clsx from 'clsx';
import { Button } from '../ui/Button';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  verse?: { text: string; reference: string };
  description?: string;
  primaryCTA?: {
    label: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    label: string;
    onClick: () => void;
  };
  backgroundImage?: string;
  backgroundGradient?: boolean;
  showScrollIndicator?: boolean;
  minHeight?: 'sm' | 'md' | 'lg' | 'xl';
}

const getMinHeightStyles = (height: string) => {
  switch (height) {
    case 'sm':
      return 'min-h-[400px]';
    case 'md':
      return 'min-h-[500px]';
    case 'lg':
      return 'min-h-[620px]';
    case 'xl':
      return 'min-h-[720px]';
    default:
      return 'min-h-[620px]';
  }
};

export const HeroSection: React.FC<HeroProps> = ({
  title,
  subtitle,
  badge,
  verse,
  description,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  backgroundGradient = true,
  showScrollIndicator = true,
  minHeight = 'lg',
}) => {
  return (
    <div
      className={clsx(
        'relative w-full flex items-center justify-center overflow-hidden',
        getMinHeightStyles(minHeight)
      )}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {/* Background & Overlays */}
      {backgroundGradient && (
        <div className="absolute inset-0 bg-gradient-to-b from-brand-burgundy-deep/95 via-brand-burgundy/90 to-brand-burgundy-dark/95" />
      )}
      {!backgroundGradient && !backgroundImage && (
        <div className="absolute inset-0 bg-gradient-hero" />
      )}
      {backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-t from-brand-burgundy-deep via-black/60 to-black/40" />
      )}

      {/* Subtle Sacred Architectural Motif Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 30%, #ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
        {/* Sacred Badge or Subtitle */}
        {badge && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/95 text-xs font-medium tracking-wider uppercase mb-5 shadow-sm">
            <span>{badge}</span>
          </div>
        )}

        {subtitle && !badge && (
          <p className="text-sm sm:text-base font-medium text-amber-200/90 mb-3 tracking-widest uppercase">
            {subtitle}
          </p>
        )}

        {/* Majestic Church Heading */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal sm:font-medium mb-6 leading-[1.15] tracking-tight drop-shadow-sm">
          {title}
        </h1>

        {description && (
          <p className="text-base sm:text-lg md:text-xl text-neutral-100/90 mb-8 max-w-2xl mx-auto font-sans leading-relaxed">
            {description}
          </p>
        )}

        {/* Verse callout */}
        {verse && (
          <div className="mb-8 max-w-xl mx-auto px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 text-xs sm:text-sm italic font-serif">
            "{verse.text}" <span className="not-italic font-sans font-bold text-amber-300 ml-1">— {verse.reference}</span>
          </div>
        )}

        {(primaryCTA || secondaryCTA) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {primaryCTA && (
              <Button
                variant="outline"
                size="lg"
                onClick={primaryCTA.onClick}
                className="bg-white !text-primary-red border-0 hover:bg-neutral-100 font-bold shadow-elevation-md px-8 py-3.5 transition-all"
                style={{ color: '#74121c' }}
              >
                {primaryCTA.label}
              </Button>
            )}
            {secondaryCTA && (
              <Button
                variant="default"
                size="lg"
                onClick={secondaryCTA.onClick}
                className="border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-brand-burgundy font-bold transition-all px-8 py-3.5"
              >
                {secondaryCTA.label}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/60" />
        </div>
      )}
    </div>
  );
};

export default HeroSection;
