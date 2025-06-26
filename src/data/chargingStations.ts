
import { ChargingStation } from '@/types/ev';

export const mockChargingStations: ChargingStation[] = [
  {
    id: 'dewa-mall-emirates',
    name: 'Mall of the Emirates - DEWA Green Charger',
    lat: 25.1172,
    lng: 55.2001,
    address: 'Mall of the Emirates, Sheikh Zayed Road, Dubai',
    network: 'DEWA',
    connectorTypes: ['CCS2', 'CHAdeMO'],
    maxPower: 150,
    isAvailable: true,
    numberOfPorts: 4,
    costPerKwh: 0.29,
    amenities: ['Shopping Mall', 'Restaurants', 'Cinema', 'Free WiFi']
  },
  {
    id: 'dewa-downtown-dubai',
    name: 'Downtown Dubai - DEWA Station',
    lat: 25.1972,
    lng: 55.2744,
    address: 'Downtown Dubai, Mohammed Bin Rashid Boulevard',
    network: 'DEWA',
    connectorTypes: ['CCS2', 'Type2'],
    maxPower: 120,
    isAvailable: true,
    numberOfPorts: 6,
    costPerKwh: 0.29,
    amenities: ['Dubai Mall nearby', 'Burj Khalifa view', 'Metro station']
  },
  {
    id: 'tesla-supercharger-jbr',
    name: 'Tesla Supercharger - JBR',
    lat: 25.0657,
    lng: 55.1398,
    address: 'Jumeirah Beach Residence, Dubai',
    network: 'Tesla',
    connectorTypes: ['Tesla', 'CCS2'],
    maxPower: 250,
    isAvailable: false,
    numberOfPorts: 8,
    costPerKwh: 0.35,
    amenities: ['Beach access', 'Restaurants', 'Parking']
  },
  {
    id: 'addc-yas-island',
    name: 'Yas Island Mall - ADDC',
    lat: 24.4888,
    lng: 54.6094,
    address: 'Yas Island, Abu Dhabi',
    network: 'ADDC',
    connectorTypes: ['CCS2', 'CHAdeMO', 'Type2'],
    maxPower: 180,
    isAvailable: true,
    numberOfPorts: 10,
    costPerKwh: 0.27,
    amenities: ['Theme parks nearby', 'Shopping', 'Hotels', 'F1 Circuit']
  },
  {
    id: 'dewa-business-bay',
    name: 'Business Bay Metro - DEWA',
    lat: 25.1868,
    lng: 55.2650,
    address: 'Business Bay Metro Station, Dubai',
    network: 'DEWA',
    connectorTypes: ['CCS2', 'Type2'],
    maxPower: 100,
    isAvailable: true,
    numberOfPorts: 4,
    costPerKwh: 0.29,
    amenities: ['Metro station', 'Business district', 'Restaurants']
  }
];

export const getChargingStationsByNetwork = (network: ChargingStation['network']): ChargingStation[] => {
  return mockChargingStations.filter(station => station.network === network);
};

export const getAvailableChargingStations = (): ChargingStation[] => {
  return mockChargingStations.filter(station => station.isAvailable);
};
