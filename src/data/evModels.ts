
import { EVModel } from '@/types/ev';

export const uaeEVModels: EVModel[] = [
  {
    id: 'tesla-model-3',
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    batteryCapacity: 75,
    efficiency: 150, // Wh/km
    mass: 1830,
    dragCoefficient: 0.23,
    frontalArea: 2.28,
    chargingPorts: [
      { type: 'Tesla', maxPower: 250, voltage: 400 },
      { type: 'CCS2', maxPower: 170, voltage: 400 }
    ],
    maxChargingSpeed: 250,
    maxVoltage: 400,
    isPopularInUAE: true
  },
  {
    id: 'bmw-i4',
    make: 'BMW',
    model: 'i4 M50',
    year: 2024,
    batteryCapacity: 83.9,
    efficiency: 180,
    mass: 2215,
    dragCoefficient: 0.24,
    frontalArea: 2.37,
    chargingPorts: [
      { type: 'CCS2', maxPower: 205, voltage: 400 }
    ],
    maxChargingSpeed: 205,
    maxVoltage: 400,
    isPopularInUAE: true
  },
  {
    id: 'mercedes-eqs',
    make: 'Mercedes',
    model: 'EQS 450+',
    year: 2024,
    batteryCapacity: 107.8,
    efficiency: 160,
    mass: 2585,
    dragCoefficient: 0.20,
    frontalArea: 2.51,
    chargingPorts: [
      { type: 'CCS2', maxPower: 200, voltage: 400 }
    ],
    maxChargingSpeed: 200,
    maxVoltage: 400,
    isPopularInUAE: true
  },
  {
    id: 'hyundai-ioniq5',
    make: 'Hyundai',
    model: 'IONIQ 5',
    year: 2024,
    batteryCapacity: 77.4,
    efficiency: 170,
    mass: 2268,
    dragCoefficient: 0.29,
    frontalArea: 2.68,
    chargingPorts: [
      { type: 'CCS2', maxPower: 235, voltage: 800 }
    ],
    maxChargingSpeed: 235,
    maxVoltage: 800,
    isPopularInUAE: true
  },
  {
    id: 'genesis-gv60',
    make: 'Genesis',
    model: 'GV60',
    year: 2024,
    batteryCapacity: 77.4,
    efficiency: 185,
    mass: 2205,
    dragCoefficient: 0.28,
    frontalArea: 2.72,
    chargingPorts: [
      { type: 'CCS2', maxPower: 235, voltage: 800 }
    ],
    maxChargingSpeed: 235,
    maxVoltage: 800,
    isPopularInUAE: false
  },
  {
    id: 'audi-etron-gt',
    make: 'Audi',
    model: 'e-tron GT',
    year: 2024,
    batteryCapacity: 93.4,
    efficiency: 190,
    mass: 2340,
    dragCoefficient: 0.24,
    frontalArea: 2.35,
    chargingPorts: [
      { type: 'CCS2', maxPower: 270, voltage: 800 }
    ],
    maxChargingSpeed: 270,
    maxVoltage: 800,
    isPopularInUAE: true
  }
];

export const getEVModelById = (id: string): EVModel | undefined => {
  return uaeEVModels.find(model => model.id === id);
};

export const getPopularEVModels = (): EVModel[] => {
  return uaeEVModels.filter(model => model.isPopularInUAE);
};
