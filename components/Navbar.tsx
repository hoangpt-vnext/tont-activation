import React from 'react';
import { View, AppSettings } from '../types';
import { Settings, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  settings: AppSettings;
  onSelectProgram?: (programId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, settings, onSelectProgram }) => {
  
  const handleProgramClick = (id: string) => {
    if (onSelectProgram) {
        onSelectProgram(id);
        setCurrentView('program-detail');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('home')}>
            {/* Logo from settings */}
            <img 
              src={settings.logoUrl} 
              alt="Heineken Vietnam" 
              className="h-12 w-auto object-contain"
            />
            
            {/* App Name */}
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              <span className="text-green-700">HVN</span>
              <span className="text-gray-900">ActivationSchedule</span>
            </h1>
          </div>

          <div className="flex items-center space-x-1 md:space-x-4">
            <button 
              onClick={() => setCurrentView('home')}
              className={`px-3 py-2 rounded-md ${currentView === 'home' ? 'text-green-700 font-semibold' : 'text-gray-500 hover:text-green-700'} transition-colors duration-200 text-sm md:text-base`}
            >
              Trang chủ
            </button>
            
            {/* Swapped Order: Schedule first */}
            <button 
              onClick={() => setCurrentView('schedule')}
              className={`px-3 py-2 rounded-md ${currentView === 'schedule' ? 'text-green-700 font-semibold' : 'text-gray-500 hover:text-green-700'} transition-colors duration-200 text-sm md:text-base`}
            >
              Lịch trình
            </button>

            {/* Dropdown Menu for Programs */}
            <div className="relative group h-full flex items-center">
                <button 
                    className={`flex items-center gap-1 px-3 py-2 rounded-md ${currentView === 'program-detail' ? 'text-green-700 font-semibold' : 'text-gray-500 hover:text-green-700 group-hover:text-green-700'} transition-colors duration-200 text-sm md:text-base`}
                >
                    Thông tin chương trình
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                
                {/* Dropdown Content */}
                <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-lg border border-gray-100 overflow-hidden hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                        {settings.promotions.map((promo) => (
                            <div 
                                key={promo.id}
                                onClick={() => handleProgramClick(promo.id)}
                                className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0"
                            >
                                <p className="text-sm font-medium text-gray-800 line-clamp-1">{promo.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{promo.brand}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <button 
                onClick={() => setCurrentView('admin')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${currentView === 'admin' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
                title="Quản trị viên"
            >
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">Quản trị</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;