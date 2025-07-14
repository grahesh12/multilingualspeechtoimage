import React, { useState } from 'react';
import { sendFeedbackToServer } from '../../utils/api';
import { 
  FeedbackHeader, 
  FeedbackMessage, 
  StarRating, 
  FeedbackButtons 
} from './FeedbackModal/index';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (rating === 0) {
      setMessage({ type: 'error', text: 'Please select a rating' });
      return;
    }
    
    if (!feedback.trim()) {
      setMessage({ type: 'error', text: 'Please enter your feedback' });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const response = await sendFeedbackToServer({
        rating,
        feedback: feedback.trim(),
        category
      });
      
      if (response.status === 'success') {
        setMessage({ type: 'success', text: 'Feedback submitted successfully!' });
        // Reset form
        setRating(0);
        setFeedback('');
        setCategory('general');
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setMessage(null);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to submit feedback' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit feedback. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setFeedback('');
      setCategory('general');
      setMessage(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={handleClose} />
        
        <div className={`inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-xl rounded-2xl`}>
          
          <FeedbackHeader isDarkMode={isDarkMode} isSubmitting={isSubmitting} onClose={handleClose} />

          <FeedbackMessage message={message} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
                className={`w-full border rounded-lg p-3 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="general">General Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="performance">Performance Issue</option>
              </select>
            </div>

            <StarRating 
              rating={rating} 
              setRating={setRating} 
              isDarkMode={isDarkMode} 
              isSubmitting={isSubmitting} 
            />

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Your Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={4}
                disabled={isSubmitting}
                className={`w-full border rounded-lg p-3 resize-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                required
              />
            </div>

            <FeedbackButtons 
              isDarkMode={isDarkMode} 
              isSubmitting={isSubmitting} 
              onCancel={handleClose} 
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;