import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Play } from 'lucide-react';

interface SermonCardProps {
  title: string;
  speaker: string;
  date: string;
  series?: string;
  image?: string;
  videoUrl?: string;
  description?: string;
  onClick?: () => void;
}

export const SermonCard: React.FC<SermonCardProps> = ({
  title,
  speaker,
  date,
  series,
  image,
  videoUrl,
  description,
  onClick,
}) => {
  return (
    <Card hoverable padding="md" onClick={onClick} className="flex flex-col cursor-pointer">
      <div className="relative mb-4 overflow-hidden rounded-lg h-48 bg-neutral-200 group">
        {image ? (
          <>
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {videoUrl && (
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <button className="w-16 h-16 bg-primary-red text-white rounded-full flex items-center justify-center hover:bg-primary-dark-red transition-colors">
                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-red/20 to-primary-red/20 flex items-center justify-center">
            <Play className="w-12 h-12 text-primary-red/40" />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col space-y-2">
        {series && (
          <Badge variant="secondary" size="sm">
            {series}
          </Badge>
        )}

        <h3 className="text-h6 font-semibold text-neutral-900 line-clamp-2">
          {title}
        </h3>

        <div className="flex flex-col text-body-sm text-neutral-600">
          <span className="font-medium text-primary-red">{speaker}</span>
          <span>{date}</span>
        </div>

        {description && (
          <p className="text-body-sm text-neutral-600 line-clamp-2">
            {description}
          </p>
        )}

        <div className="pt-3 border-t border-neutral-200 mt-auto">
          <button className="text-primary-red font-medium text-body-sm hover:text-primary-dark-red transition-colors">
            Watch Sermon →
          </button>
        </div>
      </div>
    </Card>
  );
};

export default SermonCard;
