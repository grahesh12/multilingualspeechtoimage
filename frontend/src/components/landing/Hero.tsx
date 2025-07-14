import React, { useState, useEffect } from 'react';
import { Mic, Sparkles, Zap, Eye, ArrowDown } from 'lucide-react';
import { getMe } from '../../utils/authApi';

interface HeroProps {
  onEnterWorkspace: () => void;
}

const Hero: React.FC<HeroProps> = ({ onEnterWorkspace }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      getMe()
        .then(() => setIsAuthenticated(true))
        .catch((error: any) => {
          setIsAuthenticated(false);
          if (token && error?.message && !/token/i.test(error.message)) {
            console.error('Auth check failed:', error);
          }
        });
    };

    checkAuth();
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const handleEnterWorkspace = () => {
    if (isAuthenticated) {
      onEnterWorkspace();
    } else {
      console.log('User needs to sign in first');
    }
  };

  return (
    <section id="home" className="min-h-screen relative overflow-hidden">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000" />
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-float" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-24 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Logo/Brand */}
          <div className="flex items-center justify-center mb-8 animate-fade-in">
            <div className="glass p-4 rounded-2xl hover-glow">
              <Eye className="w-8 h-8 text-yellow-300" />
            </div>
            <span className="ml-3 text-2xl font-bold text-gradient">Voice2Vision</span>
          </div>

          {/* Enhanced Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
            Transform Your
            <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-glow">
              Voice into Art
            </span>
          </h1>

          {/* Enhanced Subheading */}
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-200">
            Harness the power of AI to convert speech from any language into stunning, high-quality images. 
            Simply speak your vision, and watch it come to life.
          </p>

          {/* Enhanced Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 animate-slide-up delay-300">
            <div className="glass px-6 py-3 rounded-full hover-lift group">
              <Mic className="w-5 h-5 mr-2 text-green-300 group-hover:animate-bounce inline" />
              <span className="text-sm font-medium">Multilingual Speech</span>
            </div>
            <div className="glass px-6 py-3 rounded-full hover-lift group">
              <Zap className="w-5 h-5 mr-2 text-yellow-300 group-hover:animate-pulse inline" />
              <span className="text-sm font-medium">Real-time Generation</span>
            </div>
            <div className="glass px-6 py-3 rounded-full hover-lift group">
              <Sparkles className="w-5 h-5 mr-2 text-purple-300 group-hover:animate-spin inline" />
              <span className="text-sm font-medium">AI Enhancement</span>
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <div className="animate-slide-up delay-400">
            <button
              onClick={handleEnterWorkspace}
              className="btn-primary text-lg px-12 py-4 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                {isAuthenticated ? 'Try For Free' : 'Sign In to Start'}
                <Sparkles className="w-5 h-5 ml-2 group-hover:animate-spin" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </button>
          </div>

          {/* Enhanced Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
            <div className="glass w-6 h-10 rounded-full flex justify-center items-center">
              <ArrowDown className="w-4 h-4 text-white animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;