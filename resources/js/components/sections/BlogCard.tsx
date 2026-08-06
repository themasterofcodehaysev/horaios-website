import React from 'react';
import clsx from 'clsx';
import { Card } from '../ui/Card';

interface BlogCardProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category?: string;
  featured?: boolean;
  onClick?: () => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  title,
  excerpt,
  author,
  date,
  image,
  category,
  featured = false,
  onClick,
}) => {
  return (
    <Card
      hoverable
      padding="md"
      className={clsx('cursor-pointer flex flex-col', featured && 'md:col-span-2')}
      onClick={onClick}
    >
      <div className="mb-4 overflow-hidden rounded-lg h-48 bg-neutral-200">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 flex flex-col space-y-3">
        {category && (
          <div className="flex gap-2">
            <span className="text-label-sm font-semibold text-accent-red uppercase">
              {category}
            </span>
          </div>
        )}

        <h3 className={clsx(
          'font-semibold text-neutral-900 line-clamp-2',
          featured ? 'text-h4' : 'text-h6'
        )}>
          {title}
        </h3>

        <p className="text-body-sm text-neutral-600 line-clamp-2">
          {excerpt}
        </p>

        <div className="flex items-center justify-between text-body-xs text-neutral-500 mt-auto pt-3 border-t border-neutral-200">
          <span>{author}</span>
          <span>{date}</span>
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
