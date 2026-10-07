import React, { useState, useEffect } from 'react';
import { RouteBadge } from './RouteBadge';
import { CrowdIndicator } from './CrowdIndicator';
import {
  Bus,
  RefreshCw,
  Search,
  Activity,
  AlertCircle,
  Clock,
  Accessibility,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Code2,
} from 'lucide-react';

interface LtaNextBus {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string;
  Feature?: 'WAB' | string;
  Type?: 'SD' | 'DD' | 'BD' | string;
}

interface LtaBusService {
  ServiceNo: string;
  Operator: string;
  NextBus: LtaNextBus;
  NextBus2?: LtaNextBus;
  NextBus3?: LtaNextBus;
}

interface LtaApiResponse {
  BusStopCode?: string;
  Services?: LtaBusService[];
  error?: string;
  details?: string;
  _warning?: string;
  _meta?: {
    source?: string;
    refreshedAt?: string;
    refreshIntervalSeconds?: number;
    busStopName?: string;
    query?: { BusStopCode: string; ServiceNo: string | null };
  };
}

interface HealthData {
  status: string;
  timestamp: string;
  uptimeSeconds: number;
  services: {
    apiGateway: { status: string; latencyMs: number };
    ltaDataMall: {
      status: string;
      endpoint: string;
      hasAccountKey: boolean;
      refreshIntervalSeconds: number;
    };
  };
  system: { heapUsedMb: number; rssMb: number };
}

const POPULAR_SINGAPORE_STOPS = [
  { code: '04121', name: 'Old Parliament Bldg (Supreme Court)', desc: 'Near National Gallery & City Hall' },
  { code: '08057', name: 'Dhoby Ghaut Stn Exit B', desc: 'Orchard / Plaza Singapura interchange' },
  { code: '01012', name: 'Bugis Stn / Victoria St', desc: 'Bugis Junction shopping concourse' },
  { code: '03011', name: 'Fullerton Sq / Marina Bay', desc: 'Financial district & Merlion park' },
];

