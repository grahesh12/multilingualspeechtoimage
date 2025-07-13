import React from 'react';
import { Send } from 'lucide-react';

interface FeedbackButtonsProps {
  isDarkMode: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ isDarkMode, isSubmitting, onCancel }) => {
  return (
    <div className="flex space-x-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
          isDarkMode 
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Send className="w-4 h-4" />
        )}
        <span>{isSubmitting ? 'Sending...' : 'Send'}</span>
      </button>
    </div>
  );
};

export default FeedbackButtons; 