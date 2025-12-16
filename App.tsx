import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import SchedulePage from './components/SchedulePage';
import AdminPage from './components/AdminPage';
import ProgramDetailPage from './components/ProgramDetailPage';
import { View, ProgramEvent, AppSettings } from './types';
import { MOCK_EVENTS, DEFAULT_SETTINGS } from './constants';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [events, setEvents] = useState<ProgramEvent[]>(MOCK_EVENTS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  const handleSelectProgram = (id: string) => {
    setSelectedProgramId(id);
    setCurrentView('program-detail');
  };

  const getSelectedProgram = () => {
    return settings.promotions.find(p => p.id === selectedProgramId);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        settings={settings}
        onSelectProgram={handleSelectProgram}
      />
      
      <main>
        {currentView === 'home' && (
          <HomePage 
            setCurrentView={setCurrentView} 
            settings={settings} 
            onSelectProgram={handleSelectProgram}
          />
        )}
        
        {currentView === 'schedule' && (
          <SchedulePage events={events} settings={settings} />
        )}

        {currentView === 'program-detail' && (
            <ProgramDetailPage 
                program={getSelectedProgram()} 
                onBack={() => setCurrentView('home')}
                setCurrentView={setCurrentView}
            />
        )}

        {currentView === 'admin' && (
          <AdminPage 
            events={events} 
            setEvents={setEvents} 
            settings={settings}
            setSettings={setSettings}
          />
        )}
      </main>
    </div>
  );
}

export default App;