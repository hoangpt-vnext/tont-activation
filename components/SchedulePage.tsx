import React, { useState, useMemo } from 'react';
import FilterBar from './FilterBar';
import EventTable from './EventTable';
import GeminiAssistant from './GeminiAssistant';
import { FilterState, ProgramEvent, SortConfig, SortField, AppSettings } from '../types';

interface SchedulePageProps {
  events: ProgramEvent[];
  settings?: AppSettings;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ events, settings }) => {
  // State for filtering
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    city: '',
    brand: '',
    dateFrom: '',
    dateTo: ''
  });

  // State for Past Events visibility
  const [showPastEvents, setShowPastEvents] = useState(true);

  // State for sorting
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'date',
    order: 'asc'
  });

  // Handle Sort Click
  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      order: current.field === field && current.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      city: '',
      brand: '',
      dateFrom: '',
      dateTo: ''
    });
    setShowPastEvents(true);
  };

  // Derived state
  const processedEvents = useMemo(() => {
    let result = [...events];
    const today = new Date().toISOString().split('T')[0];

    // 1. Filtering (Basic)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(e => 
        e.venue.toLowerCase().includes(searchLower) || 
        e.address.toLowerCase().includes(searchLower)
      );
    }
    if (filters.city) {
      result = result.filter(e => e.city === filters.city);
    }
    if (filters.brand) {
      result = result.filter(e => e.brand === filters.brand);
    }
    if (filters.dateFrom) {
      result = result.filter(e => e.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter(e => e.date <= filters.dateTo);
    }

    // 2. Filter Past Events if toggle is OFF
    if (!showPastEvents) {
        result = result.filter(e => e.date >= today);
    }

    // 3. Sorting
    // Logic: Always push past events to the bottom unless hidden.
    // Within the groups (Future vs Past), apply the user's selected sort.
    result.sort((a, b) => {
      const isPastA = a.date < today;
      const isPastB = b.date < today;

      // Primary Sort Key: Past status (Future comes before Past)
      if (isPastA !== isPastB) {
          // If A is past (true) and B is not (false), A should come after B. Return 1.
          return isPastA ? 1 : -1;
      }

      // Secondary Sort Key: User selection
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (aValue === undefined || bValue === undefined) return 0;

      if (aValue < bValue) {
        return sortConfig.order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.order === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [events, filters, sortConfig, showPastEvents]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-12 relative overflow-hidden">
      {/* Star Pattern Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l7.5 22.5h22.5l-18 13.5 7.5 22.5-18-13.5-18 13.5 7.5-22.5-18-13.5h22.5z' fill='%23FFFFFF' stroke='%23d1d5db' stroke-width='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-green-800 mb-2">
                {settings?.scheduleTitle || 'Lịch Trình Sự Kiện'}
            </h2>
            <p className="text-gray-600">
                {settings?.scheduleSubtitle || 'Tìm kiếm và theo dõi các hoạt động activation mới nhất.'}
            </p>
        </div>

        {/* AI Assistant Section */}
        <GeminiAssistant currentEvents={processedEvents} />

        {/* Filters Section */}
        <FilterBar 
          filters={filters} 
          setFilters={setFilters} 
          showPastEvents={showPastEvents}
          setShowPastEvents={setShowPastEvents}
          onReset={handleResetFilters} 
        />

        {/* Data Table Section */}
        <EventTable 
          events={processedEvents} 
          sortConfig={sortConfig} 
          onSort={handleSort} 
        />
      </div>
    </div>
  );
};

export default SchedulePage;