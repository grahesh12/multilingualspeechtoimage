import React from 'react';
import { Mic, Upload, Type } from 'lucide-react';

interface TabNavigationProps {
  isDarkMode: boolean;
  activeTab: 'speech' | 'audio' | 'text';
  setActiveTab: (tab: 'speech' | 'audio' | 'text') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ isDarkMode, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'speech', label: 'Speech', icon: Mic },
    { id: 'audio', label: 'Audio File', icon: Upload },
    { id: 'text', label: 'Text', icon: Type }
  ];

  return (
    <div className="mb-6">
      <div className="flex justify-center">
        <div className={`inline-flex p-1 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} shadow-lg`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'speech' | 'audio' | 'text')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                  : isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation; 