import React from 'react';
import clsx from 'clsx';
import { Star } from 'lucide-react';
import { Card } from '../ui/Card';
import { getImageUrl } from '../../utils/imageUrl';

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  image?: string;
  featured?: boolean;
  category?: string;
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
  category,
  onClick,
}) => {
  const imageUrl = image ? getImageUrl(image) : null;

  return (
    <Card
      hoverable
      padding="md"
      className={clsx('cursor-pointer h-full flex flex-col justify-between')}
      onClick={onClick}
    >
      <div>
        {imageUrl ? (
          <div className="relative mb-4 overflow-hidden rounded-lg h-44 bg-neutral-100">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            {featured && (
              <div className="absolute top-2.5 right-2.5 z-10">
                <span className="inline-flex items-center gap-1 bg-amber-400 text-neutral-950 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
                  <Star className="w-3 h-3 fill-current" /> Featured
                </span>
              </div>
            )}
          </div>
        ) : null}

        <div className="space-y-3">
          {category && (
            <div>
              <span className="text-body-xs font-semibold px-2.5 py-0.5 rounded-md bg-primary-red/10 text-primary-red">
                {category}
              </span>
            </div>
          )}

          <div className="flex items-start justify-between gap-2 min-w-0">
            <h3 
              className="text-h5 font-semibold text-neutral-900 flex-1 truncate"
              title={title}
            >
              {title}
            </h3>
            {featured && !imageUrl && (
              <span className="inline-flex items-center gap-1 bg-amber-400 text-neutral-950 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm shrink-0">
                <Star className="w-3 h-3 fill-current" /> Featured
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-body-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="font-medium text-primary-red">{date}</span>
              <span>•</span>
              <span>{time}</span>
            </div>
            <p className="flex items-start gap-2">
              <span className="font-medium text-primary-red">📍</span>
              <span className="truncate">{location}</span>
            </p>
          </div>

          {description && (
            <p 
              className="text-body-sm text-neutral-600 line-clamp-2"
              title={description}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-neutral-200 mt-4">
        <button className="text-primary-red font-medium text-body-sm hover:text-primary-dark-red transition-colors">
          Learn More →
        </button>
      </div>
    </Card>
  );
};

export default EventCard;
