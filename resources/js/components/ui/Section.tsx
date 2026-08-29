import React from 'react';
import clsx from 'clsx';

/**
 * Layout wrapper encapsulating the `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
 * container pattern that public pages currently hand-roll in every section,
 * plus a shared set of vertical padding / background variants.
 */

type SectionSpacing = 'none' | 'sm' | 'md' | 'lg';
type SectionBackground = 'white' | 'neutral' | 'transparent' | 'surface';
type SectionTag = 'section' | 'div';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Vertical padding. 'lg' (py-20) matches the most common section spacing on the homepage. */
  spacing?: SectionSpacing;
  background?: SectionBackground;
  /** Extra classes applied to the inner max-w-7xl container, not the outer section. */
  containerClassName?: string;
  /** Cap the inner container at a narrower width than the default max-w-7xl. */
  containerMaxWidth?: 'none' | '4xl' | '5xl' | '6xl' | '7xl';
  as?: SectionTag;
  children: React.ReactNode;
}

const spacingMap: Record<SectionSpacing, string> = {
  none: '',
  sm: 'py-10',
  md: 'py-16',
  lg: 'py-20',
};

const backgroundMap: Record<SectionBackground, string> = {
  white: 'bg-white/97 backdrop-blur-sm',
  neutral: 'bg-white/94 backdrop-blur-sm',
  surface: 'bg-white/97 backdrop-blur-sm shadow-elevation-sm border-y border-white/30',
  transparent: '',
};

const maxWidthMap: Record<NonNullable<SectionProps['containerMaxWidth']>, string> = {
  none: '',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

export const Section: React.FC<SectionProps> = ({
  spacing = 'lg',
  background = 'white',
  containerClassName,
  containerMaxWidth = '7xl',
  as = 'section',
  className,
  children,
  ...props
}) => {
  const Tag: SectionTag = as;

  return (
    <Tag className={clsx(spacingMap[spacing], backgroundMap[background], className)} {...props}>
      <div className={clsx(maxWidthMap[containerMaxWidth], 'mx-auto px-4 sm:px-6 lg:px-8', containerClassName)}>
        {children}
      </div>
    </Tag>
  );
};

export default Section;
