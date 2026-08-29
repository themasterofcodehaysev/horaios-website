import React from 'react';
import clsx from 'clsx';

/**
 * Typography primitives built on the existing text-* scale defined in
 * tailwind.config.js (text-display-*, text-h1..h6, text-body-*, text-label-*,
 * text-caption). These do not change how any existing page renders — pages
 * keep hand-writing their own classes until they're migrated to use these.
 */

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Controls both the font-size scale and (unless `as` is set) the rendered tag. */
  level?: HeadingLevel;
  /** Override the rendered tag independently of the visual `level`, e.g. an h2 styled like an h4. */
  as?: HeadingTag;
  /** Use the larger text-display-* scale instead of text-h1..h6. */
  display?: boolean;
  children: React.ReactNode;
}

const headingSizeMap: Record<HeadingLevel, string> = {
  1: 'text-h1',
  2: 'text-h2',
  3: 'text-h3',
  4: 'text-h4',
  5: 'text-h5',
  6: 'text-h6',
};

const displaySizeMap: Record<HeadingLevel, string> = {
  1: 'text-display-xl',
  2: 'text-display-lg',
  3: 'text-display-md',
  4: 'text-display-md',
  5: 'text-display-md',
  6: 'text-display-md',
};

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  as,
  display = false,
  className,
  children,
  ...props
}) => {
  const Tag: HeadingTag = as || (`h${level}` as HeadingTag);
  const sizeClass = display ? displaySizeMap[level] : headingSizeMap[level];

  return (
    <Tag className={clsx(sizeClass, 'font-semibold text-neutral-900', className)} {...props}>
      {children}
    </Tag>
  );
};

type TextVariant = 'body' | 'label' | 'caption';
type TextSize = 'xs' | 'sm' | 'md' | 'base' | 'lg';
type TextTag = 'p' | 'span' | 'div';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** 'body' (default, paragraph copy), 'label' (uppercase eyebrow/kicker text), or 'caption'. */
  variant?: TextVariant;
  /** Meaning depends on variant: body accepts xs/sm/base/lg, label accepts sm/md/lg. */
  size?: TextSize;
  as?: TextTag;
  children: React.ReactNode;
}

const bodySizeMap: Record<string, string> = {
  xs: 'text-body-xs',
  sm: 'text-body-sm',
  base: 'text-body-base',
  md: 'text-body-base',
  lg: 'text-body-lg',
};

const labelSizeMap: Record<string, string> = {
  xs: 'text-label-sm',
  sm: 'text-label-sm',
  md: 'text-label-md',
  base: 'text-label-md',
  lg: 'text-label-lg',
};

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  size,
  as,
  className,
  children,
  ...props
}) => {
  let sizeClass: string;
  let variantClass: string;
  let defaultTag: TextTag;

  if (variant === 'label') {
    sizeClass = labelSizeMap[size || 'md'];
    variantClass = 'uppercase tracking-wide text-primary-red';
    defaultTag = 'p';
  } else if (variant === 'caption') {
    sizeClass = 'text-caption';
    variantClass = 'text-neutral-500';
    defaultTag = 'span';
  } else {
    sizeClass = bodySizeMap[size || 'base'];
    variantClass = 'text-neutral-600';
    defaultTag = 'p';
  }

  const Tag: TextTag = as || defaultTag;

  return (
    <Tag className={clsx(sizeClass, variantClass, className)} {...props}>
      {children}
    </Tag>
  );
};
