import React from 'react';
import clsx from 'clsx';

interface FeatureBoxProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
  onClick?: () => void;
}

export const FeatureBox: React.FC<FeatureBoxProps> = ({
  icon,
  title,
  description,
  highlight = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-6 rounded-lg transition-all duration-base',
        highlight
          ? 'bg-primary-red text-white shadow-lg'
          : 'bg-white text-neutral-900 border-2 border-neutral-200 hover:border-primary-red hover:shadow-md'
      )}
    >
      {icon && (
        <div className={clsx(
          'mb-4 inline-flex p-3 rounded-lg',
          highlight
            ? 'bg-white/20'
            : 'bg-primary-red/10'
        )}>
          <span className={highlight ? 'text-white' : 'text-primary-red'}>
            {icon}
          </span>
        </div>
      )}
      <h4 className={clsx(
        'text-h6 font-semibold mb-2',
        highlight ? 'text-white' : 'text-neutral-900'
      )}>
        {title}
      </h4>
      <p className={clsx(
        'text-body-sm',
        highlight ? 'text-white/90' : 'text-neutral-600'
      )}>
        {description}
      </p>
    </div>
  );
};

export default FeatureBox;
