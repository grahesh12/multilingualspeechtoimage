import React from 'react';
import { Sparkles } from 'lucide-react';

interface CallToActionProps {
  isAuthenticated: boolean;
  onEnterWorkspace: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ isAuthenticated, onEnterWorkspace }) => {
  return (
    <div className="text-center">
      <button
        onClick={onEnterWorkspace}
        className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
      >
        <span className="flex items-center">
          {isAuthenticated ? 'Start Creating Now' : 'Sign In to Start Creating'}
          <Sparkles className="w-5 h-5 ml-2 group-hover:animate-spin" />
        </span>
      </button>
      <p className="text-gray-600 mt-4">
        No credit card required • Free tier available • Cancel anytime
      </p>
    </div>
  );
};

export default CallToAction; 