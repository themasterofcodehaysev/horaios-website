import React from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPreviousNext?: boolean;
  maxVisible?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPreviousNext = true,
  maxVisible = 5,
  className,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      const end = Math.min(totalPages, start + maxVisible - 1);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div
      className={clsx(
        'flex items-center justify-center gap-2',
        className
      )}
    >
      {showPreviousNext && (
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={clsx(
            'p-2 rounded-md border border-neutral-300 transition-colors',
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-neutral-100'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {getPageNumbers().map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="px-2 text-neutral-400">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={clsx(
                'min-w-10 h-10 rounded-md text-body-sm font-medium transition-colors',
                currentPage === page
                  ? 'bg-primary-red text-white'
                  : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              )}
            >
              {page}
            </button>
          )}
        </div>
      ))}

      {showPreviousNext && (
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={clsx(
            'p-2 rounded-md border border-neutral-300 transition-colors',
            currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-neutral-100'
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Pagination;
