import React, { useState, useEffect } from 'react';
import { X, Download, Share2, Heart, Trash2, Filter, Search, ChevronLeft, ChevronRight, Calendar, Palette } from 'lucide-react';
import { fetchUserGallery } from '../../utils/server';

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
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  const fetchImages = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchUserGallery(page, 12);
      if (response.status === 'success') {
        setImages(response.images);
        setTotalPages(Math.ceil(response.pagination.total / response.pagination.limit));
      } else {
        setError(response.error || 'Failed to fetch images');
      }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />
        
        <div className={`inline-block w-full max-w-7xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-xl rounded-2xl`}>
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

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search by prompt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className={`px-4 py-2 border rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Styles</option>
              <option value="realistic">Realistic</option>
              <option value="anime">Anime</option>
            </select>
          </div>

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
              {filteredImages.length === 0 ? (
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredImages.map((image) => (
                    <div key={image.id} className={`group relative rounded-xl overflow-hidden ${
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
                            onClick={() => handleDownload(image)}
                            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4 text-gray-700" />
                          </button>
                          <button 
                            onClick={() => handleShare(image)}
                            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                            title="Share"
                          >
                            <Share2 className="w-4 h-4 text-gray-700" />
                          </button>
                          <button 
                            onClick={() => handleDelete(image.id)}
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
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-8 space-x-2">
                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      fetchImages(currentPage - 1);
                    }}
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
                    onClick={() => {
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      fetchImages(currentPage + 1);
                    }}
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;