import React, { useState, useEffect } from 'react';
import ControlPanel from './workspace/ControlPanel';
import GalleryModal from './workspace/GalleryModal';
import FeedbackModal from './workspace/FeedbackModal';
import PaymentModal from '../landing/PaymentModal';
import { getMe } from '../../utils/authApi';
import Header from './Header';

interface WorkspaceProps {
  onBackToLanding: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ onBackToLanding }) => {
  const [activeSection, setActiveSection] = useState<'create' | 'gallery' | 'feedback' | 'upgrade'>('create');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [user, setUser] = useState<{ username: string; plan: string; credits: number } | null>(null);

  const handleSectionChange = (section: 'create' | 'gallery' | 'feedback' | 'upgrade') => {
    setActiveSection(section);
    
    if (section === 'gallery') {
      setShowGallery(true);
    } else if (section === 'feedback') {
      setShowFeedback(true);
    } else if (section === 'upgrade') {
      setShowUpgrade(true);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }
      getMe()
        .then((data) => {
          const userObj = data.data?.user || data.user || data;
          if (userObj && userObj.username) {
            setUser(userObj);
            console.log('Workspace setUser:', userObj);
          } else {
            setUser(null);
            console.log('Workspace setUser: null (invalid userObj)', userObj);
          }
        })
        .catch((error: any) => {
          setUser(null);
          if (token && error?.message && !/token/i.test(error.message)) {
            console.error('Auth check failed:', error);
          }
        });
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

  return (
    <div className={`flex-1 flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header 
        onBackToLanding={onBackToLanding} 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        user={user}
      />
      {/* ...rest of the component... */}
    </div>
  );
}

export default Workspace;