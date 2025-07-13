import React from 'react';
import { Star, Heart } from 'lucide-react';

const TestimonialCard: React.FC = () => {
  return (
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
  );
};

export default TestimonialCard; 