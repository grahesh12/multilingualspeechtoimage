import React from 'react';
import { Target, Lightbulb, Heart, Globe } from 'lucide-react';

const ValuesGrid: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To democratize creative expression by making AI-powered image generation accessible to everyone, regardless of language or technical expertise.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We constantly push the boundaries of what\'s possible with AI, bringing cutting-edge technology to your fingertips.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Heart,
      title: 'User-Centric',
      description: 'Every feature we build is designed with our users in mind, ensuring an intuitive and delightful experience.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Breaking down language barriers to connect creators worldwide through the universal language of visual art.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="mb-16">
      <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {values.map((value, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${value.gradient} rounded-xl flex items-center justify-center mb-4`}>
              <value.icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
            <p className="text-gray-600 leading-relaxed">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValuesGrid; 