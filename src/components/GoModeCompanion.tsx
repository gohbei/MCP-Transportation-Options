import React, { useState, useEffect } from 'react';
import { TripItinerary, Departure } from '../types/transit';
import { RouteBadge } from './RouteBadge';
import {
  Bell,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  MapPin,
  Clock,
  Compass,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface GoModeCompanionProps {
  itinerary?: TripItinerary | null;
  activeDeparture?: Departure | null;
  onExit: () => void;
}

export const GoModeCompanion: React.FC<GoModeCompanionProps> = ({
  itinerary,
  activeDeparture,
  onExit,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(142); // 2m 22s
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [alightAlertFired, setAlightAlertFired] = useState<boolean>(false);

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          return 180; // loop to next simulated station
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const routeCode = activeDeparture?.routeCode || itinerary?.steps[1]?.routeCode || 'M1';
  const destination = activeDeparture?.destination || itinerary?.destinationStation.name || 'Horizon Tech Park';
  const nextStop = currentStopIndex === 1 ? 'Market East Station' : 'Waterfront Ferry Quay';
  const finalDestination = itinerary?.destinationStation.name || 'Horizon Tech Park';

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isArriving = secondsRemaining <= 30;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5 pointer-events-none">
      <div className="max-w-xl mx-auto bg-[#131B26] border-2 border-[#00C2CB] rounded-2xl p-4 sm:p-5 shadow-2xl pointer-events-auto backdrop-blur-xl animate-in slide-in-from-bottom-6 duration-300">
        {/* Top Bar with Pulsing Live Status & Exit */}
        <div className="flex items-center justify-between pb-3 border-b border-[#26354A] mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#71DBA6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#71DBA6]"></span>
            </span>
            <span className="font-hanken font-extrabold text-xs uppercase tracking-wider text-[#71DBA6]">
              ACTIVE TRANSIT HUD • IN TRANSIT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-lg border transition-all ${
                soundEnabled
                  ? 'bg-[#00875a]/20 border-[#71dba6]/50 text-[#71dba6]'
                  : 'bg-[#1C2028] border-[#26354A] text-[#87948B]'
              }`}
              title="Station Audio Chimes"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onExit}
              className="p-1.5 rounded-lg bg-[#1C2028] hover:bg-[#262A33] border border-[#26354A] text-[#DFE2EE] transition-all"
              title="Close HUD"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Telemetry Readout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <RouteBadge code={routeCode} size="md" />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#87948B] block">
                  Next Alight Station
                </span>
                <h3 className="font-hanken font-black text-lg text-white truncate">
                  {nextStop}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#87948B] mt-2">
              <span className="px-2 py-0.5 rounded font-semibold bg-[#1C2028] text-[#00C2CB] border border-[#26354A]">
                Exit Door: Left Side
              </span>
              <span>•</span>
              <span>Platform 1</span>
            </div>
          </div>

          {/* Large Tabular Countdown Clock */}
          <div className="bg-[#0F131C] p-3 rounded-xl border border-[#26354A] flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#87948B] mb-0.5">
              Time to Next Stop
            </span>

            {isArriving ? (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#00875A]/25 border border-[#71DBA6] text-[#71DBA6] animate-pulse my-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#71DBA6] animate-ping" />
                <span className="font-hanken font-extrabold text-sm tracking-wider uppercase">
                  ARRIVING NOW
                </span>
              </div>
            ) : (
              <div className="font-inter font-black text-3xl sm:text-4xl tabular-nums text-[#DFE2EE] tracking-tight">
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </div>
            )}

            <span className="text-[11px] text-[#71DBA6] font-medium mt-0.5">
              Running On Schedule (0m delay)
            </span>
          </div>
        </div>

        {/* Route Progress Dots */}
        <div className="mt-4 pt-3 border-t border-[#1C2028]">
          <div className="flex items-center justify-between text-xs text-[#87948B] mb-2 font-hanken font-semibold">
            <span>Downtown Core</span>
            <span>Final: {finalDestination}</span>
          </div>

          <div className="relative w-full h-2 bg-[#1C2028] rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#00C2CB] to-[#71DBA6] rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, (1 - secondsRemaining / 180) * 100)}%` }}
            />
          </div>
        </div>

        {/* Quick HUD Action Buttons */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              setCurrentStopIndex((c) => c + 1);
              setSecondsRemaining(180);
            }}
            className="flex-1 py-2 px-3 rounded-lg bg-[#1C2028] hover:bg-[#262A33] border border-[#26354A] text-xs font-hanken font-bold text-[#DFE2EE] active:scale-95 transition-all text-center"
          >
            Advance to Next Stop
          </button>

          <button
            onClick={onExit}
            className="flex-1 py-2 px-3 rounded-lg bg-[#00875A] hover:bg-[#009C69] text-white text-xs font-hanken font-bold active:scale-95 transition-all text-center shadow-md shadow-[#00875a]/20"
          >
            Complete Ride
          </button>
        </div>
      </div>
    </div>
  );
};
