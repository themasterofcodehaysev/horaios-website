import React from 'react';
import clsx from 'clsx';
import { Button } from '../ui/Button';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle?: string;
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
      return 'min-h-[600px]';
    case 'xl':
      return 'min-h-[700px]';
    default:
      return 'min-h-[600px]';
  }
};

export const HeroSection: React.FC<HeroProps> = ({
  title,
  subtitle,
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
      {/* Gradient Overlay */}
      {backgroundGradient && (
        <div className="absolute inset-0 bg-gradient-hero-overlay" />
      )}
      {!backgroundGradient && !backgroundImage && (
        <div className="absolute inset-0 bg-gradient-hero" />
      )}
      {backgroundImage && !backgroundGradient && (
        <div className="absolute inset-0 bg-black/40" />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {subtitle && (
          <p className="text-label-lg text-white/80 mb-3 uppercase tracking-wide">
            {subtitle}
          </p>
        )}

        <h1 className="text-display-lg md:text-display-xl text-white font-bold mb-6 leading-tight">
          {title}
        </h1>

        {description && (
          <p className="text-body-lg md:text-body-lg text-white/90 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}

        {(primaryCTA || secondaryCTA) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {primaryCTA && (
              <Button
                variant="primary"
                size="lg"
                onClick={primaryCTA.onClick}
                className="bg-primary-red hover:bg-primary-dark-red"
              >
                {primaryCTA.label}
              </Button>
            )}
            {secondaryCTA && (
              <Button
                variant="default"
                size="lg"
                onClick={secondaryCTA.onClick}
                className="border-2 border-white bg-white text-primary-dark-red hover:bg-white/10 hover:text-white"
              >
                {secondaryCTA.label}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/60" />
        </div>
      )}
    </div>
  );
};

export default HeroSection;
