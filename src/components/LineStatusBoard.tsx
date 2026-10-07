import React, { useState } from 'react';
import { TransitLine, ServiceAlert, Station } from '../types/transit';
import { RouteBadge } from './RouteBadge';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
  Radio,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface LineStatusBoardProps {
  lines: TransitLine[];
  alerts: ServiceAlert[];
  stations: Station[];
  onSelectStation?: (station: Station) => void;
}

export const LineStatusBoard: React.FC<LineStatusBoardProps> = ({
  lines,
  alerts,
  stations,
  onSelectStation,
}) => {
  const [expandedLineId, setExpandedLineId] = useState<string | null>(null);

  const toggleExpand = (lineId: string) => {
    setExpandedLineId(expandedLineId === lineId ? null : lineId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#00875a]/20 text-[#71dba6] border border-[#71dba6]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#71dba6]" />
            Good Service
          </span>
        );
      case 'minor-delay':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f59e0b]/20 text-[#ffb95f] border border-[#f59e0b]/40">
            <AlertTriangle className="w-3 h-3 text-[#f59e0b]" />
            Minor Delays
          </span>
        );
      case 'disrupted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#dc2626]/20 text-[#ffb4ab] border border-[#dc2626]/40">
            <ShieldAlert className="w-3 h-3 text-[#dc2626]" />
            Disrupted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1c2028] text-[#87948b]">
            Normal
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Active Service Advisories Banner */}
      {alerts.length > 0 && (
        <div className="bg-[#131B26] border border-[#F59E0B]/40 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
            <h3 className="font-hanken font-bold text-sm text-[#DFE2EE] uppercase tracking-wide">
              Live System Service Bulletins ({alerts.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className="bg-[#0F131C] p-3 rounded-lg border border-[#26354A] flex flex-col sm:flex-row sm:items-start justify-between gap-2"
              >
                <div className="flex items-start gap-2.5">
                  <RouteBadge code={alt.lineCode} size="sm" />
                  <div>
                    <h4 className="font-hanken font-bold text-xs sm:text-sm text-[#DFE2EE]">
                      {alt.headline}
                    </h4>
                    <p className="text-xs text-[#87948B] mt-0.5 leading-relaxed">
                      {alt.description}
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-[#FFB95F]">
                      Affected: {alt.affectedSegment}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-[#64748B] self-end sm:self-start shrink-0">
                  {alt.updatedAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Network Lines Master Grid */}
      <div className="bg-[#131B26] border border-[#26354A] rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#26354A] mb-3">
          <div>
            <h3 className="font-hanken font-bold text-base text-[#DFE2EE]">
              Transit Lines Health Overview
            </h3>
            <p className="text-xs text-[#87948B]">
              Real-time telemetry updated every 30 seconds
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1C2028] text-[#71DBA6] border border-[#26354A]">
            97.8% On-Time System Average
          </span>
        </div>

        <div className="divide-y divide-[#1C2028]">
          {lines.map((line) => {
            const isExpanded = expandedLineId === line.id;
            const lineStations = line.stations
              .map((id) => stations.find((s) => s.id === id))
              .filter((s): s is Station => !!s);

            return (
              <div key={line.id} className="py-3">
                <div
                  onClick={() => toggleExpand(line.id)}
                  className="flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <RouteBadge code={line.code} mode={line.mode} customColor={line.color} />
                    <div className="min-w-0">
                      <h4 className="font-hanken font-bold text-sm text-[#DFE2EE] group-hover:text-white transition-colors truncate">
                        {line.name}
                      </h4>
                      <p className="text-xs text-[#87948B] mt-0.5 truncate">
                        {line.statusMessage}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {getStatusBadge(line.status)}
                    <button className="p-1 rounded text-[#87948B] group-hover:text-white transition-colors">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Line Details */}
                {isExpanded && (
                  <div className="mt-3 pl-4 pt-3 border-t border-[#1C2028] bg-[#0F131C] p-3 rounded-lg animate-in fade-in">
                    <div className="flex items-center justify-between text-xs text-[#87948B] mb-2 font-inter">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#00C2CB]" />
                        Headway: Every {line.headwaysMinutes} minutes
                      </span>
                      <span>{lineStations.length} Stations in Corridor</span>
                    </div>

                    {/* Horizontal or Vertical Station Ladder */}
                    <div className="mt-3 space-y-1.5">
                      {lineStations.map((st, idx) => (
                        <div
                          key={st.id}
                          onClick={() => onSelectStation?.(st)}
                          className="flex items-center justify-between p-2 rounded hover:bg-[#181C24] cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: line.color }}
                            />
                            <span className="text-xs font-hanken font-semibold text-[#DFE2EE]">
                              {st.name}
                            </span>
                            {st.isInterchange && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-[#1C2028] text-[#87948B] border border-[#26354A]">
                                Transfer
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] text-[#87948B] uppercase font-mono">
                            {st.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
