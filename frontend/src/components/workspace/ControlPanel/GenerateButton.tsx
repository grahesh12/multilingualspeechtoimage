import React from 'react';

interface GenerateButtonProps {
  isSubmitting: boolean;
  disabled: boolean;
  isDarkMode: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ isSubmitting, disabled, isDarkMode, onClick, children }) => (
  <button
    type="submit"
    disabled={isSubmitting || disabled}
    onClick={onClick}
    className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 mt-4 ${
      isSubmitting || disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    {children}
  </button>
);

export default GenerateButton; 
