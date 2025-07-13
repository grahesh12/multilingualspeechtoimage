import React from 'react';
import { Eye, User, Moon, Sun, ArrowLeft } from 'lucide-react';
import { Coins } from 'lucide-react';

interface HeaderProps {
  onBackToLanding: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  user: { username: string; plan: string; credits: number } | null;
}

const Header: React.FC<HeaderProps> = ({ onBackToLanding, isDarkMode, setIsDarkMode, user }) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToLanding}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <span className={`ml-3 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Voice2Vision
            </span>
          </div>
        </div>

        {/* Right: Profile & Dark Mode */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center`}>
              <User className="w-4 h-4 text-white" />
            </div>
            <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}> 
              <div className="text-sm font-medium">{user?.username || 'Guest'}</div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.plan ? `${user.plan} Plan` : ''}</div>
              {user && (
                <div className={`flex items-center text-xs mt-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                  <Coins className="w-4 h-4 mr-1" />
                  <span>{user.credits} credits</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;