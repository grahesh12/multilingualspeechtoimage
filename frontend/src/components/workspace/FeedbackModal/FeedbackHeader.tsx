import React from 'react';
import { X } from 'lucide-react';

interface FeedbackHeaderProps {
  isDarkMode: boolean;
  isSubmitting: boolean;
  onClose: () => void;
}

const FeedbackHeader: React.FC<FeedbackHeaderProps> = ({ isDarkMode, isSubmitting, onClose }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Send Feedback
      </h2>
      <button
        onClick={onClose}
        disabled={isSubmitting}
        className={`p-2 rounded-lg transition-colors ${
          isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};

export default FeedbackHeader; 