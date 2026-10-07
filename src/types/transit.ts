export type TransitMode = 'metro' | 'bus' | 'tram' | 'express' | 'night';

export type CrowdLevel = 1 | 2 | 3; // 1 = Low (Green), 2 = Moderate (Amber), 3 = Crowded (Red)

export type ServiceStatus = 'good' | 'minor-delay' | 'disrupted' | 'maintenance';

export interface RouteBadgeStyle {
  bg: string;
  fg: string;
  border?: string;
}

export interface TransitLine {
  id: string;
  code: string;
  name: string;
  mode: TransitMode;
  color: string;
  textColor: string;
  status: ServiceStatus;
  statusMessage: string;
  stations: string[]; // station IDs
  headwaysMinutes: number;
}

export interface Departure {
  id: string;
  lineId: string;
  routeCode: string;
  mode: TransitMode;
  destination: string;
  direction: string;
  via?: string;
  platform: string;
  secondsUntilArrival: number;
  delayMinutes: number;
  crowdLevel: CrowdLevel;
  isAccessible: boolean;
  hasBicycleRack?: boolean;
  upcomingDeltas: number[]; // e.g. [7, 16, 25] minutes
  vehicleId?: string;
}

export interface Station {
  id: string;
  name: string;
  code: string;
  district: string;
  x: number; // SVG map coord 0 - 1000
  y: number; // SVG map coord 0 - 800
  lines: string[]; // Line codes e.g. ['M1', 'M2', 'T3']
  isInterchange: boolean;
  accessibility: boolean;
  platforms: string[];
  facilities: string[];
  latitude: number;
  longitude: number;
}

export interface LiveVehicle {
  id: string;
  lineId: string;
  routeCode: string;
  mode: TransitMode;
  currentStationId: string;
  nextStationId: string;
  progressPercent: number; // 0 to 100 between current and next station
  speedKmH: number;
  occupancyPercent: number;
  crowdLevel: CrowdLevel;
  destination: string;
  x: number; // interpolated map pos
  y: number;
}

export interface TripStep {
  id: string;
  instruction: string;
  mode: TransitMode | 'walk';
  routeCode?: string;
  lineColor?: string;
  fromStation: string;
  toStation: string;
  departureTimeFormatted: string;
  durationMinutes: number;
  platform?: string;
  stopsCount?: number;
  stopsList?: string[];
  crowdLevel?: CrowdLevel;
  tip?: string;
}

export interface TripItinerary {
  id: string;
  originStation: Station;
  destinationStation: Station;
  totalDurationMinutes: number;
  walkingMinutes: number;
  transfersCount: number;
  departureTime: string;
  arrivalTime: string;
  fareUSD: number;
  tag?: 'Fastest' | 'Fewer Transfers' | 'Least Walking' | 'Recommended';
  steps: TripStep[];
}

export interface ServiceAlert {
  id: string;
  lineId: string;
  lineCode: string;
  severity: 'urgent' | 'warning' | 'info';
  headline: string;
  description: string;
  affectedSegment: string;
  updatedAt: string;
}
