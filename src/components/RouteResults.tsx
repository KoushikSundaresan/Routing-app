import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SimplifiedRoutePlan } from '@/types/ev';
import { 
  Navigation, 
  Clock, 
  Battery, 
  Zap, 
  MapPin, 
  Thermometer,
  Wind,
  TrendingUp
} from 'lucide-react';
import { calculateChargingTime } from '@/utils/charging';

interface RouteResultsProps {
  routePlan: SimplifiedRoutePlan;
  onStartNavigation?: () => void;
}

const RouteResults: React.FC<RouteResultsProps> = ({ routePlan, onStartNavigation }) => {
  if (!routePlan) return null;

  // Demo: estimate charging time for a single stop (if any)
  let chargingTime = 0;
  if (routePlan.chargingStops > 0) {
    // Assume charging from 20% to 80% at max vehicle charging speed
    const initialSOC = Math.max(routePlan.finalSOC, 20);
    const targetSOC = 80;
    const chargingPower = routePlan.vehicle.maxChargingSpeed;
    chargingTime = calculateChargingTime({
      batteryCapacity: routePlan.vehicle.batteryCapacity,
      initialSOC,
      targetSOC,
      chargingPower
    });
  }

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Route Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary" />
            Route Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Distance:</span>
                <span className="font-medium">{routePlan.totalDistance} km</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{Math.floor(routePlan.totalDuration / 60)}h {routePlan.totalDuration % 60}m</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Energy Used:</span>
                <span className="font-medium">{routePlan.totalEnergyUsed} kWh</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Battery className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Final SOC:</span>
                <span className="font-medium">{routePlan.finalSOC}%</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Charging Stops Required</p>
              <p className="text-xs text-muted-foreground">
                {routePlan.chargingStops} stop{routePlan.chargingStops !== 1 ? 's' : ''} recommended
                {routePlan.chargingStops > 0 && (
                  <> &middot; Est. Charging Time: <span className="font-semibold">{Math.round(chargingTime)} min</span></>
                )}
              </p>
            </div>
            <Badge variant="secondary" className="text-lg font-mono">
              {routePlan.chargingStops}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Energy Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Energy Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Starting SOC</span>
                <span className="text-sm font-medium">{routePlan.initialSOC}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-electric-blue to-electric-green h-2 rounded-full"
                  style={{ width: `${routePlan.initialSOC}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Arrival SOC</span>
                <span className="text-sm font-medium">{routePlan.finalSOC}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    routePlan.finalSOC > 20 
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green' 
                      : 'bg-gradient-to-r from-yellow-500 to-red-500'
                  }`}
                  style={{ width: `${routePlan.finalSOC}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Efficiency</p>
              <p className="font-medium text-sm">{routePlan.vehicle.efficiency} Wh/km</p>
            </div>
            <div className="p-2 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Consumption</p>
              <p className="font-medium text-sm">{(routePlan.totalEnergyUsed / routePlan.totalDistance * 100).toFixed(1)} kWh/100km</p>
            </div>
            <div className="p-2 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Weather Impact</p>
              <p className="font-medium text-sm">-2%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-primary" />
            Weather Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <span className="text-sm">28°C</span>
              <Badge variant="outline" className="text-xs">Optimal</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-blue-400" />
              <span className="text-sm">12 km/h</span>
              <Badge variant="outline" className="text-xs">Headwind</Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Current weather conditions will reduce efficiency by approximately 2%
          </p>
        </CardContent>
      </Card>

      {/* Start Navigation Button */}
      <Button 
        onClick={onStartNavigation}
        className="w-full gradient-electric"
        size="lg"
      >
        <Navigation className="w-4 h-4 mr-2" />
        Start Navigation
      </Button>
    </div>
  );
};

export default RouteResults;
