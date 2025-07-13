import React from 'react';
import { 
  Mic, 
  Globe, 
  Wand2, 
  Zap, 
  Type, 
  Upload, 
  Palette,
  Sparkles,
  ArrowRight,
  Star
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Globe,
      title: 'Multilingual Speech Recognition',
      description: 'Speak in any language and our AI will understand and convert your words into detailed image prompts.',
      gradient: 'from-blue-500 to-cyan-500',
      delay: '0'
    },
    {
      icon: Wand2,
      title: 'Advanced Prompt Enhancement',
      description: 'Our AI automatically enhances your prompts with artistic details and technical specifications.',
      gradient: 'from-purple-500 to-pink-500',
      delay: '100'
    },
    {
      icon: Mic,
      title: 'Real-time Speech Input',
      description: 'Start speaking and watch your ideas transform into images in real-time with live feedback.',
      gradient: 'from-green-500 to-emerald-500',
      delay: '200'
    },
    {
      icon: Type,
      title: 'Text Input Support',
      description: 'Prefer typing? Enter your prompts manually with full text editing capabilities.',
      gradient: 'from-orange-500 to-red-500',
      delay: '300'
    },
    {
      icon: Upload,
      title: 'Audio File Upload',
      description: 'Upload pre-recorded audio files and let our AI extract the perfect image prompts.',
      gradient: 'from-indigo-500 to-purple-500',
      delay: '400'
    },
    {
      icon: Palette,
      title: 'High-Quality Image Generation',
      description: 'Generate stunning, high-resolution images with multiple art styles and customization options.',
      gradient: 'from-pink-500 to-rose-500',
      delay: '500'
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="glass p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-gradient" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient">
              Powerful Features
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to transform your creative ideas into stunning visual masterpieces
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card p-8 hover-lift group animate-slide-up"
              style={{ animationDelay: `${feature.delay}ms` }}
            >
              {/* Enhanced Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              {/* Enhanced Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300 flex items-center justify-between">
                {feature.title}
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300" />
              </h3>
              
              {/* Enhanced Description */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Enhanced Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Enhanced Bottom Section */}
        <div className="mt-16 text-center animate-slide-up delay-600">
          <div className="glass px-8 py-6 rounded-2xl inline-flex items-center space-x-4 hover-lift">
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
              <Star className="w-6 h-6 text-yellow-500 animate-pulse delay-300" />
              <Star className="w-6 h-6 text-yellow-500 animate-pulse delay-600" />
            </div>
            <span className="text-gradient font-semibold text-lg">
              Powered by cutting-edge AI technology
            </span>
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-500 animate-pulse delay-900" />
              <Star className="w-6 h-6 text-yellow-500 animate-pulse delay-1200" />
              <Star className="w-6 h-6 text-yellow-500 animate-pulse delay-1500" />
            </div>
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-up delay-700">
          <div className="card p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-gradient mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
          <div className="card p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-gradient mb-2">50+</div>
            <div className="text-gray-600">Languages</div>
          </div>
          <div className="card p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-gradient mb-2">1M+</div>
            <div className="text-gray-600">Images Generated</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;