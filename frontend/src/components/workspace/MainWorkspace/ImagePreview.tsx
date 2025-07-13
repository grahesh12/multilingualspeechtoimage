import React from 'react';
import { Type } from 'lucide-react';

interface ImagePreviewProps {
  isDarkMode: boolean;
  img_path: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ isDarkMode, img_path }) => {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex items-center justify-center h-80 w-full border-2 border-dashed rounded-2xl overflow-hidden mb-8`}>
      {img_path ? (
        <img
          src={`http://localhost:5000/images/${img_path}`}
          alt="Generated Image"
          className="max-h-80 w-auto max-w-full object-contain mx-auto rounded-2xl bg-gray-100 shadow-lg border"
        />
      ) : (
        <div className="text-center w-full">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Type className="w-12 h-12 text-white" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Generated Image Will Appear Here</h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Choose an input method below to get started</p>
        </div>
      )}
    </div>
  );
};

export default ImagePreview; 