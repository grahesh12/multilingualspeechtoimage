import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Workspace from './components/Workspace';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleEnterWorkspace = () => {
    if (isAuthenticated) {
      setCurrentView('workspace');
    } else {
      // If not authenticated, stay on landing page
      console.log('User not authenticated');
    }
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'landing' ? (
        <LandingPage onEnterWorkspace={handleEnterWorkspace} />
      ) : (
        <Workspace onBackToLanding={handleBackToLanding} />
      )}
    </div>
  );
}

export default App;