export const LtaBusArrivalView: React.FC = () => {
  const [busStopCode, setBusStopCode] = useState<string>('04121');
  const [serviceNo, setServiceNo] = useState<string>('');
  const [data, setData] = useState<LtaApiResponse | null>(null);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [secondsUntilNextRefresh, setSecondsUntilNextRefresh] = useState<number>(20);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [showJsonRaw, setShowJsonRaw] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Keep local clock ticking for precise seconds calculation
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Fetch health status
  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const json = await res.json();
        setHealth(json);
      }
    } catch (err) {
      console.warn('Failed to fetch health status:', err);
    }
  };

  // Fetch LTA Bus Arrival
  const fetchBusArrival = async () => {
    setLoading(true);
    try {
      let url = `/api/bus-arrival?BusStopCode=${encodeURIComponent(busStopCode.trim() || '04121')}`;
      if (serviceNo.trim()) {
        url += `&ServiceNo=${encodeURIComponent(serviceNo.trim())}`;
      }

      const res = await fetch(url);
      const json: LtaApiResponse = await res.json();
      setData(json);
      setLastRefreshed(new Date());
      setSecondsUntilNextRefresh(20);
    } catch (err: any) {
      console.error('Error fetching LTA bus arrivals:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchHealth();
    fetchBusArrival();
  }, []);

  // Auto-refresh countdown every 20 seconds (as prescribed by LTA DataMall)
  useEffect(() => {
    if (!autoRefresh) return;

    const timer = setInterval(() => {
      setSecondsUntilNextRefresh((prev) => {
        if (prev <= 1) {
          fetchBusArrival();
          fetchHealth();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefresh, busStopCode, serviceNo]);

  // Helper to format countdown from ISO arrival string
  const formatArrivalCountdown = (isoString?: string) => {
    if (!isoString) return { text: 'No Info', isArriving: false, minutes: null };
    const diffSeconds = Math.round((new Date(isoString).getTime() - currentTime) / 1000);

    if (diffSeconds <= 60) {
      return { text: 'ARRIVING', isArriving: true, minutes: 0, seconds: Math.max(0, diffSeconds) };
    }
    const minutes = Math.floor(diffSeconds / 60);
    return { text: `${minutes} min`, isArriving: false, minutes, seconds: diffSeconds % 60 };
  };

  // Helper for LTA crowd load token
  const getLoadBadge = (load?: string) => {
    switch (load) {
      case 'SEA':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#00875a]/20 text-[#71dba6] border border-[#71dba6]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#71dba6]" />
            Seats Avail (SEA)
          </span>
        );
      case 'SDA':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#f59e0b]/20 text-[#ffb95f] border border-[#f59e0b]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
            Standing Avail (SDA)
          </span>
        );
      case 'LSD':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#dc2626]/20 text-[#ffb4ab] border border-[#dc2626]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
            Limited Standing (LSD)
          </span>
        );
      default:
        return null;
    }
  };

  // Helper for bus vehicle deck type
  const getDeckTypeName = (type?: string) => {
    switch (type) {
      case 'DD':
        return 'Double Deck (DD)';
      case 'SD':
        return 'Single Deck (SD)';
      case 'BD':
        return 'Bendy Bus (BD)';
      default:
        return type || 'Bus';
    }
  };

  return (
    <div className="space-y-4">
      {/* API Health Monitor Strip */}
      <div className="bg-[#131B26] border border-[#26354A] rounded-xl p-3.5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#71DBA6] animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-hanken font-bold text-xs uppercase tracking-wider text-[#DFE2EE]">
                  API Gateway Health (/api/health)
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-[#00875A] text-white">
                  {health?.status || 'Active'}
                </span>
              </div>
              <p className="text-[11px] text-[#87948B]">
                LTA DataMall v3 Endpoint • Proxy Status: {health?.services.ltaDataMall.hasAccountKey ? 'Live Key Connected' : 'Ready (Key in .env)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#87948B]">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#00C2CB]" />
              <span className="tabular-nums">
                Auto-sync in <strong className="text-[#DFE2EE]">{secondsUntilNextRefresh}s</strong>
              </span>
            </div>

            <button
              onClick={() => {
                fetchBusArrival();
                fetchHealth();
              }}
              disabled={loading}
              className="p-1.5 rounded-lg bg-[#1C2028] hover:bg-[#262A33] border border-[#26354A] text-[#DFE2EE] active:scale-95 transition-all"
              title="Manual Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#00C2CB]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Query Bar for BusStopCode and ServiceNo */}
      <div className="bg-[#131B26] border border-[#26354A] rounded-xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="w-4 h-4 text-[#E11D48]" />
            <h3 className="font-hanken font-bold text-sm text-[#DFE2EE] uppercase tracking-wide">
              LTA DataMall Bus Arrival v3 Query
            </h3>
          </div>

          <span className="text-[11px] font-mono text-[#00C2CB] bg-[#0F131C] px-2 py-0.5 rounded border border-[#26354A]">
            GET /api/bus-arrival
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchBusArrival();
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-2.5"
        >
          {/* BusStopCode Input */}
          <div className="sm:col-span-6 bg-[#0F131C] border border-[#26354A] rounded-lg px-3 py-2 focus-within:border-[#00C2CB] focus-within:ring-1 focus-within:ring-[#00C2CB]">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#87948B]">
              BusStopCode (Required)
            </label>
            <input
              type="text"
              value={busStopCode}
              onChange={(e) => setBusStopCode(e.target.value)}
              placeholder="e.g. 04121"
              className="w-full bg-transparent text-sm font-hanken font-bold text-[#DFE2EE] focus:outline-hidden"
            />
          </div>

          {/* ServiceNo Input */}
          <div className="sm:col-span-4 bg-[#0F131C] border border-[#26354A] rounded-lg px-3 py-2 focus-within:border-[#00C2CB] focus-within:ring-1 focus-within:ring-[#00C2CB]">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#87948B]">
              ServiceNo (Optional, e.g. 7)
            </label>
            <input
              type="text"
              value={serviceNo}
              onChange={(e) => setServiceNo(e.target.value)}
              placeholder="All or e.g. 7"
              className="w-full bg-transparent text-sm font-hanken font-bold text-[#DFE2EE] focus:outline-hidden"
            />
          </div>

          {/* Search Button */}
          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] rounded-lg bg-[#00875A] hover:bg-[#009C69] active:scale-[0.98] text-white font-hanken font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#00875a]/20"
            >
              <Search className="w-4 h-4" />
              <span>Query</span>
            </button>
          </div>
        </form>

        {/* Quick Singapore Bus Stop Shortcuts */}
        <div className="pt-2 border-t border-[#1C2028] flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] text-[#87948B] shrink-0">Sample Stops:</span>
          {POPULAR_SINGAPORE_STOPS.map((st) => (
            <button
              key={st.code}
              type="button"
              onClick={() => {
                setBusStopCode(st.code);
                setServiceNo('');
                setTimeout(() => fetchBusArrival(), 50);
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all border ${
                busStopCode === st.code
                  ? 'bg-[#1C2028] text-[#71DBA6] border-[#71DBA6]/60'
                  : 'bg-[#0F131C] text-[#87948B] border-[#26354A] hover:text-[#DFE2EE]'
              }`}
            >
              <strong>{st.code}</strong> - {st.name}
            </button>
          ))}
        </div>
      </div>

      {/* Informative notice if preview fallback is used */}
      {data?._warning && (
        <div className="bg-[#131B26] border border-[#F59E0B]/40 rounded-xl p-3.5 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="text-[#FFB95F] block font-hanken font-bold mb-0.5">
              Live Proxy Active: {data._warning}
            </strong>
            <p className="text-[#BDCAC0] leading-relaxed">
              When an account key is saved to your <code className="text-[#71DBA6]">LTA_ACCOUNT_KEY</code> environment secret, requests will fetch straight from DataMall servers. In the meantime, this simulator displays full LTA v3 telemetry with real-time arrival calculations.
            </p>
          </div>
        </div>
      )}

      {/* Services List Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#87948B] px-1">
          <span>
            Bus Stop Code: <strong className="text-[#DFE2EE] font-mono text-sm">{data?.BusStopCode || busStopCode}</strong>
            {data?._meta?.busStopName ? ` • ${data._meta.busStopName}` : ''}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJsonRaw(!showJsonRaw)}
              className="flex items-center gap-1 text-[11px] text-[#00C2CB] hover:underline"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showJsonRaw ? 'Hide JSON' : 'Inspect Raw JSON'}</span>
            </button>
          </div>
        </div>

        {/* Raw JSON viewer modal/accordion */}
        {showJsonRaw && (
          <div className="bg-[#0A0E16] border border-[#26354A] rounded-xl p-4 overflow-x-auto max-h-72">
            <pre className="text-[11px] font-mono text-[#71DBA6] leading-relaxed">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        {/* Service Cards */}
        {(!data?.Services || data.Services.length === 0) ? (
          <div className="bg-[#131B26] border border-[#26354A] rounded-xl p-8 text-center">
            <Bus className="w-10 h-10 text-[#87948B] mx-auto mb-2 opacity-50" />
            <h4 className="font-hanken font-bold text-sm text-[#DFE2EE]">
              No active bus services found for this stop
            </h4>
            <p className="text-xs text-[#87948B] mt-1">
              Check if the 5-digit bus stop code is valid or clear the ServiceNo filter.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {data.Services.map((svc) => {
              const next1 = formatArrivalCountdown(svc.NextBus?.EstimatedArrival);
              const next2 = formatArrivalCountdown(svc.NextBus2?.EstimatedArrival);
              const next3 = formatArrivalCountdown(svc.NextBus3?.EstimatedArrival);

              return (
                <div
                  key={svc.ServiceNo}
                  className="bg-[#131B26] border border-[#26354A] hover:border-[#00C2CB] rounded-xl p-4 shadow-md transition-all group"
                >
                  {/* Top Row: Service Pill, Operator, Main Countdown */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <RouteBadge code={svc.ServiceNo} mode="bus" size="lg" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-hanken font-extrabold text-base text-[#DFE2EE]">
                            Bus Service {svc.ServiceNo}
                          </h4>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1C2028] text-[#87948B] border border-[#26354A]">
                            {svc.Operator}
                          </span>
                        </div>
                        <p className="text-xs text-[#87948B] mt-0.5">
                          {getDeckTypeName(svc.NextBus?.Type)} • {svc.NextBus?.Feature === 'WAB' ? 'Wheelchair Accessible (WAB)' : 'Standard Access'}
                        </p>
                      </div>
                    </div>

                    {/* Right-aligned Next Bus Countdown */}
                    <div className="text-right">
                      {next1.isArriving ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00875a]/25 border border-[#71dba6]/50 text-[#71dba6] animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-[#71dba6] animate-ping" />
                          <span className="font-hanken font-extrabold text-xs tracking-wider uppercase">
                            ARRIVING
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1 justify-end">
                          <span className="font-inter font-black text-2xl lg:text-3xl tabular-nums text-[#DFE2EE] leading-none">
                            {next1.minutes}
                          </span>
                          <span className="text-xs font-semibold uppercase text-[#87948B]">
                            min
                          </span>
                        </div>
                      )}

                      <div className="mt-1">
                        {getLoadBadge(svc.NextBus?.Load)}
                      </div>
                    </div>
                  </div>

                  {/* Subsequent Departures (NextBus2, NextBus3) */}
                  <div className="pt-2.5 border-t border-[#1C2028] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[#87948B] text-[11px]">Subsequent:</span>

                      {/* NextBus2 */}
                      {svc.NextBus2?.EstimatedArrival && (
                        <div className="flex items-center gap-1.5 bg-[#0F131C] px-2.5 py-1 rounded-md border border-[#26354A]">
                          <span className="text-[11px] text-[#87948B]">2nd:</span>
                          <strong className="font-inter text-[#DFE2EE] tabular-nums">
                            {next2.minutes} min
                          </strong>
                          {svc.NextBus2.Load && (
                            <span className="text-[10px] text-[#87948B]">
                              ({svc.NextBus2.Load})
                            </span>
                          )}
                        </div>
                      )}

                      {/* NextBus3 */}
                      {svc.NextBus3?.EstimatedArrival && (
                        <div className="flex items-center gap-1.5 bg-[#0F131C] px-2.5 py-1 rounded-md border border-[#26354A]">
                          <span className="text-[11px] text-[#87948B]">3rd:</span>
                          <strong className="font-inter text-[#DFE2EE] tabular-nums">
                            {next3.minutes} min
                          </strong>
                          {svc.NextBus3.Load && (
                            <span className="text-[10px] text-[#87948B]">
                              ({svc.NextBus3.Load})
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {svc.NextBus?.Feature === 'WAB' && (
                        <span title="Wheelchair Accessible Bus (WAB)">
                          <Accessibility className="w-3.5 h-3.5 text-[#71DBA6]" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
