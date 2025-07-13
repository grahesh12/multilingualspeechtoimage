import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryPaginationProps {
  isDarkMode: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const GalleryPagination: React.FC<GalleryPaginationProps> = ({ 
  isDarkMode, 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-8 space-x-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg ${
          currentPage === 1
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-100'
        } ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className={`px-4 py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg ${
          currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-100'
        } ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default GalleryPagination; 