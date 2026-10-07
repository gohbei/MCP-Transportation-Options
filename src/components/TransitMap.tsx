import React, { useState, useRef, useEffect } from 'react';
import { Station, LiveVehicle, TransitLine, TransitMode } from '../types/transit';
import { RouteBadge } from './RouteBadge';
import { CrowdIndicator } from './CrowdIndicator';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation2,
  Compass,
  Train,
  Bus,
  Gauge,
  Users,
  Eye,
  Radio,
  Layers,
  Sparkles,
} from 'lucide-react';

interface TransitMapProps {
  stations: Station[];
  lines: TransitLine[];
  vehicles: LiveVehicle[];
  selectedStationId?: string;
  selectedLineId?: string;
  onSelectStation: (station: Station) => void;
  onSelectVehicle?: (vehicle: LiveVehicle) => void;
  highlightRouteStationIds?: string[];
}

export const TransitMap: React.FC<TransitMapProps> = ({
  stations,
  lines,
  vehicles,
  selectedStationId,
  selectedLineId,
  onSelectStation,
  onSelectVehicle,
  highlightRouteStationIds = [],
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeFilterMode, setActiveFilterMode] = useState<string>('all');
  const [inspectVehicle, setInspectVehicle] = useState<LiveVehicle | null>(null);
  const [showLiveBeacons, setShowLiveBeacons] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Station map lookup
  const stationMap = new Map<string, Station>();
  stations.forEach((s) => stationMap.set(s.id, s));

  // Generate SVG path for a line
  const getLineSvgPath = (line: TransitLine): string => {
    const coords = line.stations
      .map((stId) => stationMap.get(stId))
      .filter((s): s is Station => !!s)
      .map((s) => ({ x: s.x, y: s.y }));

    if (coords.length < 2) return '';

    // If it's a circular line like N5, close path
    const isRing = line.mode === 'night';

    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      // Rounded 45/90 transit diagram curves
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      path += ` Q ${prev.x} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    if (isRing) {
      path += ` Z`;
    }

    return path;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking canvas background
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'map-bg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.6));

  const centerOnStation = (station: Station) => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const targetX = width / 2 - station.x * zoom;
    const targetY = height / 2 - station.y * zoom;
    setPan({ x: targetX, y: targetY });
  };

  useEffect(() => {
    if (selectedStationId) {
      const st = stationMap.get(selectedStationId);
      if (st) {
        centerOnStation(st);
      }
    }
  }, [selectedStationId]);

  const filteredLines = lines.filter((l) => {
    if (activeFilterMode === 'all') return true;
    return l.mode === activeFilterMode;
  });

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full h-full min-h-[460px] bg-[#0A0E16] overflow-hidden select-none cursor-grab active:cursor-grabbing border border-[#26354A] rounded-xl"
    >
      {/* Top Map Floating HUD */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Mode filter pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0F131C]/90 backdrop-blur-md border border-[#26354A] pointer-events-auto shadow-lg">
          <button
            onClick={() => setActiveFilterMode('all')}
            className={`px-2.5 py-1 rounded text-xs font-hanken font-bold transition-all ${
              activeFilterMode === 'all'
                ? 'bg-[#00875A] text-white shadow'
                : 'text-[#87948B] hover:text-white hover:bg-[#1C2028]'
            }`}
          >
            All Lines
          </button>
          <button
            onClick={() => setActiveFilterMode('metro')}
            className={`px-2.5 py-1 rounded text-xs font-hanken font-bold flex items-center gap-1 transition-all ${
              activeFilterMode === 'metro'
                ? 'bg-[#0284C7] text-white'
                : 'text-[#87948B] hover:text-white hover:bg-[#1C2028]'
            }`}
          >
            <Train className="w-3 h-3" /> Metro
          </button>
          <button
            onClick={() => setActiveFilterMode('bus')}
            className={`px-2.5 py-1 rounded text-xs font-hanken font-bold flex items-center gap-1 transition-all ${
              activeFilterMode === 'bus'
                ? 'bg-[#E11D48] text-white'
                : 'text-[#87948B] hover:text-white hover:bg-[#1C2028]'
            }`}
          >
            <Bus className="w-3 h-3" /> Bus
          </button>
          <button
            onClick={() => setActiveFilterMode('tram')}
            className={`px-2.5 py-1 rounded text-xs font-hanken font-bold transition-all ${
              activeFilterMode === 'tram'
                ? 'bg-[#059669] text-white'
                : 'text-[#87948B] hover:text-white hover:bg-[#1C2028]'
            }`}
          >
            Tram
          </button>
          <button
            onClick={() => setActiveFilterMode('express')}
            className={`px-2.5 py-1 rounded text-xs font-hanken font-bold transition-all ${
              activeFilterMode === 'express'
                ? 'bg-[#D97706] text-white'
                : 'text-[#87948B] hover:text-white hover:bg-[#1C2028]'
            }`}
          >
            Express
          </button>
        </div>

        {/* Live Telemetry Status Pill */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F131C]/90 backdrop-blur-md border border-[#26354A] shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C2CB] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C2CB]"></span>
            </span>
            <span className="text-[11px] font-hanken font-bold text-[#dfe2ee]">
              {vehicles.length} Vehicles Live
            </span>
          </div>

          <button
            onClick={() => setShowLiveBeacons(!showLiveBeacons)}
            className={`p-2 rounded-lg border backdrop-blur-md transition-all ${
              showLiveBeacons
                ? 'bg-[#00875a]/20 border-[#71dba6]/50 text-[#71dba6]'
                : 'bg-[#0F131C]/90 border-[#26354A] text-[#87948b]'
            }`}
            title="Toggle Live Vehicles Pulsing"
          >
            <Radio className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Zoom and Centering Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 bg-[#0F131C]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#26354A] shadow-xl pointer-events-auto">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg hover:bg-[#262A33] text-[#DFE2EE] active:scale-95 transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg hover:bg-[#262A33] text-[#DFE2EE] active:scale-95 transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-2 rounded-lg hover:bg-[#262A33] text-[#DFE2EE] active:scale-95 transition-all"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive SVG Canvas Layer */}
      <svg
        id="map-bg"
        className="w-full h-full transition-transform duration-75 ease-out"
        viewBox="0 0 1100 800"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern id="grid-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#161c28" strokeWidth="0.8" />
          </pattern>

          {/* Glowing Filter for Live Beacon */}
          <filter id="beacon-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00C2CB" floodOpacity="0.8" />
          </filter>

          {/* Gradients for River & Bay */}
          <linearGradient id="bay-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1522" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0E1A2B" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Map Background Grid */}
        <rect width="1100" height="800" fill="url(#grid-pattern)" />

        {/* Coastline / Bay Geometry */}
        <path
          d="M 680 0 Q 730 180 760 320 T 920 480 Q 1020 540 1100 580 L 1100 0 Z"
          fill="url(#bay-gradient)"
          stroke="#1E293B"
          strokeWidth="1.5"
        />
        <text x="890" y="280" fill="#2E4057" fontSize="13" fontWeight="700" letterSpacing="0.2em">
          PACIFIC BAY SEAWAY
        </text>

        {/* Transit Lines Paths */}
        {filteredLines.map((line) => {
          const pathString = getLineSvgPath(line);
          const isSelected = selectedLineId === line.id;
          return (
            <g key={line.id} className="transition-opacity duration-300">
              {/* Outer casing stroke */}
              <path
                d={pathString}
                fill="none"
                stroke="#0A0E16"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Main colored line stroke */}
              <path
                d={pathString}
                fill="none"
                stroke={line.color}
                strokeWidth={isSelected ? '8' : '6'}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90"
              />
              {/* Highlight dash animation if active or selected */}
              {isSelected && (
                <path
                  d={pathString}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}

        {/* Stations Render */}
        {stations.map((st) => {
          const isSelected = selectedStationId === st.id;
          const isRouteHighlighted = highlightRouteStationIds.includes(st.id);

          return (
            <g
              key={st.id}
              transform={`translate(${st.x}, ${st.y})`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectStation(st);
              }}
              className="cursor-pointer group"
            >
              {/* Pulse glow if selected */}
              {(isSelected || isRouteHighlighted) && (
                <circle
                  r="24"
                  fill="#00C2CB"
                  fillOpacity="0.2"
                  className="animate-ping"
                />
              )}

              {/* Station node background */}
              <circle
                r={st.isInterchange ? '11' : '8'}
                fill="#0A0E16"
                stroke={isSelected ? '#00C2CB' : st.isInterchange ? '#FFFFFF' : '#87948B'}
                strokeWidth={st.isInterchange ? '3.5' : '2.5'}
                className="transition-transform duration-200 group-hover:scale-125"
              />

              {/* Inner dot for interchanges */}
              {st.isInterchange && (
                <circle r="4" fill={isSelected ? '#00C2CB' : '#FFFFFF'} />
              )}

              {/* Station Label */}
              <g transform="translate(14, 4)">
                <rect
                  x="-3"
                  y="-12"
                  width={st.name.length * 7.5 + 10}
                  height="18"
                  rx="4"
                  fill="#0F131C"
                  fillOpacity="0.88"
                  stroke={isSelected ? '#00C2CB' : '#26354A'}
                  strokeWidth="0.8"
                />
                <text
                  x="2"
                  y="0"
                  fill={isSelected ? '#71DBA6' : '#DFE2EE'}
                  fontSize="11"
                  fontWeight={st.isInterchange ? '700' : '600'}
                  fontFamily="Hanken Grotesk, sans-serif"
                >
                  {st.name}
                </text>
              </g>
            </g>
          );
        })}

        {/* Real-Time Live Vehicles Telemetry Layer */}
        {showLiveBeacons &&
          vehicles.map((veh) => {
            const line = lines.find((l) => l.id === veh.lineId);
            const vehColor = line ? line.color : '#00C2CB';
            const isInspected = inspectVehicle?.id === veh.id;

            return (
              <g
                key={veh.id}
                transform={`translate(${veh.x}, ${veh.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  setInspectVehicle(veh);
                  onSelectVehicle?.(veh);
                }}
                className="cursor-pointer group"
              >
                {/* Real-time moving pulse ring */}
                <circle
                  r="16"
                  fill={vehColor}
                  fillOpacity="0.25"
                  className="animate-pulse"
                />

                {/* Vehicle marker body */}
                <circle
                  r="9"
                  fill={vehColor}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  filter="url(#beacon-filter)"
                />

                {/* Vehicle Icon representation */}
                <g transform="translate(-4, -4) scale(0.6)">
                  <path
                    d="M 2 4 C 2 2.5 3 2 7 2 C 11 2 12 2.5 12 4 L 12 11 C 12 12 11 13 9.5 13 L 4.5 13 C 3 13 2 12 2 11 Z"
                    fill="#FFFFFF"
                  />
                </g>

                {/* Mini Vehicle Badge */}
                <g transform="translate(12, -8)">
                  <rect
                    x="0"
                    y="0"
                    width="44"
                    height="16"
                    rx="8"
                    fill="#131B26"
                    stroke={vehColor}
                    strokeWidth="1.2"
                  />
                  <text
                    x="22"
                    y="11"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="9"
                    fontWeight="800"
                    fontFamily="Hanken Grotesk"
                  >
                    {veh.routeCode}
                  </text>
                </g>
              </g>
            );
          })}
      </svg>

      {/* Inspected Vehicle Floating Telemetry Card */}
      {inspectVehicle && (
        <div className="absolute bottom-4 left-4 z-30 max-w-sm w-80 bg-[#131B26] border border-[#00C2CB] rounded-xl p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#26354A]">
            <div className="flex items-center gap-2">
              <RouteBadge code={inspectVehicle.routeCode} mode={inspectVehicle.mode} size="sm" />
              <div>
                <h4 className="font-hanken font-bold text-sm text-[#DFE2EE]">
                  Vehicle #{inspectVehicle.id.toUpperCase()}
                </h4>
                <p className="text-[11px] text-[#87948B]">
                  Heading to {inspectVehicle.destination}
                </p>
              </div>
            </div>
            <button
              onClick={() => setInspectVehicle(null)}
              className="text-[#87948B] hover:text-white p-1 rounded hover:bg-[#262A33]"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2.5 text-xs">
            <div className="bg-[#181C24] p-2 rounded-lg border border-[#26354A]/60 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-[#00C2CB]" />
              <div>
                <span className="text-[10px] text-[#87948B] block">Current Speed</span>
                <span className="font-inter font-bold text-[#DFE2EE] tabular-nums">
                  {inspectVehicle.speedKmH} km/h
                </span>
              </div>
            </div>

            <div className="bg-[#181C24] p-2 rounded-lg border border-[#26354A]/60 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#34D399]" />
              <div>
                <span className="text-[10px] text-[#87948B] block">Passenger Load</span>
                <span className="font-inter font-bold text-[#DFE2EE] tabular-nums">
                  {inspectVehicle.occupancyPercent}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#1C2028]">
            <span className="text-[11px] text-[#87948B]">Crowd Telemetry:</span>
            <CrowdIndicator level={inspectVehicle.crowdLevel} showText={true} />
          </div>
        </div>
      )}
    </div>
  );
};
