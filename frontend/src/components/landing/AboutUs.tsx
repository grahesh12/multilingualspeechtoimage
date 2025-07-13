import React from 'react';
import { 
  Eye, 
  Target, 
  Users, 
  Award, 
  Lightbulb,
  Heart,
  Globe,
  Zap
} from 'lucide-react';

const AboutUs: React.FC = () => {
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

  const team = [
    {
      name: 'ch vishesh Yadav',
      role: 'AI/ML Student',
      description: '',
      image: 'https://ui-avatars.com/api/?name=Profile&background=random'
    },
    {
      name: 'ch. grahesh kumar',
      role: 'AI/ML Student',
      description: '',
      image: 'https://ui-avatars.com/api/?name=Profile&background=random'
    },
    {
      name: 'B.koushik',
      role: 'AI/ML Student',
      description: '',
      image: 'https://ui-avatars.com/api/?name=Profile&background=random'
    },
    {
      name: 's. ventaka theerth',
      role: 'AI/ML Student',
      description: '',
      image: 'https://ui-avatars.com/api/?name=Profile&background=random'
    }
  ];

  return (
    <section id="about-us" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Voice2Vision
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're a passionate team of AI researchers, engineers, and designers on a mission to revolutionize 
            how people create and interact with visual content through the power of voice and artificial intelligence.
          </p>
        </div>

        {/* Company Story */}
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

        {/* Values */}
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

        {/* Team */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h4>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;