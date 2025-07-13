import React from 'react';
import { 
  Mic, 
  Globe, 
  Wand2, 
  Zap, 
  Type, 
  Upload, 
  Palette,
  Sparkles 
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Globe,
      title: 'Multilingual Speech Recognition',
      description: 'Speak in any language and our AI will understand and convert your words into detailed image prompts.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Wand2,
      title: 'Advanced Prompt Enhancement',
      description: 'Our AI automatically enhances your prompts with artistic details and technical specifications.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Mic,
      title: 'Real-time Speech Input',
      description: 'Start speaking and watch your ideas transform into images in real-time with live feedback.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Type,
      title: 'Text Input Support',
      description: 'Prefer typing? Enter your prompts manually with full text editing capabilities.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Upload,
      title: 'Audio File Upload',
      description: 'Upload pre-recorded audio files and let our AI extract the perfect image prompts.',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Palette,
      title: 'High-Quality Image Generation',
      description: 'Generate stunning, high-resolution images with multiple art styles and customization options.',
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to transform your creative ideas into stunning visual masterpieces
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Visual Element */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-4 rounded-full">
            <Sparkles className="w-6 h-6 text-purple-600 mr-3" />
            <span className="text-purple-900 font-medium">
              Powered by cutting-edge AI technology
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;