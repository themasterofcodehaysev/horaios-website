import React from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'success':
      return 'bg-success/10 border-success/30 text-success';
    case 'warning':
      return 'bg-warning/10 border-warning/30 text-warning';
    case 'error':
      return 'bg-error/10 border-error/30 text-error';
    case 'info':
    default:
      return 'bg-info/10 border-info/30 text-info';
  }
};

const getIcon = (variant: string) => {
  switch (variant) {
    case 'success':
      return <CheckCircle className="w-5 h-5 flex-shrink-0" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 flex-shrink-0" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 flex-shrink-0" />;
    case 'info':
    default:
      return <Info className="w-5 h-5 flex-shrink-0" />;
  }
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div
      {...props}
      className={clsx(
        'rounded-lg border-l-4 p-4 flex gap-3',
        getVariantStyles(variant),
        className
      )}
    >
      <div className="flex-shrink-0">
        {getIcon(variant)}
      </div>
      <div className="flex-1">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <p className="text-body-sm opacity-90">{children}</p>
      </div>
      {dismissible && (
        <button
          onClick={() => {
            setIsVisible(false);
            onDismiss?.();
          }}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
