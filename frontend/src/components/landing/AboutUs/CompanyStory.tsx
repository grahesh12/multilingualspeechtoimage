import React from 'react';
import { Eye } from 'lucide-react';

const CompanyStory: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Voice2Vision was born from a simple observation: creativity shouldn't be limited by technical barriers 
            or language constraints. In 2023, our founders recognized that while AI image generation was advancing 
            rapidly, it remained inaccessible to many due to complex interfaces and language limitations.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            We set out to build a platform that would allow anyone, anywhere, to transform their spoken ideas 
            into stunning visual art. Today, we're proud to serve creators from over 100 countries, supporting 
            dozens of languages and generating millions of images.
          </p>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2M+</div>
              <div className="text-gray-600">Images Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">100+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">50+</div>
              <div className="text-gray-600">Languages</div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
            <Eye className="w-16 h-16 mb-6" />
            <h4 className="text-2xl font-bold mb-4">Our Vision</h4>
            <p className="text-blue-100">
              A world where every person can effortlessly transform their imagination into visual reality, 
              breaking down barriers between thought and creation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyStory; 