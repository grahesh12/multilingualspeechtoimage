import React from 'react';
import { X } from 'lucide-react';

interface GalleryHeaderProps {
  isDarkMode: boolean;
  onClose: () => void;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({ isDarkMode, onClose }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        My Gallery
      </h2>
      <button
        onClick={onClose}
        className={`p-2 rounded-lg transition-colors ${
          isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
        }`}
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};

export default GalleryHeader; 