import React, { useState } from 'react';
import clsx from 'clsx';

interface TabItem {
  label: string;
  value: string;
  badge?: string;
  disabled?: boolean;
}

interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (value: string) => void;
  variant?: 'line' | 'pill';
  children?: (value: string) => React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'line',
  children,
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value || '');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  if (variant === 'pill') {
    return (
      <div className={clsx('flex flex-col gap-4', className)}>
        <div className="flex gap-2 bg-neutral-100 p-1 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              disabled={tab.disabled}
              className={clsx(
                'px-4 py-2 rounded-md text-body-sm font-medium transition-all duration-base',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                activeTab === tab.value
                  ? 'bg-white text-primary-red shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              {tab.label}
              {tab.badge && (
                <span className="ml-2 px-2 py-0.5 text-label-sm bg-primary-red text-white rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        {children && <div>{children(activeTab)}</div>}
      </div>
    );
  }

  return (
    <div className={clsx('flex flex-col gap-0', className)}>
      <div className="flex border-b border-neutral-200 gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            disabled={tab.disabled}
            className={clsx(
              'px-4 py-3 text-body-base font-medium transition-all duration-base',
              'border-b-2 -mb-0.5 disabled:opacity-50 disabled:cursor-not-allowed',
              activeTab === tab.value
                ? 'border-primary-red text-primary-red'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            )}
          >
            {tab.label}
            {tab.badge && (
              <span className="ml-2 px-2 py-0.5 text-label-sm bg-primary-red text-white rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      {children && <div className="pt-4">{children(activeTab)}</div>}
    </div>
  );
};

export default Tabs;
