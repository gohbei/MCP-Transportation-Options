import React from 'react';
import { Departure, TransitMode } from '../types/transit';
import { RouteBadge } from './RouteBadge';
import { CrowdIndicator } from './CrowdIndicator';
import { Train, Bus, Compass, Zap, Moon, Accessibility, Bike, Clock, ArrowRight } from 'lucide-react';

interface ArrivalCardProps {
  departure: Departure;
  onSelect?: (departure: Departure) => void;
  onStartRide?: (departure: Departure) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (departureId: string) => void;
}

const getModeIcon = (mode: TransitMode) => {
  switch (mode) {
    case 'metro':
      return <Train className="w-3.5 h-3.5 text-[#0284c7]" />;
    case 'bus':
      return <Bus className="w-3.5 h-3.5 text-[#e11d48]" />;
    case 'tram':
      return <Train className="w-3.5 h-3.5 text-[#059669]" />;
    case 'express':
      return <Zap className="w-3.5 h-3.5 text-[#d97706]" />;
    case 'night':
      return <Moon className="w-3.5 h-3.5 text-[#7c3aed]" />;
    default:
      return <Compass className="w-3.5 h-3.5 text-[#71dba6]" />;
  }
};

export const ArrivalCard: React.FC<ArrivalCardProps> = ({
  departure,
  onSelect,
  onStartRide,
}) => {
  const isArriving = departure.secondsUntilArrival <= 60;
  const minutes = Math.floor(departure.secondsUntilArrival / 60);
  const seconds = departure.secondsUntilArrival % 60;

  return (
    <div
      onClick={() => onSelect?.(departure)}
      className="group relative rounded-lg bg-[#131B26] border border-[#26354A] p-3.5 transition-all duration-200 hover:border-[#00C2CB] hover:shadow-lg hover:shadow-[#00c2cb]/5 active:bg-[#1A2433] cursor-pointer"
    >
      {/* Top Row: Route Pill, Destination, Platform Badge, Countdown */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <RouteBadge code={departure.routeCode} mode={departure.mode} />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-hanken font-bold text-base text-[#dfe2ee] truncate group-hover:text-white transition-colors">
                {departure.destination}
              </h3>
              {departure.platform && (
                <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-[#1c2028] text-[#87948b] border border-[#26354a]">
                  {departure.platform}
                </span>
              )}
            </div>

            {departure.via && (
              <p className="text-xs text-[#87948b] truncate mt-0.5">
                {departure.via}
              </p>
            )}
          </div>
        </div>

        {/* Right-aligned countdown or ARRIVING pill */}
        <div className="shrink-0 text-right flex flex-col items-end">
          {isArriving ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00875a]/20 border border-[#71dba6]/40 text-[#71dba6] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#71dba6] animate-ping" />
              <span className="font-hanken font-extrabold text-[12px] tracking-wider uppercase">
                ARRIVING
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="font-inter font-extrabold text-2xl lg:text-[28px] tabular-nums text-[#dfe2ee] leading-none">
                {minutes}
              </span>
              <span className="text-xs font-semibold uppercase text-[#87948b]">
                min
              </span>
            </div>
          )}

          {/* Delay indicator or On Time status */}
          <div className="mt-1 flex items-center gap-1">
            {departure.delayMinutes > 0 ? (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#f59e0b]/15 text-[#ffb95f] border border-[#f59e0b]/30">
                +{departure.delayMinutes}m delay
              </span>
            ) : (
              <span className="text-[11px] font-medium text-[#71dba6]/90 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#71dba6]" />
                On Time
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming departures, crowd indicator, mode badge, ride trigger */}
      <div className="pt-2.5 border-t border-[#1c2028] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Transit mode icon */}
          <div className="flex items-center gap-1 text-[#bdcac0] bg-[#0f131c] px-2 py-0.5 rounded border border-[#26354a]/80" title={`Mode: ${departure.mode}`}>
            {getModeIcon(departure.mode)}
            <span className="text-[11px] font-medium capitalize">{departure.mode}</span>
          </div>

          {/* Crowd indicator */}
          <CrowdIndicator level={departure.crowdLevel} showText={true} />

          {/* Upcoming departures chips */}
          {departure.upcomingDeltas && departure.upcomingDeltas.length > 0 && (
            <div className="flex items-center gap-1 text-[#87948b] font-inter text-[11px] tabular-nums pl-1">
              <Clock className="w-3 h-3 text-[#87948b]" />
              <span className="hidden sm:inline text-[#64748b]">Then:</span>
              {departure.upcomingDeltas.slice(0, 2).map((delta, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded bg-[#181c24] text-[#bdcac0] font-semibold border border-[#26354a]/60"
                >
                  +{delta}m
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Feature badges & quick action */}
        <div className="flex items-center gap-2 ml-auto">
          {departure.isAccessible && (
            <span title="Wheelchair Accessible">
              <Accessibility className="w-3.5 h-3.5 text-[#87948b]" />
            </span>
          )}
          {departure.hasBicycleRack && (
            <span title="Bicycle Friendly">
              <Bike className="w-3.5 h-3.5 text-[#87948b]" />
            </span>
          )}

          {onStartRide && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartRide(departure);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#00875a] hover:bg-[#009c69] active:scale-95 text-white font-hanken font-bold text-[11px] transition-all shadow-sm"
              title="Board vehicle and start live companion"
            >
              <span>Ride</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
