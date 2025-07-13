import React, { useState } from 'react';
import { Wand2, Sparkles, Settings, Coins } from 'lucide-react';
import PromptInput from './ControlPanel/PromptInput';
import ArtStyleSelector from './ControlPanel/ArtStyleSelector';
import QualitySelector from './ControlPanel/QualitySelector';
import NegativePromptInput from './ControlPanel/NegativePromptInput';
import GenerateButton from './ControlPanel/GenerateButton';
import AdvancedSettingsIndicator from './ControlPanel/AdvancedSettingsIndicator';
import { enhancePromptWithAdvancedSettings, AdvancedSettingsData } from './ControlPanel/PromptEnhancer';
import { sendFormDataToServer } from '../../utils/server';

interface ControlPanelProps {
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
  setImgPath: React.Dispatch<React.SetStateAction<string>>;
  user: { username: string; plan: string; credits: number } | null;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ isDarkMode, formData, setFormData, setImgPath, user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettingsData | null>(null);

  const qualities = [
    { id: 'standard', name: 'Standard', description: '1024x1024' },
    { id: 'hd', name: 'HD', description: '1792x1024' },
    { id: 'ultra', name: 'Ultra HD', description: '2048x2048' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user || user.credits < 5) {
      setError('Insufficient credits. You need at least 5 credits to generate an image.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Enhance the prompt with advanced settings if they exist
      let enhancedFormData = { ...formData };
      if (advancedSettings) {
        enhancedFormData.prompt = enhancePromptWithAdvancedSettings(formData.prompt, advancedSettings);
      }
      const response = await sendFormDataToServer(enhancedFormData);
      setImgPath(response.data.filename);
      // Optionally update credits in parent (handled in Workspace)
    } catch (error: any) {
      if (error?.response?.data?.message === 'Insufficient credits') {
        setError('Insufficient credits. You need at least 5 credits to generate an image.');
      } else {
        setError('Error generating image.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleAdvancedSettingsSave = (settings: AdvancedSettingsData) => {
  //   setAdvancedSettings(settings);
  //   console.log('Advanced settings saved:', settings);
  // };

  return (
    <>
      <div className={`w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l p-6`}>
        <div className="space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Prompt Display */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Generated Prompt</label>
                <button type="button" className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 text-sm">
                  <Wand2 className="w-4 h-4" />
                  <span>Enhance</span>
                </button>
              </div>
              <PromptInput
                value={formData.prompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                isDarkMode={isDarkMode}
                placeholder="Your speech will be converted to a prompt here..."
              />
            </div>

            {/* Art Style (Realistic or Anime) */}
            <div>
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 block`}>
                Art Style
              </label>
              <ArtStyleSelector
                value={formData.artStyle}
                onChange={value => setFormData(prev => ({ ...prev, artStyle: value }))}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Image Quality */}
            <div>
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 block`}>
                Image Quality
              </label>
              <QualitySelector
                value={formData.quality}
                onChange={value => setFormData(prev => ({ ...prev, quality: value }))}
                isDarkMode={isDarkMode}
                qualities={qualities}
              />
            </div>

            {/* Negative Prompt */}
            <div>
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 block`}>
                Negative Prompt
              </label>
              <NegativePromptInput
                value={formData.negativePrompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, negativePrompt: e.target.value }))}
                isDarkMode={isDarkMode}
                placeholder="What you don't want in the image..."
              />
            </div>

            {/* Generate Button */}
            <GenerateButton
              isSubmitting={isSubmitting}
              disabled={!user || user.credits < 5}
              isDarkMode={isDarkMode}
            >
              <span className="flex items-center justify-center space-x-2">
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span className="flex items-center ml-2 text-xs font-semibold"><Coins className="w-4 h-4 mr-1" />5 credits</span>
                  </>
                )}
                <span>{isSubmitting ? 'Generating...' : 'Generate Image'}</span>
              </span>
            </GenerateButton>
            {error && (
              <div className="mt-2 text-red-500 text-sm text-center">{error}</div>
            )}

            {/* Advanced Settings Button */}
            {/*
            <button 
              type="button"
              onClick={() => setShowAdvancedSettings(true)}
              className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Advanced Settings</span>
            </button>
            */}

            {/* Advanced Settings Indicator */}
            {advancedSettings && (
              <AdvancedSettingsIndicator isDarkMode={isDarkMode} />
            )}
          </form>
        </div>
      </div>

      {/* Advanced Settings Modal */}
      {/*
      <AdvancedSettings
        isOpen={showAdvancedSettings}
        onClose={() => setShowAdvancedSettings(false)}
        isDarkMode={isDarkMode}
        onSave={handleAdvancedSettingsSave}
      />
      */}
    </>
  );
};

export default ControlPanel;