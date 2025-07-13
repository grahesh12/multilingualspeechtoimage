import React, { useState, useEffect } from 'react';
import Header from './workspace/Header';
import Sidebar from './workspace/Sidebar';
import MainWorkspace from './workspace/MainWorkspace';
import ControlPanel from './workspace/ControlPanel';
import GalleryModal from './workspace/GalleryModal';
import FeedbackModal from './workspace/FeedbackModal';
import PaymentModal from './landing/PaymentModal';

interface WorkspaceProps {
  onBackToLanding: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ onBackToLanding }) => {
  const [activeSection, setActiveSection] = useState<'create' | 'gallery' | 'feedback' | 'upgrade'>('create');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [img_path, setImgPath] = useState('');
  const [user, setUser] = useState<{ username: string; plan: string; credits: number } | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        fetch('http://localhost:5000/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.ok ? res.json() : Promise.reject())
          .then((data) => {
            setUser({ username: data.username, plan: data.plan, credits: data.credits });
          })
          .catch(() => setUser(null));
      } else {
        setUser(null);
      }
    };

    checkAuth();
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const [formData, setFormData] = useState<{
    prompt: string;
    negativePrompt: string;
    artStyle: string;
    quality: string;
  }>({
    prompt: '',
    negativePrompt: '',
    artStyle: 'realistic',
    quality: 'standard'
  });
  const handleSectionChange = (section: 'create' | 'gallery' | 'feedback' | 'upgrade') => {
    setActiveSection(section);
    
    if (section === 'gallery') {
      setShowGallery(true);
    } else if (section === 'feedback') {
      setShowFeedback(true);
    } else if (section === 'upgrade') {
      setShowPayment(true);
    }
  };
  

  return (
    <div className={`flex-1 flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header 
        onBackToLanding={onBackToLanding} 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        user={user}
      />
      <div className="flex flex-1 pt-16">
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isDarkMode={isDarkMode}
        />
        <div className="flex-1 flex">
          <MainWorkspace isDarkMode={isDarkMode} formData={formData} setFormData={setFormData} img_path={img_path} />
          <ControlPanel isDarkMode={isDarkMode} formData={formData} setFormData={setFormData} setImgPath={setImgPath} user={user} />
        </div>
      </div>
      {/* Modals */}
      <GalleryModal 
        isOpen={showGallery}
        onClose={() => {
          setShowGallery(false);
          setActiveSection('create');
        }}
        isDarkMode={isDarkMode}
      />
      <FeedbackModal 
        isOpen={showFeedback}
        onClose={() => {
          setShowFeedback(false);
          setActiveSection('create');
        }}
        isDarkMode={isDarkMode}
      />
      <PaymentModal 
        isOpen={showPayment}
        onClose={() => {
          setShowPayment(false);
          setActiveSection('create');
        }}
      />
    </div>
  );
};

export default Workspace;