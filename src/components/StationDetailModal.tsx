import React from 'react';
import { Station, Departure } from '../types/transit';
import { RouteBadge } from './RouteBadge';
import { ArrivalCard } from './ArrivalCard';
import {
  X,
  MapPin,
  CheckCircle,
  Accessibility,
  ArrowRight,
  Navigation,
  Layers,
  Sparkles,
} from 'lucide-react';

interface StationDetailModalProps {
  station: Station | null;
  departures: Departure[];
  onClose: () => void;
  onPlanTripFrom: (stationId: string) => void;
  onPlanTripTo: (stationId: string) => void;
  onStartRide?: (departure: Departure) => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station,
  departures,
  onClose,
  onPlanTripFrom,
  onPlanTripTo,
  onStartRide,
}) => {
  if (!station) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#131B26] border border-[#26354A] rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#26354A] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-hanken font-extrabold text-xl sm:text-2xl text-[#DFE2EE]">
                {station.name}
              </h2>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase bg-[#1C2028] text-[#00C2CB] border border-[#26354A]">
                {station.code}
              </span>
            </div>
            <p className="text-xs text-[#87948B] mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#71DBA6]" />
              {station.district} • {station.isInterchange ? 'Major Multi-Modal Interchange' : 'Standard Station'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1C2028] hover:bg-[#262A33] text-[#87948B] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1">
          {/* Connecting Lines */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#87948B] mb-2">
              Connecting Transit Lines
            </h4>
            <div className="flex flex-wrap gap-2">
              {station.lines.map((code) => (
                <RouteBadge key={code} code={code} size="md" />
              ))}
            </div>
          </div>

          {/* Quick Facilities & Accessibility */}
          <div className="bg-[#0F131C] p-3 rounded-xl border border-[#26354A]">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#87948B] mb-2">
              Station Facilities & Accessibility
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {station.facilities.map((fac, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-[#181C24] text-[#BDCAC0] border border-[#26354A] flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3 h-3 text-[#71DBA6]" />
                  {fac}
                </span>
              ))}
              {station.accessibility && (
                <span className="px-2.5 py-1 rounded-md bg-[#00875A]/20 text-[#71DBA6] border border-[#71DBA6]/40 flex items-center gap-1.5 font-semibold">
                  <Accessibility className="w-3 h-3" />
                  Step-Free Access
                </span>
              )}
            </div>
          </div>

          {/* Platforms Overview */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#87948B] mb-2">
              Station Platforms ({station.platforms.length})
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {station.platforms.map((plat, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-[#181C24] border border-[#26354A] text-[#DFE2EE] font-medium"
                >
                  {plat}
                </div>
              ))}
            </div>
          </div>

          {/* Live Departures from this station */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#87948B] mb-2">
              Next Live Departures ({departures.length})
            </h4>

            {departures.length === 0 ? (
              <p className="text-xs text-[#87948B] italic p-3 bg-[#0F131C] rounded-lg">
                No active departures in next 30 minutes.
              </p>
            ) : (
              <div className="space-y-2">
                {departures.map((dep) => (
                  <ArrivalCard
                    key={dep.id}
                    departure={dep}
                    onStartRide={onStartRide}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#26354A] shrink-0 flex items-center gap-2">
          <button
            onClick={() => {
              onPlanTripFrom(station.id);
              onClose();
            }}
            className="flex-1 py-2.5 px-3 rounded-lg bg-[#1C2028] hover:bg-[#262A33] border border-[#26354A] text-xs font-hanken font-bold text-[#DFE2EE] flex items-center justify-center gap-1.5 transition-all"
          >
            <Navigation className="w-3.5 h-3.5 text-[#71DBA6]" />
            Depart From Here
          </button>
          <button
            onClick={() => {
              onPlanTripTo(station.id);
              onClose();
            }}
            className="flex-1 py-2.5 px-3 rounded-lg bg-[#00875A] hover:bg-[#009C69] text-white text-xs font-hanken font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#00875a]/20"
          >
            <span>Navigate Here</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
