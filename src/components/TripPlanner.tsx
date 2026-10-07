import React, { useState } from 'react';
import { Station, TripItinerary, TransitMode } from '../types/transit';
import { RouteBadge } from './RouteBadge';
import { CrowdIndicator } from './CrowdIndicator';
import {
  ArrowUpDown,
  Navigation,
  Clock,
  Footprints,
  Shuffle,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  Play,
  Share2,
  Bookmark,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface TripPlannerProps {
  stations: Station[];
  initialFromId?: string;
  initialToId?: string;
  onStartActiveTrip: (itinerary: TripItinerary) => void;
  onPreviewOnMap?: (stationIds: string[]) => void;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({
  stations,
  initialFromId = 'st-grand-central',
  initialToId = 'st-uni-heights',
  onStartActiveTrip,
  onPreviewOnMap,
}) => {
  const [fromStationId, setFromStationId] = useState<string>(initialFromId);
  const [toStationId, setToStationId] = useState<string>(initialToId);
  const [preference, setPreference] = useState<'fastest' | 'transfers' | 'walking'>('fastest');
  const [selectedItineraryIndex, setSelectedItineraryIndex] = useState<number>(0);

  const fromStation = stations.find((s) => s.id === fromStationId) || stations[0];
  const toStation = stations.find((s) => s.id === toStationId) || stations[stations.length - 1];

  const handleSwap = () => {
    const temp = fromStationId;
    setFromStationId(toStationId);
    setToStationId(temp);
  };

  // Generate realistic smart itineraries based on selection
  const itineraries: TripItinerary[] = [
    {
      id: 'itin-1',
      originStation: fromStation,
      destinationStation: toStation,
      totalDurationMinutes: 19,
      walkingMinutes: 4,
      transfersCount: 1,
      departureTime: 'Now (14:32)',
      arrivalTime: '14:51',
      fareUSD: 2.75,
      tag: 'Fastest',
      steps: [
        {
          id: 's1',
          instruction: `Walk to ${fromStation.name}`,
          mode: 'walk',
          fromStation: 'Current Location',
          toStation: fromStation.name,
          departureTimeFormatted: '14:32',
          durationMinutes: 2,
          tip: 'Head toward Main Concourse, Escalator 3',
        },
        {
          id: 's2',
          instruction: `Board M1 Blue Line towards Waterfront / Tech Park`,
          mode: 'metro',
          routeCode: 'M1',
          lineColor: '#0284C7',
          fromStation: fromStation.name,
          toStation: 'Market East Station',
          departureTimeFormatted: '14:34',
          durationMinutes: 4,
          platform: 'Platform 1',
          stopsCount: 2,
          stopsList: [fromStation.name, 'Market East Station'],
          crowdLevel: 2,
          tip: 'Board middle car (Cars 3-4) for direct cross-platform tram stairs',
        },
        {
          id: 's3',
          instruction: 'Transfer to T3 Emerald Tramway (Street Tram Bay A)',
          mode: 'walk',
          fromStation: 'Market East Station',
          toStation: 'Market East Tram Bay',
          departureTimeFormatted: '14:38',
          durationMinutes: 3,
          tip: '3 min transfer buffer. Follow green overhead signs.',
        },
        {
          id: 's4',
          instruction: `Ride T3 Tramway to ${toStation.name}`,
          mode: 'tram',
          routeCode: 'T3',
          lineColor: '#059669',
          fromStation: 'Market East Station',
          toStation: toStation.name,
          departureTimeFormatted: '14:41',
          durationMinutes: 10,
          platform: 'Bay A',
          stopsCount: 3,
          stopsList: ['Market East', 'Arts District', 'South Boulevard', toStation.name],
          crowdLevel: 1,
          tip: 'Tap contact card at reader upon boarding',
        },
      ],
    },
    {
      id: 'itin-2',
      originStation: fromStation,
      destinationStation: toStation,
      totalDurationMinutes: 24,
      walkingMinutes: 2,
      transfersCount: 0,
      departureTime: '14:35',
      arrivalTime: '14:59',
      fareUSD: 2.25,
      tag: 'Fewer Transfers',
      steps: [
        {
          id: 's2-1',
          instruction: `Walk to ${fromStation.name} Bus Berth`,
          mode: 'walk',
          fromStation: 'Current Location',
          toStation: fromStation.name,
          departureTimeFormatted: '14:35',
          durationMinutes: 2,
        },
        {
          id: 's2-2',
          instruction: `Direct Ride on B14 Rapid / N5 Circular to ${toStation.name}`,
          mode: 'bus',
          routeCode: 'B14',
          lineColor: '#E11D48',
          fromStation: fromStation.name,
          toStation: toStation.name,
          departureTimeFormatted: '14:37',
          durationMinutes: 22,
          platform: 'Bay 4',
          stopsCount: 5,
          crowdLevel: 3,
          tip: 'Direct connection without changing lines',
        },
      ],
    },
  ];

  const currentItinerary = itineraries[selectedItineraryIndex] || itineraries[0];

  return (
    <div className="space-y-4">
      {/* Route Inputs Card */}
      <div className="bg-[#131B26] border border-[#26354A] rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-hanken font-bold uppercase tracking-wider text-[#71DBA6] flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5" /> Multi-Modal Route Finder
          </span>
          <span className="text-xs text-[#87948B]">Real-time schedule synced</span>
        </div>

        {/* Origin / Destination selector with swap button */}
        <div className="relative flex flex-col gap-2.5">
          {/* Origin */}
          <div className="flex items-center gap-2 bg-[#0F131C] border border-[#26354A] rounded-lg px-3 py-2.5 focus-within:border-[#00C2CB] focus-within:ring-1 focus-within:ring-[#00C2CB] transition-all">
            <span className="w-2.5 h-2.5 rounded-full bg-[#71DBA6] shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-semibold uppercase text-[#87948B]">
                Origin Station
              </label>
              <select
                value={fromStationId}
                onChange={(e) => setFromStationId(e.target.value)}
                className="w-full bg-transparent text-sm font-hanken font-bold text-[#DFE2EE] focus:outline-hidden cursor-pointer"
              >
                {stations.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#131B26] text-[#DFE2EE]">
                    {s.name} ({s.code}) - {s.district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap icon floating */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={handleSwap}
              className="p-2 rounded-full bg-[#1C2028] hover:bg-[#262A33] border border-[#26354A] text-[#DFE2EE] active:scale-95 transition-all shadow-md"
              title="Swap Origin and Destination"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-2 bg-[#0F131C] border border-[#26354A] rounded-lg px-3 py-2.5 focus-within:border-[#00C2CB] focus-within:ring-1 focus-within:ring-[#00C2CB] transition-all">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-semibold uppercase text-[#87948B]">
                Destination Station
              </label>
              <select
                value={toStationId}
                onChange={(e) => setToStationId(e.target.value)}
                className="w-full bg-transparent text-sm font-hanken font-bold text-[#DFE2EE] focus:outline-hidden cursor-pointer"
              >
                {stations.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#131B26] text-[#DFE2EE]">
                    {s.name} ({s.code}) - {s.district}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Route Preferences Pills */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1C2028]">
          <span className="text-[11px] text-[#87948B] shrink-0">Priority:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => {
                setPreference('fastest');
                setSelectedItineraryIndex(0);
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all ${
                preference === 'fastest'
                  ? 'bg-[#00875A] text-white shadow'
                  : 'bg-[#181C24] text-[#87948B] hover:text-[#DFE2EE]'
              }`}
            >
              Fastest
            </button>
            <button
              onClick={() => {
                setPreference('transfers');
                setSelectedItineraryIndex(1);
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all ${
                preference === 'transfers'
                  ? 'bg-[#00875A] text-white shadow'
                  : 'bg-[#181C24] text-[#87948B] hover:text-[#DFE2EE]'
              }`}
            >
              Fewer Transfers
            </button>
            <button
              onClick={() => {
                setPreference('walking');
                setSelectedItineraryIndex(0);
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all ${
                preference === 'walking'
                  ? 'bg-[#00875A] text-white shadow'
                  : 'bg-[#181C24] text-[#87948B] hover:text-[#DFE2EE]'
              }`}
            >
              Least Walking
            </button>
          </div>
        </div>
      </div>

      {/* Itinerary Options Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {itineraries.map((itin, idx) => {
          const isSelected = selectedItineraryIndex === idx;
          return (
            <div
              key={itin.id}
              onClick={() => setSelectedItineraryIndex(idx)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1A2433] border-[#00C2CB] shadow-lg shadow-[#00C2CB]/10'
                  : 'bg-[#131B26] border-[#26354A] hover:border-[#87948B]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    itin.tag === 'Fastest'
                      ? 'bg-[#71DBA6]/20 text-[#71DBA6]'
                      : 'bg-[#00C2CB]/20 text-[#00C2CB]'
                  }`}
                >
                  {itin.tag}
                </span>
                <span className="text-xs font-inter font-bold text-[#71DBA6]">
                  ${itin.fareUSD.toFixed(2)}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-inter font-extrabold text-2xl text-[#DFE2EE] tabular-nums">
                  {itin.totalDurationMinutes} min
                </span>
                <span className="text-xs text-[#87948B]">
                  ({itin.departureTime} → {itin.arrivalTime})
                </span>
              </div>

              {/* Legs sequence */}
              <div className="flex items-center gap-1.5 mt-2 text-xs text-[#87948B]">
                <Footprints className="w-3 h-3" />
                <span>{itin.walkingMinutes}m walk</span>
                <span>•</span>
                <span>{itin.transfersCount === 0 ? 'Direct ride' : `${itin.transfersCount} transfer`}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Itinerary Step-by-Step Directions */}
      <div className="bg-[#131B26] border border-[#26354A] rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#26354A] mb-4">
          <div>
            <h4 className="font-hanken font-bold text-base text-[#DFE2EE]">
              Trip Itinerary ({currentItinerary.totalDurationMinutes} mins)
            </h4>
            <p className="text-xs text-[#87948B]">
              Standard Adult Fare: ${currentItinerary.fareUSD.toFixed(2)} • Contactless Tap Enabled
            </p>
          </div>

          {/* Primary Action Button (GO / Start Trip) */}
          <button
            onClick={() => onStartActiveTrip(currentItinerary)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00875A] hover:bg-[#009C69] active:scale-[0.98] text-white font-hanken font-bold text-sm tracking-wide shadow-lg shadow-[#00875a]/25 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>START TRIP (GO)</span>
          </button>
        </div>

        {/* Steps Timeline */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#26354A]">
          {currentItinerary.steps.map((step, idx) => (
            <div key={step.id} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#131B26] border-2 border-[#00C2CB] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#00C2CB]" />
              </div>

              <div className="bg-[#0F131C] p-3 rounded-lg border border-[#26354A]/80">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {step.routeCode && (
                      <RouteBadge
                        code={step.routeCode}
                        mode={step.mode as TransitMode}
                        customColor={step.lineColor}
                        size="sm"
                      />
                    )}
                    <span className="font-hanken font-bold text-sm text-[#DFE2EE]">
                      {step.instruction}
                    </span>
                  </div>

                  <span className="font-inter font-bold text-xs tabular-nums text-[#87948B] shrink-0">
                    {step.durationMinutes} min
                  </span>
                </div>

                {step.platform && (
                  <div className="inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold uppercase bg-[#181C24] text-[#71DBA6] border border-[#26354A] my-1">
                    {step.platform}
                  </div>
                )}

                {step.tip && (
                  <p className="text-xs text-[#87948B] mt-1 italic flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    {step.tip}
                  </p>
                )}

                {step.crowdLevel && (
                  <div className="mt-2 flex items-center gap-2 pt-2 border-t border-[#1C2028]">
                    <span className="text-[11px] text-[#87948B]">Car Occupancy:</span>
                    <CrowdIndicator level={step.crowdLevel} showText={true} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
