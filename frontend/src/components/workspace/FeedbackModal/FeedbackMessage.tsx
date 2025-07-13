import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface FeedbackMessageProps {
  message: { type: 'success' | 'error'; text: string } | null;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
      message.type === 'success' 
        ? 'bg-green-100 text-green-700 border border-green-200' 
        : 'bg-red-100 text-red-700 border border-red-200'
    }`}>
      {message.type === 'success' ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      <span className="text-sm font-medium">{message.text}</span>
    </div>
  );
};

export default FeedbackMessage; 