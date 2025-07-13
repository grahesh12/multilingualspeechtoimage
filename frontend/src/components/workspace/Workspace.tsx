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
}