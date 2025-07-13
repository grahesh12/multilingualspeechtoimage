import React from 'react';
import { Wand2, Image, MessageCircle, Crown } from 'lucide-react';

interface SidebarProps {
  activeSection: 'create' | 'gallery' | 'feedback' | 'upgrade';
  onSectionChange: (section: 'create' | 'gallery' | 'feedback' | 'upgrade') => void;
  isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, isDarkMode }) => {
  const menuItems = [
    { id: 'create', label: 'Create', icon: Wand2 },
    { id: 'gallery', label: 'My Gallery', icon: Image },
    { id: 'feedback', label: 'Feedback', icon: MessageCircle },
    { id: 'upgrade', label: 'Upgrade', icon: Crown }
  ];

  return (
    <div className={`w-64 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r min-h-screen pt-4`}>
      <nav className="px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id as any)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeSection === item.id
                ? isDarkMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-50 text-blue-600 border border-blue-200'
                : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;