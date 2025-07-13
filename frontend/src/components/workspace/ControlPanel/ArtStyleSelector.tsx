import React from 'react';

interface ArtStyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
}

const ArtStyleSelector: React.FC<ArtStyleSelectorProps> = ({ value, onChange, isDarkMode }) => (
  <div className="flex gap-2">
    <button
      type="button"
      onClick={() => onChange('realistic')}
      className={`flex-1 p-2 rounded-lg text-sm transition-colors ${
        value === 'realistic'
          ? 'bg-blue-500 text-white'
          : isDarkMode
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      Realistic
    </button>
    <button
      type="button"
      onClick={() => onChange('anime')}
      className={`flex-1 p-2 rounded-lg text-sm transition-colors ${
        value === 'anime'
          ? 'bg-blue-500 text-white'
          : isDarkMode
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      Anime
    </button>
  </div>
);

export default ArtStyleSelector; 