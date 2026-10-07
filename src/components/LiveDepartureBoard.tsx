import React, { useState } from 'react';
import { Station, Departure, TransitMode } from '../types/transit';
import { ArrivalCard } from './ArrivalCard';
import { RouteBadge } from './RouteBadge';
import {
  Search,
  MapPin,
  Filter,
  Train,
  Bus,
  Zap,
  Moon,
  Clock,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Bookmark,
  Share2,
} from 'lucide-react';

interface LiveDepartureBoardProps {
  stations: Station[];
  currentStation: Station;
  departures: Departure[];
  onSelectStation: (station: Station) => void;
  onStartRide: (departure: Departure) => void;
  onOpenStationDetails: (station: Station) => void;
}

export const LiveDepartureBoard: React.FC<LiveDepartureBoardProps> = ({
  stations,
  currentStation,
  departures,
  onSelectStation,
  onStartRide,
  onOpenStationDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [filterAccessibleOnly, setFilterAccessibleOnly] = useState(false);

  // Filter departures
  const filteredDepartures = departures.filter((dep) => {
    if (selectedMode !== 'all' && dep.mode !== selectedMode) return false;
    if (filterAccessibleOnly && !dep.isAccessible) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDest = dep.destination.toLowerCase().includes(q);
      const matchRoute = dep.routeCode.toLowerCase().includes(q);
      const matchPlatform = dep.platform.toLowerCase().includes(q);
      return matchDest || matchRoute || matchPlatform;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* 52px Ergonomic Search Bar */}
      <div className="relative w-full">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-[#00C2CB] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destination, line code (M1, B14), or platform..."
            className="w-full h-[52px] pl-12 pr-4 bg-[#131B26] border border-[#26354A] rounded-xl text-[#DFE2EE] placeholder-[#64748B] text-sm font-inter focus:outline-hidden focus:border-[#00C2CB] focus:ring-2 focus:ring-[#00C2CB]/50 transition-all shadow-md"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 text-xs text-[#87948B] hover:text-white px-2 py-1 rounded bg-[#1C2028]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Station Selector Hub Pill Strip */}
      <div className="bg-[#131B26] border border-[#26354A] rounded-xl p-3.5 shadow-lg">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#71DBA6]" />
            <span className="text-xs font-hanken font-bold uppercase tracking-wider text-[#87948B]">
              Active Transit Hub
            </span>
          </div>
          <button
            onClick={() => onOpenStationDetails(currentStation)}
            className="text-xs font-semibold text-[#00C2CB] hover:underline flex items-center gap-1"
          >
            <span>Station Info & Map</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Horizontal Quick Station Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {stations.map((st) => {
            const isSelected = st.id === currentStation.id;
            return (
              <button
                key={st.id}
                onClick={() => onSelectStation(st)}
                className={`px-3 py-2 rounded-lg text-xs font-hanken font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#00875A] border-[#71DBA6] text-white shadow-md'
                    : 'bg-[#181C24] border-[#26354A] text-[#BDCAC0] hover:text-white hover:border-[#87948B]'
                }`}
              >
                <span>{st.name}</span>
                <span className="ml-1.5 opacity-70 font-mono text-[10px]">
                  ({st.code})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Filters & Station Summary Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-hanken font-bold transition-all border ${
              selectedMode === 'all'
                ? 'bg-[#1C2028] text-white border-[#00C2CB]'
                : 'bg-[#131B26] text-[#87948B] border-[#26354A] hover:text-white'
            }`}
          >
            All Modes
          </button>
          <button
            onClick={() => setSelectedMode('metro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-hanken font-bold transition-all border flex items-center gap-1.5 ${
              selectedMode === 'metro'
                ? 'bg-[#0284C7] text-white border-transparent'
                : 'bg-[#131B26] text-[#87948B] border-[#26354A] hover:text-white'
            }`}
          >
            <Train className="w-3 h-3" /> Metro (M)
          </button>
          <button
            onClick={() => setSelectedMode('bus')}
            className={`px-3 py-1.5 rounded-lg text-xs font-hanken font-bold transition-all border flex items-center gap-1.5 ${
              selectedMode === 'bus'
                ? 'bg-[#E11D48] text-white border-transparent'
                : 'bg-[#131B26] text-[#87948B] border-[#26354A] hover:text-white'
            }`}
          >
            <Bus className="w-3 h-3" /> Bus (B)
          </button>
          <button
            onClick={() => setSelectedMode('tram')}
            className={`px-3 py-1.5 rounded-lg text-xs font-hanken font-bold transition-all border flex items-center gap-1.5 ${
              selectedMode === 'tram'
                ? 'bg-[#059669] text-white border-transparent'
                : 'bg-[#131B26] text-[#87948B] border-[#26354A] hover:text-white'
            }`}
          >
            Tram (T)
          </button>
          <button
            onClick={() => setSelectedMode('express')}
            className={`px-3 py-1.5 rounded-lg text-xs font-hanken font-bold transition-all border flex items-center gap-1.5 ${
              selectedMode === 'express'
                ? 'bg-[#D97706] text-white border-transparent'
                : 'bg-[#131B26] text-[#87948B] border-[#26354A] hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3" /> Express (X)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-[#87948B] cursor-pointer bg-[#131B26] px-2.5 py-1.5 rounded-lg border border-[#26354A]">
            <input
              type="checkbox"
              checked={filterAccessibleOnly}
              onChange={(e) => setFilterAccessibleOnly(e.target.checked)}
              className="rounded text-[#00875A] focus:ring-0"
            />
            <span>Step-free only</span>
          </label>
        </div>
      </div>

      {/* Main Departures List Header */}
      <div className="flex items-center justify-between text-xs text-[#87948B] font-inter px-1">
        <span>
          Showing {filteredDepartures.length} live departure{filteredDepartures.length !== 1 ? 's' : ''} from{' '}
          <strong className="text-[#DFE2EE] font-hanken">{currentStation.name}</strong>
        </span>
        <span className="flex items-center gap-1 text-[#71DBA6]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#71DBA6] animate-ping" />
          Live GPS Real-Time
        </span>
      </div>

      {/* Departures Cards Stack */}
      {filteredDepartures.length === 0 ? (
        <div className="bg-[#131B26] border border-[#26354A] rounded-xl p-8 text-center">
          <Clock className="w-10 h-10 text-[#87948B] mx-auto mb-3 opacity-60" />
          <h4 className="font-hanken font-bold text-base text-[#DFE2EE]">
            No matching departures found
          </h4>
          <p className="text-xs text-[#87948B] mt-1">
            Try adjusting your search terms or mode filters to view all scheduled services.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredDepartures.map((departure) => (
            <ArrivalCard
              key={departure.id}
              departure={departure}
              onSelect={() => onOpenStationDetails(currentStation)}
              onStartRide={onStartRide}
            />
          ))}
        </div>
      )}
    </div>
  );
};
