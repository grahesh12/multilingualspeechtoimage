import React from 'react';
import { Palette } from 'lucide-react';
import ImageCard from './ImageCard';

interface ImageData {
  id: string;
  filename: string;
  prompt: string;
  art_style: string;
  quality: string;
  created_at: string;
  url: string;
}

interface GalleryGridProps {
  isDarkMode: boolean;
  images: ImageData[];
  filteredImages: ImageData[];
  onDownload: (image: ImageData) => void;
  onShare: (image: ImageData) => void;
  onDelete: (imageId: string) => void;
  formatDate: (dateString: string) => string;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ 
  isDarkMode, 
  images, 
  filteredImages, 
  onDownload, 
  onShare, 
  onDelete, 
  formatDate 
}) => {
  if (filteredImages.length === 0) {
    return (
      <div className="text-center py-12">
        <Palette className={`w-16 h-16 mx-auto mb-4 ${
          isDarkMode ? 'text-gray-600' : 'text-gray-400'
        }`} />
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {images.length === 0 ? 'No images generated yet' : 'No images match your search'}
        </p>
        <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Start creating images to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredImages.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          isDarkMode={isDarkMode}
          onDownload={onDownload}
          onShare={onShare}
          onDelete={onDelete}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};

export default GalleryGrid; 