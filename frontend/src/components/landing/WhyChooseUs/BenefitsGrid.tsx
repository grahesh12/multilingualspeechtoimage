import React from 'react';
import { Shield, Clock, Award, Users } from 'lucide-react';

interface Benefit {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const BenefitsGrid: React.FC = () => {
  const benefits: Benefit[] = [
    {
      icon: Shield,
      title: 'Privacy Protected',
      description: 'Your voice data and images are processed securely with end-to-end encryption.'
    },
    {
      icon: Clock,
      title: 'Lightning Fast',
      description: 'Generate high-quality images in seconds, not minutes.'
    },
    {
      icon: Award,
      title: 'Professional Quality',
      description: 'Studio-grade results suitable for commercial and artistic use.'
    },
    {
      icon: Users,
      title: 'Global Community',
      description: 'Join thousands of creators worldwide using our platform daily.'
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-16">
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-start space-x-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <benefit.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BenefitsGrid; 