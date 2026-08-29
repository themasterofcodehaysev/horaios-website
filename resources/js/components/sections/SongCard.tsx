import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import type { SongItem } from '../../admin/types';

interface SongCardProps {
  song: SongItem;
  /**
   * 'grid' - white card used in song listing grids (default).
   * 'spotlight' - dark gradient card used to spotlight featured songs.
   */
  variant?: 'grid' | 'spotlight';
  className?: string;
}

export const SongCard: React.FC<SongCardProps> = ({ song, variant = 'grid', className }) => {
  const href = `/songs/${song.slug}`;

  if (variant === 'spotlight') {
    return (
      <Link
        to={href}
        className={`group relative bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between overflow-hidden ${className || ''}`}
      >
        <div className="absolute top-3 right-3">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
        </div>
        <div>
          {song.category && (
            <span className="inline-block text-body-xs font-semibold text-primary-300 uppercase tracking-wider mb-2">
              {song.category.name}
            </span>
          )}
          <h3 className="text-h4 font-bold leading-tight group-hover:text-primary-100 transition-colors mb-2">
            {song.title}
          </h3>
          <p className="text-body-xs text-neutral-300">
            {song.artist || 'Traditional Worship'}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-body-xs font-medium text-neutral-300 group-hover:text-white">
          <span>Read Lyrics</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={href}
      className={`group bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg hover:border-neutral-300 transition-all duration-200 flex flex-col justify-between ${className || ''}`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          {song.category ? (
            <span className="text-body-xs font-semibold px-2.5 py-0.5 rounded-md bg-primary-red/10 text-primary-red">
              {song.category.name}
            </span>
          ) : (
            <span className="text-body-xs text-neutral-400">Worship</span>
          )}
          {song.featured && (
            <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
          )}
        </div>
        <h3 className="text-h5 font-bold text-neutral-900 group-hover:text-primary-red transition-colors leading-snug mb-1">
          {song.title}
        </h3>
        <p className="text-body-xs text-neutral-500">
          {song.artist || 'Traditional'} {song.composer && `• ${song.composer}`}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-body-xs font-semibold text-primary-red">
        <span>View Lyrics</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};

export default SongCard;
