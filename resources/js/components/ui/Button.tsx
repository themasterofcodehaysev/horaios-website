import React from 'react';
import clsx from 'clsx';
import { Variant, Size } from '../../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant | 'default';
  size?: Size;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return 'bg-primary-navy text-white hover:bg-primary-dark-navy focus:ring-primary-navy active:bg-primary-dark-navy';
    case 'secondary':
      return 'bg-neutral-100 text-primary-navy hover:bg-neutral-200 focus:ring-primary-navy active:bg-neutral-300';
    case 'danger':
      return 'bg-error text-white hover:bg-red-700 focus:ring-error active:bg-red-800';
    case 'success':
      return 'bg-success text-white hover:bg-emerald-700 focus:ring-success active:bg-emerald-800';
    case 'warning':
      return 'bg-warning text-white hover:bg-amber-600 focus:ring-warning active:bg-amber-700';
    default:
      return 'bg-white text-primary-navy hover:bg-neutral-50 focus:ring-primary-navy active:bg-neutral-100 border border-neutral-300';
  }
};

const getSizeStyles = (size: Size) => {
  switch (size) {
    case 'sm':
      return 'px-3 py-1.5 text-label-sm gap-1.5';
    case 'md':
      return 'px-4 py-2 text-body-sm gap-2';
    case 'lg':
      return 'px-6 py-3 text-body-base gap-2';
    case 'xl':
      return 'px-8 py-4 text-body-lg gap-2';
    default:
      return 'px-4 py-2 text-body-base gap-2';
  }
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={clsx(
        'inline-flex items-center justify-center font-medium',
        'rounded-md transition-all duration-base',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-95',
        getVariantStyles(variant),
        getSizeStyles(size),
        fullWidth && 'w-full',
        className
      )}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex items-center">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="flex items-center">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
