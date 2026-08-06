import React, { useState } from 'react';
import clsx from 'clsx';

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  divider?: boolean;
  danger?: boolean;
}

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  width?: 'auto' | 'sm' | 'md' | 'lg';
}

const getWidthStyles = (width: string) => {
  switch (width) {
    case 'sm':
      return 'w-40';
    case 'md':
      return 'w-56';
    case 'lg':
      return 'w-64';
    default:
      return 'w-auto min-w-48';
  }
};

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  width = 'auto',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div
          className={clsx(
            'absolute z-50 top-full mt-2 bg-white rounded-lg shadow-lg border border-neutral-200',
            getWidthStyles(width),
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <div key={index}>
                {item.divider && <div className="border-t border-neutral-100 my-1" />}
                {!item.divider && (
                  <button
                    onClick={() => {
                      item.onClick();
                      setIsOpen(false);
                    }}
                    className={clsx(
                      'w-full px-4 py-2 text-left text-body-sm transition-colors duration-base',
                      'hover:bg-neutral-100 flex items-center gap-2',
                      item.danger ? 'text-error hover:bg-error/10' : 'text-neutral-700'
                    )}
                  >
                    {item.icon && <span className="flex items-center">{item.icon}</span>}
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
