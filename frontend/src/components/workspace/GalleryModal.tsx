import React, { useState, useEffect } from 'react';
import { fetchUserGallery } from '../../utils/api';
import { 
  GalleryHeader, 
  SearchAndFilter, 
  GalleryGrid, 
  GalleryPagination 
} from './GalleryModal/index';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

interface ImageData {
  id: string;
  filename: string;
  prompt: string;
  art_style: string;
  quality: string;
  created_at: string;
  url: string;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');

  const fetchImages = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchUserGallery({ page, limit: 12 });
      setImages(response.images);
      setTotalPages(Math.ceil(response.pagination.total / response.pagination.limit));
    } catch (err) {
      setError('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchImages(1);
      setCurrentPage(1);
    }
  }, [isOpen]);

  const handleDownload = async (image: ImageData) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleShare = async (image: ImageData) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My AI Generated Image',
          text: `Check out this image I created with Voice2Vision: "${image.prompt}"`,
          url: image.url,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(image.url);
      alert('Image URL copied to clipboard!');
    }
  };

  const handleDelete = async (imageId: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      // TODO: Implement delete endpoint
      console.log('Delete image:', imageId);
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStyle = selectedStyle === 'all' || image.art_style === selectedStyle;
    return matchesSearch && matchesStyle;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchImages(page);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />
        
        <div className={`inline-block w-full max-w-7xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-xl rounded-2xl`}>
          
          <GalleryHeader isDarkMode={isDarkMode} onClose={onClose} />

          <SearchAndFilter 
            isDarkMode={isDarkMode}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
          />

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className={`text-red-500 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                {error}
              </p>
            </div>
          )}

          {/* Images Grid */}
          {!loading && !error && (
            <>
              <GalleryGrid
                isDarkMode={isDarkMode}
                images={images}
                filteredImages={filteredImages}
                onDownload={handleDownload}
                onShare={handleShare}
                onDelete={handleDelete}
                formatDate={formatDate}
              />

              <GalleryPagination
                isDarkMode={isDarkMode}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;