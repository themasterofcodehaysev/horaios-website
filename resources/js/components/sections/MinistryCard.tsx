import React from 'react';
import { Card } from '../ui/Card';

interface MinistryCardProps {
  name: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  leader?: string;
  members?: number;
  schedule?: string;
  onClick?: () => void;
}

export const MinistryCard: React.FC<MinistryCardProps> = ({
  name,
  description,
  icon,
  image,
  leader,
  members,
  schedule,
  onClick,
}) => {
  return (
    <Card hoverable padding="lg" className="cursor-pointer flex flex-col" onClick={onClick}>
      {image ? (
        <div className="mb-4 overflow-hidden rounded-lg h-40 bg-neutral-200">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : icon ? (
        <div className="mb-4 w-full h-40 bg-gradient-to-br from-primary-navy/10 to-accent-red/10 rounded-lg flex items-center justify-center">
          <div className="text-neutral-400">
            {icon}
          </div>
        </div>
      ) : null}

      <div className="flex-1 flex flex-col space-y-2">
        <h3 className="text-h6 font-semibold text-neutral-900">
          {name}
        </h3>

        <p className="text-body-sm text-neutral-600">
          {description}
        </p>

        {leader && (
          <div className="pt-3 border-t border-neutral-200">
            <p className="text-label-sm font-medium text-neutral-700">
              Leader: <span className="text-primary-navy">{leader}</span>
            </p>
          </div>
        )}

        {members && (
          <p className="text-body-xs text-neutral-500">
            {members} members
          </p>
        )}

        {schedule && (
          <p className="text-body-xs text-neutral-500">
            {schedule}
          </p>
        )}

        <button className="mt-auto pt-3 border-t border-neutral-200 text-accent-red font-medium text-body-sm hover:text-accent-dark-red transition-colors">
          Learn More →
        </button>
      </div>
    </Card>
  );
};

export default MinistryCard;
