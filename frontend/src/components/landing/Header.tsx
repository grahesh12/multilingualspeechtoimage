import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Crown } from 'lucide-react';
import AuthModal from '../AuthModal';

interface HeaderProps {
  onEnterWorkspace: () => void;
}

const Header: React.FC<HeaderProps> = ({ onEnterWorkspace }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        fetch('http://localhost:5000/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.ok ? res.json() : Promise.reject())
          .then((userData) => {
            setIsAuthenticated(true);
            setUser(userData);
          })
          .catch(() => {
            setIsAuthenticated(false);
            setUser(null);
          });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
    
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authStateChanged', handleAuthChange);

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new Event('authStateChanged'));
  };

  const handleEnterWorkspace = () => {
    if (isAuthenticated) {
      onEnterWorkspace();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass backdrop-blur-md shadow-soft' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-3 group">
              <div className="glass p-2 rounded-xl hover-glow transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">V2V</span>
                </div>
              </div>
              <span className="text-xl font-bold text-gradient">Voice2Vision</span>
            </div>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-white hover:text-yellow-300 transition-colors duration-300 font-medium">
                Home
              </a>
              <a href="#features" className="text-white hover:text-yellow-300 transition-colors duration-300 font-medium">
                Features
              </a>
              <a href="#about" className="text-white hover:text-yellow-300 transition-colors duration-300 font-medium">
                About
              </a>
              <a href="#pricing" className="text-white hover:text-yellow-300 transition-colors duration-300 font-medium">
                Pricing
              </a>
            </nav>

            {/* Enhanced Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Enhanced Upgrade Button */}
                  <button className="btn-secondary px-4 py-2 text-sm flex items-center space-x-2 group">
                    <Crown className="w-4 h-4 group-hover:animate-pulse" />
                    <span>Upgrade</span>
                  </button>
                  
                  {/* Enhanced User Profile */}
                  <div className="relative group">
                    <button className="glass px-4 py-2 rounded-xl hover-lift flex items-center space-x-2 transition-all duration-300">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-medium">
                        {user?.username || 'User'}
                      </span>
                    </button>
                    
                    {/* Enhanced Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                      <div className="py-2">
                        <button
                          onClick={handleEnterWorkspace}
                          className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2"
                        >
                          <span>Workspace</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="btn-outline text-white border-white hover:bg-white hover:text-black"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="btn-primary"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* Enhanced Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden glass p-2 rounded-xl hover-glow transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          {/* Enhanced Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden glass mt-4 rounded-xl p-4 animate-slide-down">
              <nav className="flex flex-col space-y-4">
                <a href="#home" className="text-white hover:text-yellow-300 transition-colors duration-300 font-medium">
                  Home
                </a>
                <a href="#features" className="text-white hover:text-yellow-300 transition-colors duration-300 font-medium">
                  Features
                </a>
                <a href="#about" className="text-white hover:text-yellow-300 transition-colors duration-300 font-medium">
                  About
                </a>
                <a href="#pricing" className="text-white hover:text-yellow-300 transition-colors duration-300 font-medium">
                  Pricing
                </a>
                
                {isAuthenticated ? (
                  <div className="pt-4 border-t border-white/20 space-y-3">
                    <button className="btn-secondary w-full text-sm flex items-center justify-center space-x-2">
                      <Crown className="w-4 h-4" />
                      <span>Upgrade</span>
                    </button>
                    <button
                      onClick={handleEnterWorkspace}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                    >
                      Workspace
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-white/20 space-y-3">
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="btn-outline w-full text-white border-white hover:bg-white hover:text-black"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="btn-primary w-full"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;