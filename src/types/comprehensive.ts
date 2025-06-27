// Comprehensive type definitions for the UAE EV Journey Planning Application

export interface VehicleSpecifications {
  id: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  
  // Battery specifications
  battery: {
    capacity: number; // kWh
    chemistry: 'LFP' | 'NCM' | 'NCA' | 'LTO';
    degradationCurve: DegradationPoint[];
    thermalManagement: 'Active' | 'Passive' | 'None';
    warrantyYears: number;
    warrantyKm: number;
  };
  
  // Charging specifications
  charging: {
    acMaxPower: number; // kW
    dcMaxPower: number; // kW
    supportedProtocols: ChargingProtocol[];
    chargingCurve: ChargingCurvePoint[];
    preconditioning: boolean;
  };
  
  // Energy consumption
  consumption: {
    city: number; // Wh/km
    highway: number; // Wh/km
    combined: number; // Wh/km
    temperatureImpact: TemperatureImpactCurve[];
  };
  
  // Physical specifications
  physical: {
    mass: number; // kg
    dragCoefficient: number;
    frontalArea: number; // m²
    length: number; // mm
    width: number; // mm
    height: number; // mm
  };
  
  // Market data
  market: {
    isAvailableInUAE: boolean;
    msrpAED: number;
    popularityRank: number;
    lastUpdated: Date;
    dataSource: 'Manufacturer' | 'Manual' | 'Verified';
  };
}

export interface DegradationPoint {
  ageYears: number;
  cycleCount: number;
  capacityRetention: number; // percentage
}

export interface ChargingProtocol {
  type: 'CCS2' | 'CHAdeMO' | 'Tesla' | 'Type2' | 'GBT' | 'Type1';
  maxPower: number; // kW
  maxVoltage: number; // V
  maxCurrent: number; // A
}

export interface ChargingCurvePoint {
  socPercentage: number;
  maxPowerKw: number;
  temperature: number; // Celsius
}

export interface TemperatureImpactCurve {
  temperature: number; // Celsius
  efficiencyMultiplier: number; // 1.0 = no impact
}

export interface ChargingStation {
  id: string;
  name: string;
  operator: string;
  network: 'DEWA' | 'ADDC' | 'SEWA' | 'Tesla' | 'ChargePoint' | 'EVgo' | 'Other';
  
  // Location data
  location: {
    latitude: number;
    longitude: number;
    address: string;
    emirate: 'Dubai' | 'Abu Dhabi' | 'Sharjah' | 'Ajman' | 'Fujairah' | 'Ras Al Khaimah' | 'Umm Al Quwain';
    landmark: string;
    accessInstructions: string;
  };
  
  // Charging infrastructure
  connectors: ChargingConnector[];
  
  // Operational data
  operational: {
    isOperational: boolean;
    operatingHours: OperatingHours;
    accessType: 'Public' | 'Semi-Public' | 'Private';
    accessRestrictions: string[];
    reservationRequired: boolean;
    advanceBookingHours: number;
  };
  
  // Pricing
  pricing: {
    costPerKwh: number; // AED
    sessionFee: number; // AED
    parkingFee: number; // AED per hour
    membershipDiscount: number; // percentage
    dynamicPricing: boolean;
    peakHours: TimeRange[];
  };
  
  // Amenities and services
  amenities: {
    restrooms: boolean;
    restaurant: boolean;
    shopping: boolean;
    wifi: boolean;
    shelter: boolean;
    security: boolean;
    disabledAccess: boolean;
    childFriendly: boolean;
    petFriendly: boolean;
    nearbyServices: string[];
  };
  
  // Real-time data
  realTime: {
    availableConnectors: number;
    totalConnectors: number;
    averageWaitTime: number; // minutes
    lastUpdated: Date;
    queueLength: number;
    estimatedAvailability: Date;
  };
  
  // User feedback
  userFeedback: {
    averageRating: number;
    totalReviews: number;
    reliabilityScore: number; // 0-100
    categories: {
      accessibility: number;
      cleanliness: number;
      safety: number;
      convenience: number;
      reliability: number;
    };
    recentIssues: StationIssue[];
  };
  
  // Metadata
  metadata: {
    dateAdded: Date;
    lastVerified: Date;
    dataSource: string;
    photos: string[];
    verificationStatus: 'Verified' | 'Pending' | 'Reported';
  };
}

export interface ChargingConnector {
  id: string;
  type: ChargingProtocol['type'];
  maxPower: number; // kW
  maxVoltage: number; // V
  maxCurrent: number; // A
  isAvailable: boolean;
  status: 'Available' | 'Occupied' | 'Out of Order' | 'Reserved';
  estimatedFreeTime: Date | null;
  lastMaintenance: Date;
  usageCount: number;
  averageSessionDuration: number; // minutes
}

export interface OperatingHours {
  monday: TimeRange[];
  tuesday: TimeRange[];
  wednesday: TimeRange[];
  thursday: TimeRange[];
  friday: TimeRange[];
  saturday: TimeRange[];
  sunday: TimeRange[];
  holidays: TimeRange[];
}

export interface TimeRange {
  start: string; // HH:MM format
  end: string; // HH:MM format
}

