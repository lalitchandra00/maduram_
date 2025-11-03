import { useState } from 'react';
import Home from './components/Home';
import Moodify from './components/Moodify';
import FeelingTracker from './components/FeelingTracker';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'moodify':
        return <Moodify onNavigate={setCurrentPage} />;
      case 'tracker':
        return <FeelingTracker onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return <div className="min-h-screen">{renderPage()}</div>;
}

export default App;
