import React, { useState } from 'react';

export interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
  category?: string;
}

interface GalleryProps {
  items: GalleryItem[];
  columns?: 2 | 3 | 4;
}

export const Gallery: React.FC<GalleryProps> = ({ items, columns = 3 }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
  }[columns];

  return (
    <>
      <div className={`grid ${gridCols} gap-4`}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group relative overflow-hidden rounded-xl bg-neutral-200 aspect-video cursor-pointer shadow-elevation-sm hover:shadow-elevation-md transition-all duration-300"
          >
            <img
              src={item.url}
              alt={item.caption || 'Church photo'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white text-body-sm font-medium">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <img
              src={selectedImage.url}
              alt={selectedImage.caption || 'Expanded view'}
              className="max-h-[80vh] w-auto object-contain rounded-lg shadow-elevation-xl"
            />
            {selectedImage.caption && (
              <p className="text-white text-body-base mt-4 text-center">{selectedImage.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
