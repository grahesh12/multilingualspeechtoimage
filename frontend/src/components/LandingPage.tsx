import React from 'react';
import Header from './landing/Header';
import Hero from './landing/Hero';
import Features from './landing/Features';
import WhyChooseUs from './landing/WhyChooseUs';
import AboutUs from './landing/AboutUs';
import Footer from './landing/Footer';

interface LandingPageProps {
  onEnterWorkspace: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterWorkspace }) => {
  return (
    <div className="min-h-screen">
      <Header onEnterWorkspace={onEnterWorkspace} />
      <Hero onEnterWorkspace={onEnterWorkspace} />
      <Features />
      <WhyChooseUs onEnterWorkspace={onEnterWorkspace} />
      <AboutUs />
      <Footer />
    </div>
  );
};

export default LandingPage;

