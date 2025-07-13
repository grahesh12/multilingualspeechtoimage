import React, { useState, useEffect } from 'react';
import { Mic, Sparkles, Zap, Eye } from 'lucide-react';

interface HeroProps {
  onEnterWorkspace: () => void;
}

const Hero: React.FC<HeroProps> = ({ onEnterWorkspace }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? res.json() : Promise.reject())
        .then(() => setIsAuthenticated(true))
        .catch(() => setIsAuthenticated(false));
    }
  }, []);

  const handleEnterWorkspace = () => {
    if (isAuthenticated) {
      onEnterWorkspace();
    } else {
      // If not authenticated, the button text will guide them to sign in
      // You could also add a toast notification here
      console.log('User needs to sign in first');
    }
  };

  return (
    <section id="home" className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-24 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Eye className="w-8 h-8 text-yellow-300" />
            </div>
            <span className="ml-3 text-2xl font-bold">Voice2Vision</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transform Your
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Voice into Art
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Harness the power of AI to convert speech from any language into stunning, high-quality images. 
            Simply speak your vision, and watch it come to life.
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Mic className="w-5 h-5 mr-2 text-green-300" />
              <span className="text-sm font-medium">Multilingual Speech</span>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Zap className="w-5 h-5 mr-2 text-yellow-300" />
              <span className="text-sm font-medium">Real-time Generation</span>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Sparkles className="w-5 h-5 mr-2 text-purple-300" />
              <span className="text-sm font-medium">AI Enhancement</span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleEnterWorkspace}
            className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <span className="relative z-10 flex items-center">
              {isAuthenticated ? 'Try For Free' : 'Sign In to Start'}
              <Sparkles className="w-5 h-5 ml-2 group-hover:animate-spin" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
          </button>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;