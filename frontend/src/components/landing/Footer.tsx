import React from 'react';
import { Sparkles, Mail, Twitter, Github, Linkedin, Eye, ArrowUp, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Enhanced Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center mb-6">
              <div className="glass p-3 rounded-xl mr-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-black" />
                </div>
              </div>
              <span className="text-xl font-bold text-gradient">Voice2Vision</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Transform your voice into stunning visual masterpieces with the power of AI.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="glass p-3 rounded-xl hover-lift transition-all duration-300 text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="glass p-3 rounded-xl hover-lift transition-all duration-300 text-gray-400 hover:text-white">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="glass p-3 rounded-xl hover-lift transition-all duration-300 text-gray-400 hover:text-white">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="glass p-3 rounded-xl hover-lift transition-all duration-300 text-gray-400 hover:text-white">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enhanced Product Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gradient">Product</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#features" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Features</span>
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Pricing</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">API</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Documentation</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Enhanced Company Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gradient">Company</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#about" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">About</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Blog</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Careers</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Contact</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Enhanced Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gradient">Support</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Help Center</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Community</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Terms of Service</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-gray-400">Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-gray-400">by Voice2Vision Team</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <p className="text-gray-400">&copy; 2025 Voice2Vision. All rights reserved.</p>
              
              {/* Enhanced Scroll to Top Button */}
              <button
                onClick={scrollToTop}
                className="glass p-3 rounded-xl hover-lift transition-all duration-300 text-gray-400 hover:text-white"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;