import React from 'react';

interface Quality {
  id: string;
  name: string;
  description: string;
}

interface QualitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
  qualities: Quality[];
}

const QualitySelector: React.FC<QualitySelectorProps> = ({ value, onChange, isDarkMode, qualities }) => (
  <div className="space-y-2">
    {qualities.map((q) => (
      <button
        type="button"
        key={q.id}
        onClick={() => onChange(q.id)}
        className={`w-full p-3 rounded-lg text-left transition-colors ${
          value === q.id
            ? 'bg-blue-500 text-white'
            : isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="font-medium">{q.name}</span>
          <span className="text-sm opacity-75">{q.description}</span>
        </div>
      </button>
    ))}
  </div>
);

export default QualitySelector; 