import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  gradient?: boolean;
}

const getPaddingStyles = (padding: string) => {
  switch (padding) {
    case 'none':
      return 'p-0';
    case 'sm':
      return 'p-3';
    case 'md':
      return 'p-4';
    case 'lg':
      return 'p-6';
    case 'xl':
      return 'p-8';
    default:
      return 'p-4';
  }
};

const getShadowStyles = (shadow: string) => {
  switch (shadow) {
    case 'none':
      return 'shadow-none';
    case 'sm':
      return 'shadow-elevation-sm';
    case 'md':
      return 'shadow-elevation-md';
    case 'lg':
      return 'shadow-elevation-lg';
    default:
      return 'shadow-base';
  }
};

const getRoundedStyles = (rounded: string) => {
  switch (rounded) {
    case 'sm':
      return 'rounded-xs';
    case 'md':
      return 'rounded-md';
    case 'lg':
      return 'rounded-lg';
    case 'xl':
      return 'rounded-xl';
    default:
      return 'rounded-md';
  }
};

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  shadow = 'md',
  padding = 'md',
  rounded = 'lg',
  border = false,
  gradient = false,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx(
        'bg-white transition-all duration-base',
        getShadowStyles(shadow),
        getPaddingStyles(padding),
        getRoundedStyles(rounded),
        border && 'border border-neutral-200',
        hoverable && 'hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        gradient && 'bg-gradient-to-br from-white via-neutral-50 to-neutral-100',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
