import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  isDarkMode: boolean;
  isSubmitting: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating, isDarkMode, isSubmitting }) => {
  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Rating <span className="text-red-500">*</span>
      </label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isSubmitting}
            onClick={() => setRating(star)}
            className={`p-1 transition-colors ${rating >= star ? 'text-yellow-400' : isDarkMode ? 'text-gray-600' : 'text-gray-300'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:text-yellow-400'}`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRating; 