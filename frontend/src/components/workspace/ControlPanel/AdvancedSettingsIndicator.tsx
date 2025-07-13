import React from 'react';

interface AdvancedSettingsIndicatorProps {
  isDarkMode: boolean;
}

const AdvancedSettingsIndicator: React.FC<AdvancedSettingsIndicatorProps> = ({ isDarkMode }) => (
  <div className={`text-xs p-3 rounded-xl border-2 ${
    isDarkMode ? 'bg-blue-900/30 text-blue-300 border-blue-700' : 'bg-blue-50 text-blue-600 border-blue-200'
  }`}>
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
      <span className="font-medium">Advanced settings active</span>
    </div>
  </div>
);

export default AdvancedSettingsIndicator; 