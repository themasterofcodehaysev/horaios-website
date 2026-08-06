import React from 'react';
import clsx from 'clsx';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  image?: string;
  featured?: boolean;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  time,
  location,
  description,
  image,
  featured = false,
  onClick,
}) => {
  return (
    <Card
      hoverable
      padding={featured ? 'lg' : 'md'}
      shadow={featured ? 'lg' : 'md'}
      className={clsx('cursor-pointer', featured && 'md:col-span-2')}
      onClick={onClick}
    >
      {image && (
        <div className="mb-4 overflow-hidden rounded-lg h-40 bg-neutral-200">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-h5 font-semibold text-neutral-900 flex-1">
            {title}
          </h3>
          {featured && (
            <Badge variant="primary" size="sm">
              Featured
            </Badge>
          )}
        </div>

        <div className="space-y-1.5 text-body-sm text-neutral-600">
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary-navy">{date}</span>
            <span>•</span>
            <span>{time}</span>
          </div>
          <p className="flex items-start gap-2">
            <span className="font-medium text-primary-navy">📍</span>
            <span>{location}</span>
          </p>
        </div>

        {description && (
          <p className="text-body-sm text-neutral-600 line-clamp-2">
            {description}
          </p>
        )}

        <div className="pt-3 border-t border-neutral-200">
          <button className="text-accent-red font-medium text-body-sm hover:text-accent-dark-red transition-colors">
            Learn More →
          </button>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
