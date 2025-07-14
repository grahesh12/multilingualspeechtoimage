import React, { useState, useEffect } from 'react';
import { 
  BenefitsGrid, 
  TrustIndicators, 
  TestimonialCard, 
  CallToAction 
} from './WhyChooseUs/index';
import { Sparkles, Star, Zap } from 'lucide-react';
import { getMe } from '../../utils/authApi';

interface WhyChooseUsProps {
  onEnterWorkspace: () => void;
}

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onEnterWorkspace }) => {
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
      // If not authenticated, the button text will guide them to sign in
      console.log('User needs to sign in first');
    }
  };

  return (
    <section id="why-choose-us" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/5 rounded-full blur-3xl animate-pulse delay-2000" />
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl animate-float" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-16 animate-slide-up">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="glass p-3 rounded-xl">
                <Sparkles className="w-6 h-6 text-gradient" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gradient">
                Why Choose Voice2Vision?
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join the future of creative expression with our innovative AI-powered platform
            </p>
            
            {/* Enhanced Decorative Elements */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500 animate-pulse" />
                <Star className="w-5 h-5 text-yellow-500 animate-pulse delay-300" />
                <Star className="w-5 h-5 text-yellow-500 animate-pulse delay-600" />
              </div>
              <div className="glass px-4 py-2 rounded-full">
                <span className="text-sm font-semibold text-gradient">Trusted by 10,000+ creators</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-500 animate-pulse" />
                <Zap className="w-5 h-5 text-blue-500 animate-pulse delay-300" />
                <Zap className="w-5 h-5 text-blue-500 animate-pulse delay-600" />
              </div>
            </div>
          </div>

          {/* Enhanced Content Sections */}
          <div className="space-y-16">
            <div className="animate-slide-up delay-200">
              <BenefitsGrid />
            </div>

            <div className="animate-slide-up delay-400">
              <TrustIndicators />
            </div>

            <div className="animate-slide-up delay-600">
              <TestimonialCard />
            </div>

            <div className="animate-slide-up delay-800">
              <CallToAction 
                isAuthenticated={isAuthenticated}
                onEnterWorkspace={handleEnterWorkspace}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;