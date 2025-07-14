import React from 'react';
import LandingPage from './components/LandingPage';
import Workspace from './components/Workspace';
import { UserProvider, useUserContext } from './context/UserContext';

function AppContent() {
  const { user, loading } = useUserContext();
  const [currentView, setCurrentView] = React.useState<'landing' | 'workspace'>('landing');

  const isAuthenticated = !!user;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {currentView === 'landing' ? (
        <LandingPage onEnterWorkspace={handleEnterWorkspace} />
      ) : (
        <div className="flex-1 flex flex-col">
          <Workspace onBackToLanding={handleBackToLanding} />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;