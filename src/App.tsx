import React, { useState, useEffect } from 'react';
import {
  Station,
  TransitLine,
  Departure,
  LiveVehicle,
  ServiceAlert,
  TripItinerary,
} from './types/transit';
import {
  STATIONS,
  TRANSIT_LINES,
  INITIAL_DEPARTURES,
  INITIAL_VEHICLES,
  SERVICE_ALERTS,
  PRESET_ROUTES,
} from './data/transitData';
import { Header } from './components/Header';
import { LiveDepartureBoard } from './components/LiveDepartureBoard';
import { TransitMap } from './components/TransitMap';
import { TripPlanner } from './components/TripPlanner';
import { LineStatusBoard } from './components/LineStatusBoard';
import { GoModeCompanion } from './components/GoModeCompanion';
import { StationDetailModal } from './components/StationDetailModal';
import { RouteBadge } from './components/RouteBadge';
import {
  Radio,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  ArrowRight,
  Minimize2,
  Maximize2,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'departures' | 'map' | 'planner' | 'lines'>('departures');
  const [selectedStation, setSelectedStation] = useState<Station>(STATIONS[0]); // Grand Central
  const [departuresData, setDeparturesData] = useState<Record<string, Departure[]>>(INITIAL_DEPARTURES);
  const [vehicles, setVehicles] = useState<LiveVehicle[]>(INITIAL_VEHICLES);
  const [activeCompanionTrip, setActiveCompanionTrip] = useState<TripItinerary | null>(null);
  const [activeDepartureRide, setActiveDepartureRide] = useState<Departure | null>(null);
  const [inspectStationModal, setInspectStationModal] = useState<Station | null>(null);
  const [plannerInitialFrom, setPlannerInitialFrom] = useState<string>('st-grand-central');
  const [plannerInitialTo, setPlannerInitialTo] = useState<string>('st-uni-heights');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [mapExpanded, setMapExpanded] = useState<boolean>(false);

  // 1. Live Countdown Clocks Ticker (decrements every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setDeparturesData((prev) => {
        const nextState = { ...prev };
        Object.keys(nextState).forEach((stId) => {
          nextState[stId] = nextState[stId].map((dep) => {
            if (dep.secondsUntilArrival <= 1) {
              // Wrap around to simulate next train in queue (e.g., 3 to 6 mins)
              const nextCycleSeconds = (dep.upcomingDeltas[0] || 4) * 60;
              const newDeltas = dep.upcomingDeltas.slice(1).concat([dep.upcomingDeltas[0] + 10 || 18]);
              return {
                ...dep,
                secondsUntilArrival: nextCycleSeconds,
                upcomingDeltas: newDeltas,
              };
            }
            return {
              ...dep,
              secondsUntilArrival: dep.secondsUntilArrival - 1,
            };
          });
        });
        return nextState;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. Real-Time Moving Vehicles Simulator along track vectors
  useEffect(() => {
    const vehTimer = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => {
          // Increment progress between current and next station
          let nextProgress = v.progressPercent + 3;
          let currentStationId = v.currentStationId;
          let nextStationId = v.nextStationId;

          const stCurrent = STATIONS.find((s) => s.id === currentStationId);
          const stNext = STATIONS.find((s) => s.id === nextStationId);

          if (nextProgress >= 100) {
            nextProgress = 0;
            // Advance to next station in line or reverse
            const line = TRANSIT_LINES.find((l) => l.id === v.lineId);
            if (line) {
              const currIdx = line.stations.indexOf(nextStationId);
              const nextIdx = (currIdx + 1) % line.stations.length;
              currentStationId = nextStationId;
              nextStationId = line.stations[nextIdx];
            }
          }

          // Interpolate SVG x, y coords
          let newX = v.x;
          let newY = v.y;
          if (stCurrent && stNext) {
            const factor = nextProgress / 100;
            newX = Math.round(stCurrent.x + (stNext.x - stCurrent.x) * factor);
            newY = Math.round(stCurrent.y + (stNext.y - stCurrent.y) * factor);
          }

          return {
            ...v,
            progressPercent: nextProgress,
            currentStationId,
            nextStationId,
            x: newX,
            y: newY,
          };
        })
      );
    }, 1500);

    return () => clearInterval(vehTimer);
  }, []);

  // Handle GPS location simulation
  const handleLocateMe = () => {
    setIsLocating(true);
    setTimeout(() => {
      // Pin to Grand Central or Market East
      setSelectedStation(STATIONS[0]);
      setIsLocating(false);
    }, 600);
  };

  // Start active Go companion from departure card
  const handleStartRide = (departure: Departure) => {
    setActiveDepartureRide(departure);
    setActiveCompanionTrip(null);
  };

  // Start active Go companion from trip planner
  const handleStartActiveTrip = (itinerary: TripItinerary) => {
    setActiveCompanionTrip(itinerary);
    setActiveDepartureRide(null);
  };

  const currentDepartures = departuresData[selectedStation.id] || INITIAL_DEPARTURES['st-grand-central'] || [];

  return (
    <div className="min-h-screen bg-[#0F131C] text-[#DFE2EE] flex flex-col font-inter selection:bg-[#00875A] selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
      />

      {/* Main Layout Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6">
        {/* Quick Commute Bar (Fast-lane preset routes) */}
        <div className="mb-4 bg-[#131B26] border border-[#26354A] rounded-xl p-3 flex items-center justify-between gap-3 overflow-x-auto shadow-md">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#00C2CB] animate-ping" />
            <span className="text-xs font-hanken font-bold uppercase tracking-wider text-[#00C2CB]">
              Quick Commutes:
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {PRESET_ROUTES.map((route) => (
              <button
                key={route.id}
                onClick={() => {
                  setPlannerInitialFrom(route.fromId);
                  setPlannerInitialTo(route.toId);
                  setActiveTab('planner');
                }}
                className="px-2.5 py-1 rounded-md bg-[#181C24] hover:bg-[#262A33] border border-[#26354A] text-xs font-medium text-[#BDCAC0] hover:text-[#DFE2EE] whitespace-nowrap transition-colors flex items-center gap-1.5"
              >
                <span>{route.label}</span>
                <ChevronRight className="w-3 h-3 text-[#71DBA6]" />
              </button>
            ))}
          </div>
        </div>

        {/* View Switcher Container */}
        {/* On Desktop/Large Screen, when tab is 'map' or 'departures', we show an ergonomic split layout so map and departures are both accessible, or allow full view */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Schedule & Active Tab Content */}
          <div
            className={`transition-all duration-300 ${
              mapExpanded && activeTab === 'map'
                ? 'hidden'
                : activeTab === 'map'
                ? 'lg:col-span-5'
                : activeTab === 'departures'
                ? 'lg:col-span-7'
                : 'lg:col-span-12'
            }`}
          >
            {activeTab === 'departures' && (
              <LiveDepartureBoard
                stations={STATIONS}
                currentStation={selectedStation}
                departures={currentDepartures}
                onSelectStation={(st) => setSelectedStation(st)}
                onStartRide={handleStartRide}
                onOpenStationDetails={(st) => setInspectStationModal(st)}
              />
            )}

            {activeTab === 'planner' && (
              <div className="max-w-3xl mx-auto">
                <TripPlanner
                  stations={STATIONS}
                  initialFromId={plannerInitialFrom}
                  initialToId={plannerInitialTo}
                  onStartActiveTrip={handleStartActiveTrip}
                />
              </div>
            )}

            {activeTab === 'lines' && (
              <div className="max-w-4xl mx-auto">
                <LineStatusBoard
                  lines={TRANSIT_LINES}
                  alerts={SERVICE_ALERTS}
                  stations={STATIONS}
                  onSelectStation={(st) => {
                    setSelectedStation(st);
                    setInspectStationModal(st);
                  }}
                />
              </div>
            )}

            {/* Map tab auxiliary view on smaller screens / left split */}
            {activeTab === 'map' && (
              <div className="space-y-4">
                <div className="bg-[#131B26] border border-[#26354A] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-hanken font-bold text-base text-[#DFE2EE] flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#71DBA6]" />
                      <span>{selectedStation.name}</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#1C2028] text-[#00C2CB] border border-[#26354A]">
                      {selectedStation.code}
                    </span>
                  </div>

                  <p className="text-xs text-[#87948B] mb-3">
                    {selectedStation.district} • {selectedStation.lines.length} lines connected
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {selectedStation.lines.map((code) => (
                      <RouteBadge key={code} code={code} size="sm" />
                    ))}
                  </div>

                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#87948B] mb-2">
                    Departures at this station
                  </h4>

                  <div className="space-y-2">
                    {currentDepartures.slice(0, 3).map((dep) => (
                      <div
                        key={dep.id}
                        className="p-2.5 rounded-lg bg-[#0F131C] border border-[#26354A] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <RouteBadge code={dep.routeCode} size="sm" />
                          <div>
                            <span className="text-xs font-hanken font-bold text-[#DFE2EE] block">
                              {dep.destination}
                            </span>
                            <span className="text-[10px] text-[#87948B]">
                              {dep.platform}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-inter font-extrabold text-[#71DBA6] tabular-nums">
                            {Math.floor(dep.secondsUntilArrival / 60)}m
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setInspectStationModal(selectedStation)}
                    className="w-full mt-3 py-2 rounded-lg bg-[#1C2028] hover:bg-[#262A33] border border-[#26354A] text-xs font-hanken font-bold text-[#DFE2EE] transition-all text-center"
                  >
                    View All Platform Schedules
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column / Map Column (Always visible on desktop when Departures or Map is active) */}
          {(activeTab === 'departures' || activeTab === 'map') && (
            <div
              className={`transition-all duration-300 ${
                activeTab === 'map'
                  ? mapExpanded
                    ? 'lg:col-span-12 h-[82vh]'
                    : 'lg:col-span-7 h-[72vh]'
                  : 'lg:col-span-5 h-[620px]'
              }`}
            >
              <div className="relative h-full flex flex-col">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#00C2CB] animate-pulse" />
                    <span className="text-xs font-hanken font-bold uppercase tracking-wider text-[#DFE2EE]">
                      Interactive Transit Grid
                    </span>
                  </div>

                  {activeTab === 'map' && (
                    <button
                      onClick={() => setMapExpanded(!mapExpanded)}
                      className="p-1.5 rounded-lg bg-[#131B26] border border-[#26354A] text-[#87948B] hover:text-white transition-colors"
                      title={mapExpanded ? 'Contract Map' : 'Full Screen Map'}
                    >
                      {mapExpanded ? (
                        <Minimize2 className="w-4 h-4" />
                      ) : (
                        <Maximize2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                <div className="flex-1 w-full min-h-[460px]">
                  <TransitMap
                    stations={STATIONS}
                    lines={TRANSIT_LINES}
                    vehicles={vehicles}
                    selectedStationId={selectedStation.id}
                    onSelectStation={(st) => {
                      setSelectedStation(st);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Active Trip Companion HUD (GO Mode) */}
      {(activeCompanionTrip || activeDepartureRide) && (
        <GoModeCompanion
          itinerary={activeCompanionTrip}
          activeDeparture={activeDepartureRide}
          onExit={() => {
            setActiveCompanionTrip(null);
            setActiveDepartureRide(null);
          }}
        />
      )}

      {/* Station Details Inspector Modal */}
      <StationDetailModal
        station={inspectStationModal}
        departures={
          inspectStationModal
            ? departuresData[inspectStationModal.id] || []
            : []
        }
        onClose={() => setInspectStationModal(null)}
        onPlanTripFrom={(stId) => {
          setPlannerInitialFrom(stId);
          setActiveTab('planner');
        }}
        onPlanTripTo={(stId) => {
          setPlannerInitialTo(stId);
          setActiveTab('planner');
        }}
        onStartRide={handleStartRide}
      />
    </div>
  );
}
