import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Ban } from 'lucide-react';

export type ConfirmVariant = 'danger' | 'warning' | 'info' | 'primary' | 'success';

export interface ConfirmOptions {
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  icon?: 'alert' | 'ban' | 'info' | 'check';
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback((result: boolean) => {
    if (dialogState) {
      dialogState.resolve(result);
      setDialogState(null);
    }
  }, [dialogState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dialogState?.isOpen) {
        handleClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialogState, handleClose]);

  const options = dialogState?.options;
  const variant = options?.variant || 'danger';

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          iconBg: 'bg-amber-100',
          confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500',
          defaultIcon: options?.icon === 'ban' 
            ? <Ban className="w-6 h-6 text-amber-600" /> 
            : <AlertCircle className="w-6 h-6 text-amber-600" />,
        };
      case 'success':
        return {
          iconBg: 'bg-emerald-100',
          confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
          defaultIcon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
        };
      case 'info':
      case 'primary':
        return {
          iconBg: 'bg-blue-100',
          confirmBtn: 'bg-primary-navy hover:bg-primary-navy/90 text-white focus:ring-primary-navy',
          defaultIcon: <Info className="w-6 h-6 text-blue-600" />,
        };
      case 'danger':
      default:
        return {
          iconBg: 'bg-red-100',
          confirmBtn: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
          defaultIcon: <AlertTriangle className="w-6 h-6 text-red-600" />,
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialogState?.isOpen && options && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => handleClose(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in border border-neutral-100">
            <div className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center mx-auto mb-4`}>
              {styles.defaultIcon}
            </div>
            <h3 className="text-h5 text-neutral-900 text-center font-semibold mb-2">
              {options.title}
            </h3>
            <div className="text-body-sm text-neutral-500 text-center mb-6">
              {options.message}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleClose(false)}
                className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-body-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                {options.cancelLabel || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handleClose(true)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-body-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.confirmBtn}`}
              >
                {options.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ((options: ConfirmOptions) => Promise<boolean>) => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context.confirm;
};
