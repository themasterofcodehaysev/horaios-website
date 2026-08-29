import React from 'react';
import clsx from 'clsx';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'sm':
      return 'px-2.5 py-1.5 text-body-sm';
    case 'lg':
      return 'px-4 py-3 text-body-lg';
    default:
      return 'px-3 py-2 text-body-base';
  }
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      iconPosition = 'left',
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-label-md text-neutral-700 mb-2 font-medium">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            {...props}
            className={clsx(
              'w-full rounded-md border-2 transition-all duration-base',
              'focus:outline-none focus:ring-0',
              'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500',
              getSizeStyles(size),
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              error
                ? 'border-error focus:border-error'
                : 'border-neutral-300 focus:border-primary-red',
              className
            )}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-body-xs text-error mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-body-xs text-neutral-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
