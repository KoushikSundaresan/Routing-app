export interface ChargingPort {
  type: 'CCS2' | 'CHAdeMO' | 'Tesla' | 'Type2' | 'GBT';
  maxPower: number; // kW
  voltage: number; // V
}

export interface EVModel {
  id: string;
  make: string;
  model: string;
  year: number;
  batteryCapacity: number; // kWh
  efficiency: number; // Wh/km
  mass: number; // kg
  dragCoefficient: number;
  frontalArea: number; // m²
  chargingPorts: ChargingPort[];
  maxChargingSpeed: number; // kW
  maxVoltage: number; // V
  imageUrl?: string;
  isPopularInUAE: boolean;
}

export interface ChargingStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  network: 'DEWA' | 'ADDC' | 'SEWA' | 'Tesla' | 'Other';
  connectorTypes: ChargingPort['type'][];
  maxPower: number;
  isAvailable: boolean;
  numberOfPorts: number;
  costPerKwh?: number;
  amenities: string[];
}

export interface RouteSegment {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  distance: number; // km
  duration: number; // minutes
  elevationGain: number; // meters
  energyRequired: number; // kWh
}

export interface RoutePlan {
  id: string;
  origin: { lat: number; lng: number; address: string };
  destination: { lat: number; lng: number; address: string };
  vehicle: EVModel;
  initialSOC: number; // percentage
  segments: RouteSegment[];
  chargingStops: {
    station: ChargingStation;
    arrivalSOC: number;
    departureSOC: number;
    chargingTime: number; // minutes
    energyAdded: number; // kWh
  }[];
  totalDistance: number; // km
  /**
   * totalDuration now includes both driving and charging time (in minutes).
   * totalDuration = sum of segment durations + sum of charging times
   */
  totalDuration: number; // minutes (driving + charging)
  totalEnergyUsed: number; // kWh
  finalSOC: number; // percentage
  weatherImpact: number; // percentage efficiency loss/gain
}

export interface WeatherData {
  temperature: number; // Celsius
  windSpeed: number; // km/h
  windDirection: number; // degrees
  humidity: number; // percentage
  condition: string;
  icon: string;
}

export interface SimplifiedRoutePlan {
  origin: { address: string; lat: number; lng: number };
  destination: { address: string; lat: number; lng: number };
  vehicle: EVModel;
  initialSOC: number;
  totalDistance: number;
  totalDuration: number;
  chargingStops: number;
  finalSOC: number;
  totalEnergyUsed: number;
}

export interface GeocodingResult {
  display_name: string;
  lat: number;
  lon: number;
}

/**
 * Utility type for charging time calculation.
 * chargingTimeMinutes = (batteryCapacity * (targetSOC - initialSOC) / 100) / chargingPower * 60
 */
export type ChargingTimeParams = {
  batteryCapacity: number; // kWh
  initialSOC: number; // %
  targetSOC: number; // %
  chargingPower: number; // kW
};

/**
 * Calculate charging time in minutes.
 * @param params ChargingTimeParams
 * @returns charging time in minutes
 */
export function calculateChargingTimeMinutes(params: ChargingTimeParams): number {
  const { batteryCapacity, initialSOC, targetSOC, chargingPower } = params;
  if (chargingPower <= 0 || targetSOC <= initialSOC) return 0;
  const energyToAdd = batteryCapacity * (targetSOC - initialSOC) / 100;
  return (energyToAdd / chargingPower) * 60;
}

/**
 * API response for fetching public working charging stations.
 */
export interface PublicChargingStationsRequest {
  lat: number;
  lng: number;
  radiusKm: number;
  connectorTypes?: ChargingPort['type'][];
}

export interface PublicChargingStationsResponse {
  stations: ChargingStation[];
}
