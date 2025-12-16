import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, MapPin, Clock, Home, Info, ExternalLink, CalendarOff } from 'lucide-react';
import { ProgramEvent, SortConfig, SortField } from '../types';

interface EventTableProps {
  events: ProgramEvent[];
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
}

const EventTable: React.FC<EventTableProps> = ({ events, sortConfig, onSort }) => {
  const todayDate = new Date().toISOString().split('T')[0];

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="w-4 h-4 text-gray-400 opacity-50" />;
    return sortConfig.order === 'asc' ? 
      <ArrowUp className="w-4 h-4 text-green-700" /> : 
      <ArrowDown className="w-4 h-4 text-green-700" />;
  };

  const isToday = (dateString: string) => {
    return todayDate === dateString;
  };

  const isPast = (dateString: string) => {
      return dateString < todayDate;
  };

  // Helper to format date as dd/mm/yyyy
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    }).format(date);
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
        <h3 className="text-lg font-medium text-gray-900">Không tìm thấy sự kiện nào</h3>
        <p className="text-gray-500 mt-2">Vui lòng thử thay đổi bộ lọc hoặc tìm kiếm lại.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <HeaderCell field="city" label="Thành phố" icon={MapPin} />
              <HeaderCell field="date" label="Thời gian" icon={Clock} />
              <HeaderCell field="venue" label="Tên quán" icon={Home} />
              <HeaderCell field="address" label="Địa chỉ" />
              <HeaderCell field="brand" label="Brand" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => {
              const today = isToday(event.date);
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
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${past ? 'text-gray-500' : 'text-gray-900'}`}>{event.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                            {/* Display formatted date dd/mm/yyyy */}
                            <span className={`text-sm font-medium ${past ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{formatDate(event.date)}</span>
                            {/* Display time string */}
                            <span className="text-xs text-gray-500">{event.time}</span>
                        </div>
                        {today && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                                Hôm nay
                            </span>
                        )}
                        {past && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
                                Đã qua
                            </span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${past ? 'text-gray-600' : 'text-gray-900'}`}>{event.venue}</span>
                    <div className="text-xs text-gray-500 md:hidden mt-1 truncate max-w-[150px]">{event.description}</div>
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
                            title={event.mapLink ? "Mở link bản đồ đính kèm" : "Tìm trên Google Maps"}
                        >
                        <span className="truncate">{event.address}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                    )}
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500 flex justify-between items-center">
        <span>Hiển thị <strong>{events.length}</strong> kết quả</span>
      </div>
    </div>
  );
};

export default EventTable;