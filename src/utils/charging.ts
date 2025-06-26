import { ChargingTimeParams } from '@/types/ev';

/**
 * Calculate charging time in minutes.
 * @param params ChargingTimeParams
 * @returns number (minutes)
 */
export function calculateChargingTime({
  batteryCapacity,
  initialSOC,
  targetSOC,
  chargingPower
}: ChargingTimeParams): number {
  if (chargingPower <= 0 || targetSOC <= initialSOC) return 0;
  const energyToAdd = batteryCapacity * (targetSOC - initialSOC) / 100; // kWh
  return (energyToAdd / chargingPower) * 60; // minutes
}
