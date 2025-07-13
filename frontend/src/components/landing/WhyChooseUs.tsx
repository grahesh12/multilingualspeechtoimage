import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Clock, 
  Award, 
  Users, 
  Zap, 
  Heart,
  Star,
  Sparkles
} from 'lucide-react';

interface WhyChooseUsProps {
  onEnterWorkspace: () => void;
}

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onEnterWorkspace }) => {
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
      console.log('User needs to sign in first');
    }
  };

  const benefits = [
    {
      icon: Shield,
      title: 'Privacy Protected',
      description: 'Your voice data and images are processed securely with end-to-end encryption.'
    },
    {
      icon: Clock,
      title: 'Lightning Fast',
      description: 'Generate high-quality images in seconds, not minutes.'
    },
    {
      icon: Award,
      title: 'Professional Quality',
      description: 'Studio-grade results suitable for commercial and artistic use.'
    },
    {
      icon: Users,
      title: 'Global Community',
      description: 'Join thousands of creators worldwide using our platform daily.'
    }
  ];

  return (
    <section id="why-choose-us" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Voice2Vision?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join the future of creative expression with our innovative AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start space-x-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
                <div className="text-gray-600">Images Generated</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
                <div className="text-gray-600">Languages Supported</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime Guarantee</div>
              </div>
            </div>
          </div>

          {/* Testimonial Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center mb-12">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-300 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl font-medium mb-4">
              "ImageCraft AI has revolutionized how I create concept art. The multilingual support 
              means I can work in my native language and get perfect results every time."
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <Heart className="w-6 h-6 text-pink-300" />
              </div>
              <div>
                <div className="font-semibold">Sarah Chen</div>
                <div className="text-blue-200">Digital Artist</div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <button
              onClick={handleEnterWorkspace}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="flex items-center">
                {isAuthenticated ? 'Start Creating Now' : 'Sign In to Start Creating'}
                <Sparkles className="w-5 h-5 ml-2 group-hover:animate-spin" />
              </span>
            </button>
            <p className="text-gray-600 mt-4">
              No credit card required • Free tier available • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;