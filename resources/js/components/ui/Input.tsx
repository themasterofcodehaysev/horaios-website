import React, { useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  showPasswordToggle?: boolean;
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
      showPasswordToggle = true,
      type = 'text',
      className,
      ...props
    },
    ref
  ) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const isPasswordField = type === 'password';
    const effectiveType = isPasswordField && passwordVisible ? 'text' : type;

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
            type={effectiveType}
            {...props}
            className={clsx(
              'w-full rounded-md border-2 transition-all duration-base',
              'focus:outline-none focus:ring-0',
              'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500',
              getSizeStyles(size),
              icon && iconPosition === 'left' && 'pl-10',
              ((icon && iconPosition === 'right') || (isPasswordField && showPasswordToggle)) && 'pr-11',
              error
                ? 'border-error focus:border-error'
                : 'border-neutral-300 focus:border-primary-red',
              className
            )}
          />
          {isPasswordField && showPasswordToggle ? (
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors p-1 focus:outline-none cursor-pointer"
              tabIndex={-1}
              aria-label={passwordVisible ? 'Hide password' : 'Show password'}
              title={passwordVisible ? 'Hide password' : 'Show password'}
            >
              {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : (
            icon && iconPosition === 'right' && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                {icon}
              </div>
            )
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
