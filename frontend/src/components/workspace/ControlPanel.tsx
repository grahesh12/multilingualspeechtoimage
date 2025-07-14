import React, { useState } from 'react';
import { Wand2, Sparkles, Settings, Coins, Palette, Zap, Shield } from 'lucide-react';
import PromptInput from './ControlPanel/PromptInput';
import ArtStyleSelector from './ControlPanel/ArtStyleSelector';
import QualitySelector from './ControlPanel/QualitySelector';
import NegativePromptInput from './ControlPanel/NegativePromptInput';
import GenerateButton from './ControlPanel/GenerateButton';
import AdvancedSettingsIndicator from './ControlPanel/AdvancedSettingsIndicator';
import { enhancePromptWithAdvancedSettings, AdvancedSettingsData } from './ControlPanel/PromptEnhancer';
import { sendFormDataToServer } from '../../utils/api';

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
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettingsData | null>(null);

  const qualities = [
    { id: 'standard', name: 'Standard', description: '1024x1024', icon: '📱' },
    { id: 'hd', name: 'HD', description: '1792x1024', icon: '🖥️' },
    { id: 'ultra', name: 'Ultra HD', description: '2048x2048', icon: '🎬' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user || user.credits < 5) {
      setError('Insufficient credits. You need at least 5 credits to generate an image.');
      return;
    }
    if (!formData.prompt || formData.prompt.trim() === '') {
      setError('Prompt is required to generate an image.');
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
      setImgPath(response.data ? response.data.filename : '');
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

  return (
    <>
      <div className={`w-80 ${isDarkMode ? 'bg-gray-900/95 backdrop-blur-md border-gray-700' : 'bg-white/95 backdrop-blur-md border-gray-200'} border-l p-6 overflow-y-auto`}>
        <div className="space-y-6">
          {/* Enhanced Header */}
          <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="glass p-2 rounded-xl">
                <Wand2 className="w-5 h-5 text-gradient" />
              </div>
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Generator
              </h2>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Transform your voice into stunning visuals
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Enhanced Prompt Display */}
            <div className="card p-4 hover-lift">
              <div className="flex items-center justify-between mb-3">
                <label className={`text-sm font-semibold flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Sparkles className="w-4 h-4 text-gradient" />
                  <span>Generated Prompt</span>
                </label>
                <button 
                  type="button" 
                  className="flex items-center space-x-1 text-primary-500 hover:text-primary-600 text-sm hover-glow px-2 py-1 rounded-lg transition-all duration-300"
                >
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

            {/* Enhanced Art Style Section */}
            <div className="card p-4 hover-lift">
              <label className={`text-sm font-semibold flex items-center space-x-2 mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Palette className="w-4 h-4 text-gradient" />
                <span>Art Style</span>
              </label>
              <ArtStyleSelector
                value={formData.artStyle}
                onChange={value => setFormData(prev => ({ ...prev, artStyle: value }))}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Enhanced Image Quality Section */}
            <div className="card p-4 hover-lift">
              <label className={`text-sm font-semibold flex items-center space-x-2 mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Zap className="w-4 h-4 text-gradient" />
                <span>Image Quality</span>
              </label>
              <QualitySelector
                value={formData.quality}
                onChange={value => setFormData(prev => ({ ...prev, quality: value }))}
                isDarkMode={isDarkMode}
                qualities={qualities}
              />
            </div>

            {/* Enhanced Negative Prompt Section */}
            <div className="card p-4 hover-lift">
              <label className={`text-sm font-semibold flex items-center space-x-2 mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Shield className="w-4 h-4 text-gradient" />
                <span>Negative Prompt</span>
              </label>
              <NegativePromptInput
                value={formData.negativePrompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, negativePrompt: e.target.value }))}
                isDarkMode={isDarkMode}
                placeholder="What you don't want in the image..."
              />
            </div>

            {/* Enhanced Generate Button Section */}
            <div className="space-y-3">
              <GenerateButton
                isSubmitting={isSubmitting}
                disabled={!user || user.credits < 5}
                isDarkMode={isDarkMode}
              >
                <span className="flex items-center justify-center space-x-2">
                  {isSubmitting ? (
                    <div className="spinner w-5 h-5"></div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span className="flex items-center ml-2 text-xs font-semibold">
                        <Coins className="w-4 h-4 mr-1" />
                        5 credits
                      </span>
                    </>
                  )}
                  <span>{isSubmitting ? 'Generating...' : 'Generate Image'}</span>
                </span>
              </GenerateButton>
              
              {error && (
                <div className="glass p-3 rounded-xl border border-red-200 dark:border-red-800">
                  <div className="text-red-500 text-sm text-center flex items-center justify-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Enhanced Credits Display */}
              {user && (
                <div className="glass p-3 rounded-xl text-center">
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Available Credits
                  </div>
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user.credits}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Advanced Settings Indicator */}
            {advancedSettings && (
              <AdvancedSettingsIndicator isDarkMode={isDarkMode} />
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ControlPanel;