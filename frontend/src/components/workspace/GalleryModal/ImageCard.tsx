import React from 'react';
import { Download, Share2, Trash2, Calendar } from 'lucide-react';

interface ImageData {
  id: string;
  filename: string;
  prompt: string;
  art_style: string;
  quality: string;
  created_at: string;
  url: string;
}

interface ImageCardProps {
  image: ImageData;
  isDarkMode: boolean;
  onDownload: (image: ImageData) => void;
  onShare: (image: ImageData) => void;
  onDelete: (imageId: string) => void;
  formatDate: (dateString: string) => string;
}

const ImageCard: React.FC<ImageCardProps> = ({ 
  image, 
  isDarkMode, 
  onDownload, 
  onShare, 
  onDelete, 
  formatDate 
}) => {
  return (
    <div className={`group relative rounded-xl overflow-hidden ${
      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
    }`}>
      <img
        src={image.url}
        alt={image.prompt}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => onDownload(image)}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4 text-gray-700" />
          </button>
          <button 
            onClick={() => onShare(image)}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4 text-gray-700" />
          </button>
          <button 
            onClick={() => onDelete(image.id)}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
          {image.prompt.length > 50 ? `${image.prompt.substring(0, 50)}...` : image.prompt}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="capitalize">{image.art_style}</span>
          <span className="uppercase">{image.quality}</span>
        </div>
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(image.created_at)}
        </div>
      </div>
    </div>
  );
};

export default ImageCard; 