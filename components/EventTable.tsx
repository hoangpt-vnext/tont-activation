import React, { useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, MapPin, Clock, Home, Info, ExternalLink, Tag } from 'lucide-react';
import { ProgramEvent, SortConfig, SortField } from '../types';

interface EventTableProps {
  events: ProgramEvent[];
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  language: 'vi' | 'en';
}

const EventTable: React.FC<EventTableProps> = ({ events, sortConfig, onSort, language }) => {
  const dateBoundaries = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const formatDateToISO = (d: Date) => {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - diffToMonday);
    
    const endOfThisWeek = new Date(startOfThisWeek);
    endOfThisWeek.setDate(startOfThisWeek.getDate() + 6);

    const startOfNextWeek = new Date(startOfThisWeek);
    startOfNextWeek.setDate(startOfThisWeek.getDate() + 7);

    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

    return {
      today: formatDateToISO(today),
      tomorrow: formatDateToISO(tomorrow),
      thisWeekStart: formatDateToISO(startOfThisWeek),
      thisWeekEnd: formatDateToISO(endOfThisWeek),
      nextWeekStart: formatDateToISO(startOfNextWeek),
      nextWeekEnd: formatDateToISO(endOfNextWeek),
    };
  }, []);

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="w-4 h-4 text-gray-400 opacity-50" />;
    return sortConfig.order === 'asc' ? 
      <ArrowUp className="w-4 h-4 text-green-700" /> : 
      <ArrowDown className="w-4 h-4 text-green-700" />;
  };

  const isToday = (dateString: string) => dateString === dateBoundaries.today;
  const isTomorrow = (dateString: string) => dateString === dateBoundaries.tomorrow;
  const isPast = (dateString: string) => dateString < dateBoundaries.today;
  
  const isThisWeek = (dateString: string) => {
    return dateString >= dateBoundaries.thisWeekStart && 
           dateString <= dateBoundaries.thisWeekEnd && 
           !isToday(dateString) && 
           !isTomorrow(dateString);
  };

  const isNextWeek = (dateString: string) => {
    return dateString >= dateBoundaries.nextWeekStart && 
           dateString <= dateBoundaries.nextWeekEnd;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const weekday = new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', { 
        weekday: language === 'vi' ? 'long' : 'short' 
    }).format(date);

    // Removed year from the format
    const dm = new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', { 
        day: '2-digit', 
        month: '2-digit'
    }).format(date);

    return `${weekday}, ${dm}`;
  };

  const t = {
    city: language === 'vi' ? 'Thành phố' : 'City',
    time: language === 'vi' ? 'Thời gian' : 'Time',
    brand: 'Brand',
    venue: language === 'vi' ? 'Tên quán' : 'Venue',
    address: language === 'vi' ? 'Địa chỉ' : 'Address',
    today: language === 'vi' ? 'Hôm nay' : 'Today',
    tomorrow: language === 'vi' ? 'Ngày mai' : 'Tomorrow',
    thisWeek: language === 'vi' ? 'Tuần này' : 'This Week',
    nextWeek: language === 'vi' ? 'Tuần sau' : 'Next Week',
    past: language === 'vi' ? 'Đã qua' : 'Ended',
    details: language === 'vi' ? 'Thông tin chi tiết' : 'Detailed Info',
    region: 'Region',
    outletId: 'Outlet ID',
    saleRep: language === 'vi' ? 'Nhân viên sales' : 'Sales Rep',
    bu: 'BU',
    noResults: language === 'vi' ? 'Không tìm thấy sự kiện nào' : 'No events found',
    tryAgain: language === 'vi' ? 'Vui lòng thử thay đổi bộ lọc hoặc tìm kiếm lại.' : 'Please try changing the filters or search again.',
    showing: language === 'vi' ? 'Hiển thị' : 'Showing',
    results: language === 'vi' ? 'kết quả' : 'results'
  };

  const HeaderCell = ({ field, label, icon: Icon }: { field: SortField; label: string, icon?: React.ElementType }) => (
    <th 
      onClick={() => onSort(field)}
      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none sticky top-0 bg-gray-50 z-10"
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <span>{label}</span>
        <span className="group-hover:opacity-100 transition-opacity">
          {getSortIcon(field)}
        </span>
      </div>
    </th>
  );

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
        <Info className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">{t.noResults}</h3>
        <p className="text-gray-500 mt-2">{t.tryAgain}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <HeaderCell field="date" label={t.time} icon={Clock} />
              <HeaderCell field="city" label={t.city} icon={MapPin} />
              <HeaderCell field="brand" label={t.brand} icon={Tag} />
              <HeaderCell field="venue" label={t.venue} icon={Home} />
              <HeaderCell field="address" label={t.address} />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => {
              const today = isToday(event.date);
              const tomorrow = isTomorrow(event.date);
              const thisWeek = isThisWeek(event.date);
              const nextWeek = isNextWeek(event.date);
              const past = isPast(event.date);
              
              const mapUrl = event.mapLink 
                ? event.mapLink 
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, ${event.address}, ${event.city}`)}`;

              return (
                <tr 
                    key={event.id} 
                    className={`transition-colors group ${past ? 'bg-gray-50 opacity-60 grayscale-[80%]' : 'hover:bg-green-50'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                            <span className={`text-sm font-medium ${past ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{formatDate(event.date)}</span>
                            <span className="text-xs text-gray-500">{event.time}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {today && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800 animate-pulse">
                                  {t.today}
                              </span>
                          )}
                          {tomorrow && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">
                                  {t.tomorrow}
                              </span>
                          )}
                          {thisWeek && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">
                                  {t.thisWeek}
                              </span>
                          )}
                          {nextWeek && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                                  {t.nextWeek}
                              </span>
                          )}
                          {past && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-600">
                                  {t.past}
                              </span>
                          )}
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${past ? 'text-gray-500' : 'text-gray-900'}`}>{event.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${past 
                        ? 'bg-gray-200 text-gray-500' 
                        : event.brand.includes('Heineken') ? 'bg-green-100 text-green-800' 
                        : event.brand.includes('Tiger') ? 'bg-orange-100 text-orange-800' 
                        : event.brand.includes('Larue') ? 'bg-yellow-100 text-yellow-800' 
                        : event.brand.includes('Bia Việt') ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'}`}>
                      {event.brand}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${past ? 'text-gray-600' : 'text-gray-900'}`}>{event.venue}</span>
                      
                      {event.scale && (
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${event.scale.toLowerCase() === 'full' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
                          {event.scale}
                        </span>
                      )}

                      <div className="relative group/info cursor-help">
                        <Info className="w-3.5 h-3.5 text-gray-400 hover:text-green-700 transition-colors" />
                        <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white rounded-lg shadow-xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-20 pointer-events-none">
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2 pb-1 border-b border-white/10 mb-1">
                               <Home className="w-3 h-3 text-green-400" />
                               <span className="font-bold">{t.details}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">{t.region}:</span>
                              <span className="font-medium">{event.region || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">{t.outletId}:</span>
                              <span className="font-medium font-mono">{event.outletId || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">{t.saleRep}:</span>
                              <span className="font-medium">{event.saleRep || 'N/A'}</span>
                            </div>
                            {event.bu && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">{t.bu}:</span>
                                <span className="font-medium">{event.bu}</span>
                              </div>
                            )}
                          </div>
                          <div className="absolute top-full left-2 -mt-px border-8 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {past ? (
                        <span className="text-sm text-gray-400 truncate block max-w-xs">{event.address}</span>
                    ) : (
                        <a 
                            href={mapUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group/link flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 max-w-xs transition-colors"
                        >
                        <span className="truncate">{event.address}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500 flex justify-between items-center">
        <span>{t.showing} <strong>{events.length}</strong> {t.results}</span>
      </div>
    </div>
  );
};

export default EventTable;