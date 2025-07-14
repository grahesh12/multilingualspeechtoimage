import React, { useState } from 'react';
import { sendTextToServer } from '../../../utils/api';

interface TextInputProps {
  isDarkMode: boolean;
  setFormData: React.Dispatch<React.SetStateAction<{
    prompt: string;
    negativePrompt: string;
    artStyle: string;
    quality: string;
  }>>;
}

const TextInput: React.FC<TextInputProps> = ({ isDarkMode, setFormData }) => {
  const [textInput, setTextInput] = useState('');

  const handleTextInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextInput(value);
    
    // Try to get translation if text is not empty
    if (value.trim()) {
      try {
        const response = await sendTextToServer(value);
        if (response.translation) {
          // Only update the shared prompt (ControlPanel), not the local text field
          setFormData(prev => ({ ...prev, prompt: response.translation }));
          
        }
      } catch (error) {
        console.log('Translation failed, using original text as prompt');
        // Do not update textInput, keep user's original input
      }
    }
  };

  return (
    <div>
      <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Text Input
      </h3>
      
      <textarea
        value={textInput}
        onChange={handleTextInputChange}
        placeholder="Describe the image you want to generate..."
        className={`w-full h-40 resize-none border rounded-xl p-4 text-lg ${
          isDarkMode 
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
      />
    </div>
  );
};

export default TextInput; 