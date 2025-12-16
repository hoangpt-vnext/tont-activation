import React from 'react';
import { Filter, Calendar, MapPin, Search, Tag, EyeOff } from 'lucide-react';
import { FilterState } from '../types';
import { CITIES, BRANDS } from '../constants';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  showPastEvents: boolean;
  setShowPastEvents: (show: boolean) => void;
  onReset: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, showPastEvents, setShowPastEvents, onReset }) => {
  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-green-800 font-semibold">
            <Filter className="w-5 h-5 text-green-700" />
            <span>Bộ lọc tìm kiếm</span>
        </div>
        
        {/* Toggle Past Events */}
        <div className="flex items-center gap-2">
            <label className="flex items-center cursor-pointer select-none gap-2 text-sm text-gray-600 hover:text-green-700 transition-colors">
                <div className="relative">
                    <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={!showPastEvents}
                        onChange={() => setShowPastEvents(!showPastEvents)}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${!showPastEvents ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${!showPastEvents ? 'translate-x-4' : ''}`}></div>
                </div>
                <span className="flex items-center gap-1">
                    <EyeOff className="w-4 h-4" />
                    Ẩn sự kiện đã qua
                </span>
            </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Text Search */}
        <div className="relative col-span-1 lg:col-span-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Tìm tên quán, địa chỉ..."
                value={filters.search}
                onChange={(e) => handleChange('search', e.target.value)}
                className="pl-10 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
            />
        </div>

        {/* City Filter */}
        <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <select
                value={filters.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="pl-10 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none"
            >
                <option value="">Tất cả thành phố</option>
                {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
                ))}
            </select>
        </div>

        {/* Brand Filter */}
        <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-4 w-4 text-gray-400" />
            </div>
            <select
                value={filters.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                className="pl-10 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none"
            >
                <option value="">Tất cả Brand</option>
                {BRANDS.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
                ))}
            </select>
        </div>

        {/* Date From */}
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Từ</span>
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleChange('dateFrom', e.target.value)}
                    className="pl-10 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-600"
                    placeholder="Từ ngày"
                />
            </div>
        </div>

        {/* Date To */}
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Đến</span>
            <div className="relative flex-1">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleChange('dateTo', e.target.value)}
                    className="pl-10 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-600"
                    placeholder="Đến ngày"
                />
            </div>
             <button 
                onClick={onReset}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm transition-colors whitespace-nowrap"
                title="Xóa bộ lọc"
            >
                Xóa
            </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;