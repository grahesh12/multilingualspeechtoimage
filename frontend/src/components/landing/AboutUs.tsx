import React from 'react';
import { 
  CompanyStory, 
  ValuesGrid, 
  TeamGrid 
} from './AboutUs/index';

const AboutUs: React.FC = () => {
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

        <CompanyStory />

        <ValuesGrid />

        <TeamGrid />
      </div>
    </section>
  );
};

export default AboutUs;