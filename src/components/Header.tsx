import React, { useState, useEffect } from 'react';
import {
  Compass,
  Radio,
  MapPin,
  Clock,
  Activity,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'departures' | 'map' | 'planner' | 'lines';
  onTabChange: (tab: 'departures' | 'map' | 'planner' | 'lines') => void;
  onLocateMe?: () => void;
  isLocating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onLocateMe,
  isLocating,
}) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F17]/85 backdrop-blur-xl border-b border-white/[0.08]">
      {/* Top telemetry bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between border-b border-[#1c2028]/80 text-[11px] text-[#87948b]">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#71dba6] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#71dba6]"></span>
          </span>
          <span className="font-hanken font-bold uppercase tracking-wider text-[#71dba6]">
            System Operational
          </span>
          <span className="hidden sm:inline text-[#3e4942]">•</span>
          <span className="hidden sm:inline text-[#bdcac0]">
            98.2% On-Time System Performance
          </span>
        </div>

        <div className="flex items-center gap-3 font-inter">
          <div className="flex items-center gap-1.5 tabular-nums text-[#dfe2ee] font-semibold bg-[#131b26] px-2 py-0.5 rounded border border-[#26354a]">
            <Clock className="w-3 h-3 text-[#00c2cb]" />
            <span>{timeString || '14:32:00'}</span>
          </div>

          <button
            onClick={onLocateMe}
            className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded border transition-all text-[11px] font-semibold ${
              isLocating
                ? 'bg-[#00875a]/20 border-[#71dba6]/50 text-[#71dba6]'
                : 'bg-[#181c24] border-[#26354a] text-[#bdcac0] hover:text-white'
            }`}
            title="Locate Nearest Station via GPS"
          >
            <MapPin className="w-3 h-3 text-[#00c2cb]" />
            <span>GPS Locked</span>
          </button>
        </div>
      </div>

      {/* Main Brand & Navigation Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Mark */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00875A] to-[#00C2CB] p-0.5 flex items-center justify-center shadow-lg shadow-[#00875a]/20">
              <div className="w-full h-full bg-[#0F131C] rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#71DBA6]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-hanken font-extrabold text-xl tracking-tight text-[#DFE2EE] uppercase">
                  Urban Pulse
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest bg-[#00875A] text-white">
                  Transit
                </span>
              </div>
              <p className="text-[11px] text-[#87948B] tracking-wide font-inter">
                Metropolitan Real-Time High-Contrast Telemetry
              </p>
            </div>
          </div>
        </div>

        {/* Primary View Switcher Navigation */}
        <nav className="flex items-center gap-1 p-1 bg-[#131B26] border border-[#26354A] rounded-xl self-start md:self-auto overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => onTabChange('departures')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-hanken font-bold uppercase tracking-wider transition-all whitespace-nowrap text-center ${
              activeTab === 'departures'
                ? 'bg-[#00875A] text-white shadow-md'
                : 'text-[#87948B] hover:text-[#DFE2EE] hover:bg-[#1C2028]'
            }`}
          >
            Live Departures
          </button>

          <button
            onClick={() => onTabChange('map')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-hanken font-bold uppercase tracking-wider transition-all whitespace-nowrap text-center ${
              activeTab === 'map'
                ? 'bg-[#00875A] text-white shadow-md'
                : 'text-[#87948B] hover:text-[#DFE2EE] hover:bg-[#1C2028]'
            }`}
          >
            Live Map & Network
          </button>

          <button
            onClick={() => onTabChange('planner')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-hanken font-bold uppercase tracking-wider transition-all whitespace-nowrap text-center ${
              activeTab === 'planner'
                ? 'bg-[#00875A] text-white shadow-md'
                : 'text-[#87948B] hover:text-[#DFE2EE] hover:bg-[#1C2028]'
            }`}
          >
            Trip Planner
          </button>

          <button
            onClick={() => onTabChange('lines')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-hanken font-bold uppercase tracking-wider transition-all whitespace-nowrap text-center ${
              activeTab === 'lines'
                ? 'bg-[#00875A] text-white shadow-md'
                : 'text-[#87948B] hover:text-[#DFE2EE] hover:bg-[#1C2028]'
            }`}
          >
            System Status
          </button>
        </nav>
      </div>
    </header>
  );
};
