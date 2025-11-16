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


const AppRouter: React.FC = () => {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  if (hash === '#/admin') {
    return <AdminPage />;
  }
  // Default to display view
  return <DisplayPage />;
};


const App: React.FC = () => {
  // Simple check to see if we are on a specific route, otherwise show the landing/info page.
  const isRouted = window.location.hash === '#/admin' || window.location.hash === '#/display';

  if (!isRouted && window.location.hash !== '#/' && window.location.hash !== '') {
     window.location.hash = '#/';
     return null;
  }
  
  if (!isRouted && (window.location.hash === '#/' || window.location.hash === '')) {
     return (
        <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
             <div className="text-center max-w-lg">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Live Q&A Slideshow</h1>
                <p className="text-slate-600 dark:text-slate-300 mb-8">
                    This is a client-server application. Please open the Admin Panel to control the questions and the Display View to show them. For the best experience, open them in separate browser tabs.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a href="#/admin" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all duration-200">
                        Open Admin Panel
                    </a>
                    <a href="#/display" className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 transition-all duration-200">
                        Open Display View
                    </a>
                </div>
             </div>
        </div>
     );
  }


  return (
    <div className="min-h-screen font-sans">
      <AppRouter />
    </div>
  );
};


export default App;
