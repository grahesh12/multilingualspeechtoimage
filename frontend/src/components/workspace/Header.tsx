import React from 'react';
import { Eye, User, Moon, Sun, ArrowLeft, Coins, Crown, Settings } from 'lucide-react';

interface HeaderProps {
  onBackToLanding: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  user: { username: string; plan: string; credits: number } | null;
}

const Header: React.FC<HeaderProps> = ({ onBackToLanding, isDarkMode, setIsDarkMode, user }) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-900/95 backdrop-blur-md border-gray-700' : 'bg-white/95 backdrop-blur-md border-gray-200'} border-b shadow-soft`}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Enhanced Left: Logo and Back Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToLanding}
            className={`glass p-3 rounded-xl hover-lift transition-all duration-300 ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 group">
            <div className="glass p-3 rounded-xl hover-glow transition-all duration-300">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-black" />
              </div>
            </div>
            <span className={`text-xl font-bold text-gradient ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Voice2Vision
            </span>
          </div>
        </div>

        {/* Enhanced Right: Controls and Profile */}
        <div className="flex items-center space-x-4">
          {/* Enhanced Credits Display */}
          {user && (
            <div className="glass px-4 py-2 rounded-xl hover-lift transition-all duration-300">
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.credits}
                </span>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  credits
                </span>
              </div>
            </div>
          )}

          {/* Enhanced Plan Badge */}
          {user && user.plan && (
            <div className="glass px-3 py-2 rounded-xl hover-lift transition-all duration-300">
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-gradient" />
                <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.plan}
                </span>
              </div>
            </div>
          )}

          {/* Enhanced Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`glass p-3 rounded-xl hover-lift transition-all duration-300 ${
              isDarkMode ? 'text-yellow-300 hover:text-yellow-200' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Enhanced Settings Button */}
          <button
            className={`glass p-3 rounded-xl hover-lift transition-all duration-300 ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Enhanced User Profile */}
          <div className="flex items-center space-x-3 group">
            <div className="glass p-2 rounded-xl hover-lift transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}> 
              <div className="text-sm font-semibold">{user?.username || 'Guest'}</div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {user?.plan ? `${user.plan} Plan` : 'Free Plan'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;