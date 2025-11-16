import React, { useState, useEffect } from 'react';
import { AdminView } from './components/AdminView';
import { DisplayView } from './components/DisplayView';
import { useQuizAdmin } from './hooks/useQuizAdmin';
import { useQuizDisplay } from './hooks/useQuizDisplay';

const AdminPage: React.FC = () => {
  const adminState = useQuizAdmin();
  return <AdminView {...adminState} />;
};

const DisplayPage: React.FC = () => {
  const displayState = useQuizDisplay();
  return <DisplayView {...displayState} />;
};

const LandingPage: React.FC<{ setRoute: (route: string) => void }> = ({ setRoute }) => {
  const handleNav = (route: string) => {
    window.location.hash = route;
    setRoute(route);
  };

  return (
    <div className="min-h-screen font-sans bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 mb-4">Live Q&A Slideshow</h1>
        <p className="text-slate-300 mb-8">
          This is a client-server application. Please open the Admin Panel to
          control the questions and the Display View to show them. For the best
          experience, open them in separate browser tabs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => handleNav('#/admin')}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all duration-200"
          >
            Open Admin Panel
          </button>
          <button
            onClick={() => handleNav('#/display')}
            className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 transition-all duration-200"
          >
            Open Display View
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderContent = () => {
    switch (route) {
      case '#/admin':
        return <AdminPage />;
      case '#/display':
        return <DisplayPage />;
      default:
        // Render landing page for empty hash, '#/', or any other unknown hash
        return <LandingPage setRoute={setRoute} />;
    }
  };

  return (
      <div className="min-h-screen font-sans bg-slate-100 dark:bg-slate-900">
          {renderContent()}
      </div>
  );
};

export default App;
