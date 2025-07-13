import React, { useState, useEffect } from 'react';
import { Eye, Home, Star, Users, Info, LogIn, Wand2, Crown } from 'lucide-react';
import PaymentModal from './PaymentModal';
import AuthModal from '../AuthModal';

interface HeaderProps {
  onEnterWorkspace: () => void;
}

const Header: React.FC<HeaderProps> = ({ onEnterWorkspace }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [user, setUser] = useState<{ username: string; plan: string } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for token and fetch user info
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? res.json() : Promise.reject())
        .then((data) => {
          setUser({ username: data.username, plan: data.plan });
        })
        .catch(() => setUser(null));
    }
  }, []);

  const handleAuthSuccess = (user: { username: string; plan: string }, token: string) => {
    setUser(user);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const handleEnterWorkspace = () => {
    if (user) {
      onEnterWorkspace();
    } else {
      // If not logged in, open auth modal
      setAuthModalOpen(true);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl font-bold transition-colors ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              Voice2Vision
            </span>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('home')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-white/20 ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="font-medium text-sm">Home</span>
            </button>
            
            <button
              onClick={() => scrollToSection('features')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-white/20 ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span className="font-medium text-sm">Features</span>
            </button>
            
            <button
              onClick={() => scrollToSection('why-choose-us')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-white/20 ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="font-medium text-sm">Why Choose</span>
            </button>
            
            <button
              onClick={() => scrollToSection('about-us')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-white/20 ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span className="font-medium text-sm">About Us</span>
            </button>
          </nav>

          {/* Right Actions */}
          
          <button
            onClick={handleEnterWorkspace}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-1.5 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center space-x-1.5"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="font-medium text-sm">{user ? 'Generate' : 'Sign In to Generate'}</span>
          </button>
          
          <button 
            onClick={() => setShowPayment(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-4 py-1.5 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center space-x-1.5"
          >
            <Crown className="w-3.5 h-3.5" />
            <span className="font-medium text-sm">Upgrade</span>
          </button>
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user w-4 h-4 text-white"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div className="text-gray-900">
                <div className="text-sm font-medium">{user.username}</div>
                <div className="text-xs text-gray-500">{user.plan} Plan</div>
              </div>
            </div>
          ) : (
            <button
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-white/20 text-white/90 hover:text-white"
              onClick={() => setAuthModalOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in w-3.5 h-3.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" x2="3" y1="12" y2="12"></line></svg>
              <span className="font-medium text-sm">Sign In</span>
            </button>
          )}
        </div>
      </div>
      
      <PaymentModal 
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </header>
  );
};

export default Header;