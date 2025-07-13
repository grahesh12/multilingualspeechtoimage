import ControlPanel from './workspace/ControlPanel';
import GalleryModal from './workspace/GalleryModal';
import FeedbackModal from './workspace/FeedbackModal';
import PaymentModal from '../landing/PaymentModal';

interface WorkspaceProps {
  onBackToLanding: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ onBackToLanding }) => {
  const [activeSection, setActiveSection] = useState<'create' | 'gallery' | 'feedback' | 'upgrade'>('create');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

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
}