import React from 'react';
import clsx from 'clsx';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return 'bg-primary-red text-white';
    case 'secondary':
      return 'bg-neutral-100 text-primary-red';
    case 'success':
      return 'bg-success/10 text-success';
    case 'warning':
      return 'bg-warning/10 text-warning';
    case 'error':
      return 'bg-error/10 text-error';
    case 'info':
      return 'bg-info/10 text-info';
    default:
      return 'bg-primary-red text-white';
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'sm':
      return 'px-2 py-1 text-label-sm';
    case 'lg':
      return 'px-3 py-1.5 text-body-sm';
    default:
      return 'px-2.5 py-1 text-label-md';
  }
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
  ...props
}) => {
  return (
    <span
      {...props}
      className={clsx(
        'inline-flex items-center gap-1.5',
        'rounded-full font-medium transition-colors duration-base',
        getVariantStyles(variant),
        getSizeStyles(size),
        className
      )}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
