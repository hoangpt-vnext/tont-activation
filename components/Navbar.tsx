import React from 'react';
import { View, AppSettings } from '../types';
import { ChevronDown, Languages } from 'lucide-react';

interface NavbarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  settings: AppSettings;
  onSelectProgram?: (programId: string) => void;
  language: 'vi' | 'en';
  toggleLanguage: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, settings, onSelectProgram, language, toggleLanguage }) => {
  
  const handleProgramClick = (id: string) => {
    if (onSelectProgram) {
        onSelectProgram(id);
        setCurrentView('program-detail');
    }
  };

  const activationPrograms = settings.promotions.filter(p => p.type === 'Activation');
  const awoPrograms = settings.promotions.filter(p => p.type === 'AWO');

  const t = {
    home: language === 'vi' ? 'Trang chủ' : 'Home',
    programs: language === 'vi' ? 'Thông tin chương trình' : 'Programs',
    schedule: language === 'vi' ? 'Lịch Activation' : 'Activation Schedule',
    allPrograms: language === 'vi' ? 'Xem tất cả chương trình' : 'View all programs'
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('home')}>
            <img 
              src={settings.logoUrl} 
              alt="Heineken Vietnam" 
              className="h-12 w-auto object-contain"
            />
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              <span className="text-green-700">HVN</span>
              <span className="text-gray-900">TONTCalendar</span>
            </h1>
          </div>

          <div className="flex items-center space-x-1 md:space-x-4">
            <button 
              onClick={() => setCurrentView('home')}
              className={`px-3 py-2 rounded-md ${currentView === 'home' ? 'text-green-700 font-semibold' : 'text-gray-500 hover:text-green-700'} transition-colors duration-200 text-sm md:text-base`}
            >
              {t.home}
            </button>
            
            <div className="relative group h-full flex items-center">
                <button 
                    onClick={() => setCurrentView('program-list')}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md ${['program-detail', 'program-list'].includes(currentView) ? 'text-green-700 font-semibold' : 'text-gray-500 hover:text-green-700 group-hover:text-green-700'} transition-colors duration-200 text-sm md:text-base`}
                >
                    {t.programs}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                
                <div className="absolute top-full right-0 md:left-0 w-72 bg-white shadow-xl rounded-lg border border-gray-100 overflow-hidden hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                    {activationPrograms.length > 0 && (
                        <div className="py-2">
                            <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50">Activation</div>
                            {activationPrograms.map((promo) => (
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
                    )}

                    {awoPrograms.length > 0 && (
                        <div className="py-2 border-t border-gray-100">
                             <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50">AWO</div>
                            {awoPrograms.map((promo) => (
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
                    )}

                    <div className="p-2 bg-gray-50 border-t border-gray-200 text-center">
                         <button 
                            onClick={() => setCurrentView('program-list')}
                            className="text-xs font-bold text-green-700 hover:underline"
                        >
                            {t.allPrograms}
                        </button>
                    </div>
                </div>
            </div>

            <button 
              onClick={() => setCurrentView('schedule')}
              className={`px-3 py-2 rounded-md ${currentView === 'schedule' ? 'text-green-700 font-semibold' : 'text-gray-500 hover:text-green-700'} transition-colors duration-200 text-sm md:text-base`}
            >
              {t.schedule}
            </button>

            {/* Language Switcher */}
            <button 
                onClick={toggleLanguage}
                className="ml-2 flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all border border-gray-200"
                title={language === 'vi' ? 'Switch to English' : 'Đổi sang Tiếng Việt'}
            >
                <Languages className="w-3.5 h-3.5" />
                <span className="uppercase">{language}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;