export interface StationIssue {
  id: string;
  type: 'Connector Fault' | 'Payment Issue' | 'Access Problem' | 'Safety Concern' | 'Other';
  description: string;
  reportedBy: string;
  reportedAt: Date;
  status: 'Open' | 'In Progress' | 'Resolved';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface RouteOptimizationRequest {
  vehicle: VehicleSpecifications;
  origin: LocationPoint;
  destination: LocationPoint;
  waypoints: LocationPoint[];
  
  // Journey parameters
  currentSoc: number; // percentage
  targetArrivalSoc: number; // percentage
  maxDetourKm: number;
  preferredChargingNetworks: string[];
  avoidTollRoads: boolean;
  
  // Optimization preferences
  optimizationGoal: 'Time' | 'Cost' | 'Comfort' | 'Reliability';
  chargingStrategy: 'Minimal' | 'Frequent' | 'Opportunistic';
  bufferRange: number; // km
  
  // Environmental conditions
  weather: WeatherConditions;
  trafficConditions: 'Current' | 'Historical' | 'Predicted';
  departureTime: Date;
}

export interface LocationPoint {
  latitude: number;
  longitude: number;
  address: string;
  name?: string;
}

export interface WeatherConditions {
  temperature: number; // Celsius
  windSpeed: number; // km/h
  windDirection: number; // degrees
  humidity: number; // percentage
  precipitation: number; // mm/h
  visibility: number; // km
  pressure: number; // hPa
  uvIndex: number;
}

export interface OptimizedRoute {
  id: string;
  summary: RouteSummary;
  segments: RouteSegment[];
  chargingStops: ChargingStop[];
  alternatives: AlternativeRoute[];
  confidence: RouteConfidence;
  lastCalculated: Date;
}

export interface RouteSummary {
  totalDistance: number; // km
  totalDrivingTime: number; // minutes
  totalChargingTime: number; // minutes
  totalJourneyTime: number; // minutes
  totalCost: number; // AED
  energyConsumption: number; // kWh
  carbonFootprint: number; // kg CO2
  arrivalSoc: number; // percentage
  reliabilityScore: number; // 0-100
}

export interface RouteSegment {
  id: string;
  startLocation: LocationPoint;
  endLocation: LocationPoint;
  distance: number; // km
  duration: number; // minutes
  energyConsumption: number; // kWh
  elevationGain: number; // meters
  elevationLoss: number; // meters
  roadType: 'Highway' | 'Urban' | 'Rural';
  trafficLevel: 'Light' | 'Moderate' | 'Heavy';
  weatherImpact: number; // efficiency multiplier
  geometry: number[][]; // [longitude, latitude] pairs
}

export interface ChargingStop {
  station: ChargingStation;
  arrivalSoc: number; // percentage
  departureSoc: number; // percentage
  chargingTime: number; // minutes
  energyAdded: number; // kWh
  cost: number; // AED
  waitTime: number; // minutes
  connector: ChargingConnector;
  reservationId?: string;
  alternatives: ChargingStation[];
}

export interface AlternativeRoute {
  id: string;
  summary: RouteSummary;
  differenceFromMain: {
    timeDifference: number; // minutes
    costDifference: number; // AED
    distanceDifference: number; // km
  };
  advantages: string[];
  disadvantages: string[];
}

export interface RouteConfidence {
  overall: number; // 0-100
  factors: {
    weatherAccuracy: number;
    trafficPrediction: number;
    chargingAvailability: number;
    energyConsumption: number;
    timingAccuracy: number;
  };
  lastUpdated: Date;
}

export interface UserProfile {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    preferredLanguage: 'en' | 'ar';
    emiratesId?: string;
  };
  
  vehicles: VehicleSpecifications[];
  defaultVehicle: string; // vehicle ID
  
  preferences: {
    chargingNetworks: string[];
    maxDetourKm: number;
    bufferRange: number;
    optimizationGoal: RouteOptimizationRequest['optimizationGoal'];
    chargingStrategy: RouteOptimizationRequest['chargingStrategy'];
    notifications: NotificationPreferences;
  };
  
  paymentMethods: PaymentMethod[];
  
  journeyHistory: JourneyRecord[];
  favoriteLocations: LocationPoint[];
  
  subscription: {
    type: 'Free' | 'Premium' | 'Enterprise';
    expiryDate: Date;
    features: string[];
  };
}

export interface NotificationPreferences {
  chargingComplete: boolean;
  lowBattery: boolean;
  routeUpdates: boolean;
  stationAvailability: boolean;
  promotions: boolean;
  maintenance: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'Credit Card' | 'Debit Card' | 'Digital Wallet' | 'Bank Transfer';
  provider: string;
  lastFourDigits: string;
  expiryDate: string;
  isDefault: boolean;
}

export interface JourneyRecord {
  id: string;
  date: Date;
  route: OptimizedRoute;
  actualPerformance: {
    actualDrivingTime: number;
    actualChargingTime: number;
    actualEnergyConsumption: number;
    actualCost: number;
    deviations: string[];
  };
  userRating: number;
  feedback: string;
}

export interface SystemMetrics {
  performance: {
    averageResponseTime: number; // ms
    uptime: number; // percentage
    routeAccuracy: number; // percentage
    userSatisfaction: number; // 1-5 scale
  };
  
  usage: {
    activeUsers: number;
    routesCalculated: number;
    chargingSessionsBooked: number;
    dataPoints: number;
  };
  
  dataQuality: {
    stationDataAccuracy: number; // percentage
    vehicleDataCompleteness: number; // percentage
    lastVerificationDate: Date;
  };
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    timestamp: Date;
    requestId: string;
    processingTime: number; // ms
    version: string;
  };
}

export interface RealTimeUpdate {
  type: 'Station Status' | 'Traffic' | 'Weather' | 'Route Change';
  stationId?: string;
  routeId?: string;
  data: any;
  timestamp: Date;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}