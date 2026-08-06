import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: boolean;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  rounded = false,
  count = 1,
  className,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'animate-pulse bg-neutral-200',
            width,
            height,
            rounded && 'rounded-md',
            i < count - 1 && 'mb-3',
            className
          )}
        />
      ))}
    </>
  );
};

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'sm':
      return 'w-6 h-6';
    case 'lg':
      return 'w-12 h-12';
    default:
      return 'w-8 h-8';
  }
};

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  fullPage = false,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-center',
        fullPage && 'fixed inset-0 bg-black/50 z-50',
        !fullPage && 'p-8',
        className
      )}
    >
      <Loader2 className={clsx('animate-spin text-primary-navy', getSizeStyles(size))} />
    </div>
  );
};

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={clsx('flex flex-col items-center justify-center py-16', className)}>
      {icon && (
        <div className="mb-4 text-neutral-400">
          {icon}
        </div>
      )}
      <h3 className="text-h4 font-semibold text-neutral-900 mb-2">{title}</h3>
      {description && (
        <p className="text-body-base text-neutral-500 mb-6 max-w-sm text-center">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary-navy text-white rounded-md hover:bg-primary-dark-navy transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default { Skeleton, Loading, EmptyState };
