import React from 'react';

interface NegativePromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isDarkMode: boolean;
  placeholder?: string;
}

const NegativePromptInput: React.FC<NegativePromptInputProps> = ({ value, onChange, isDarkMode, placeholder }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full h-16 resize-none border rounded-lg p-3 text-sm ${
      isDarkMode 
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
  />
);

export default NegativePromptInput; 