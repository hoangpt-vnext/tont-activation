import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AppSettings, View } from '../types';

interface HomePageProps {
  setCurrentView: (view: View) => void;
  settings: AppSettings;
  onSelectProgram?: (id: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentView, settings, onSelectProgram }) => {
  
  const handlePromoClick = (id: string) => {
    if (onSelectProgram) {
        onSelectProgram(id);
        setCurrentView('program-detail');
    }
  };

  const getBrandColor = (brand: string) => {
      const lowerBrand = brand.toLowerCase();
      if (lowerBrand.includes('heineken')) return 'bg-green-600';
      if (lowerBrand.includes('tiger')) return 'bg-orange-500';
      if (lowerBrand.includes('bia việt') || lowerBrand.includes('bia viet')) return 'bg-red-600';
      if (lowerBrand.includes('bivina')) return 'bg-blue-600';
      if (lowerBrand.includes('larue')) return 'bg-yellow-600';
      if (lowerBrand.includes('strongbow')) return 'bg-pink-600';
      return 'bg-gray-600';
  };

  return (
    <div className="bg-white min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={settings.heroImage} 
            alt="Hero Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        {/* Added pt-20 to ensure text doesn't hit the top on small screens */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20 pt-20">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 whitespace-pre-line">
            {settings.heroTitle}
          </h2>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mb-8 whitespace-pre-line">
            {settings.heroSubtitle}
          </p>
        </div>
      </div>

      {/* Promotions Carousel Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Thông tin chương trình</h3>
          <span className="text-green-700 font-medium cursor-pointer hover:underline">Xem tất cả</span>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 hide-scroll snap-x snap-mandatory">
          {settings.promotions.map((promo) => (
            <div key={promo.id} className="min-w-[300px] md:min-w-[400px] snap-center">
              <div 
                onClick={() => handlePromoClick(promo.id)}
                className="group relative rounded-xl overflow-hidden h-64 shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <img 
                  src={promo.image} 
                  alt={promo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  {/* Dynamic Brand Color */}
                  <span className={`inline-block px-3 py-1 ${getBrandColor(promo.brand)} text-white text-xs font-bold rounded-full mb-2 shadow-sm`}>
                    {promo.brand}
                  </span>
                  <h4 className="text-white text-xl font-bold group-hover:text-green-300 transition-colors">{promo.title}</h4>
                  <p className="text-gray-300 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      Bấm để xem thể lệ chi tiết
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 whitespace-pre-line">
            {settings.ctaTitle}
          </h3>
          <p className="text-gray-500 mb-8 text-lg whitespace-pre-line">
            {settings.ctaDescription}
          </p>
          <button 
            onClick={() => setCurrentView('schedule')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-700 text-white font-bold rounded-full hover:bg-green-800 transition-all shadow-lg hover:shadow-green-700/30 transform hover:-translate-y-1"
          >
            Tìm quán ngay!
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;