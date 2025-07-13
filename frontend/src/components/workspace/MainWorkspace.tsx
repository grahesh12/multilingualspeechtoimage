import React, { useState } from 'react';
import { ImagePreview, TabNavigation, SpeechRecorder, AudioUploader, TextInput } from './MainWorkspace/index';

interface MainWorkspaceProps {
  isDarkMode: boolean;
  formData: {
    prompt: string;
    negativePrompt: string;
    artStyle: string;
    quality: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    prompt: string;
    negativePrompt: string;
    artStyle: string;
    quality: string;
  }>>;
  img_path: string;
}

const MainWorkspace: React.FC<MainWorkspaceProps> = ({ isDarkMode, formData, setFormData, img_path }) => {
  const [activeTab, setActiveTab] = useState<'speech' | 'audio' | 'text'>('speech');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'speech':
        return <SpeechRecorder isDarkMode={isDarkMode} setFormData={setFormData} />;
      case 'audio':
        return <AudioUploader isDarkMode={isDarkMode} setFormData={setFormData} />;
      case 'text':
        return <TextInput isDarkMode={isDarkMode} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Image Preview */}
        <ImagePreview isDarkMode={isDarkMode} img_path={img_path} />

        {/* Tab Navigation */}
        <TabNavigation 
          isDarkMode={isDarkMode} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* Tab Content */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default MainWorkspace;