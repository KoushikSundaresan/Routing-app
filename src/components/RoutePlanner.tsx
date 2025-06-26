
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EVModel, SimplifiedRoutePlan } from '@/types/ev';
import { Navigation, Battery, Clock, Zap, MapPin } from 'lucide-react';

interface RoutePlannerProps {
  selectedModel?: EVModel;
  onPlanRoute: (routeData: SimplifiedRoutePlan) => void;
}

const RoutePlanner: React.FC<RoutePlannerProps> = ({ selectedModel, onPlanRoute }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [currentSOC, setCurrentSOC] = useState([75]);
  const [isPlanning, setIsPlanning] = useState(false);

  const handlePlanRoute = async () => {
    if (!selectedModel || !origin || !destination) return;

    setIsPlanning(true);
    
    // Simulate route planning
    setTimeout(() => {
      const mockRoutePlan: SimplifiedRoutePlan = {
        origin: { address: origin, lat: 25.2048, lng: 55.2708 },
        destination: { address: destination, lat: 24.4539, lng: 54.3773 },
        vehicle: selectedModel,
        initialSOC: currentSOC[0],
        totalDistance: 145,
        totalDuration: 95,
        chargingStops: 1,
        finalSOC: 45,
        totalEnergyUsed: 24.5
      };
      
      onPlanRoute(mockRoutePlan);
      setIsPlanning(false);
    }, 2000);
  };

  const maxRange = selectedModel 
    ? Math.round((selectedModel.batteryCapacity * 1000 * (currentSOC[0] / 100)) / selectedModel.efficiency)
    : 0;

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" />
          Plan Your Route
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter starting location"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Current State of Charge</label>
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono">{currentSOC[0]}%</span>
            </div>
          </div>
          
          <div className="px-1">
            <Slider
              value={currentSOC}
              onValueChange={setCurrentSOC}
              max={100}
              min={5}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>5%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {selectedModel && (
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Range:</span>
                <span className="font-medium text-primary">{maxRange} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Energy:</span>
                <span className="font-medium">
                  {((selectedModel.batteryCapacity * currentSOC[0]) / 100).toFixed(1)} kWh
                </span>
              </div>
            </div>
          )}
        </div>

        <Button 
          onClick={handlePlanRoute}
          disabled={!selectedModel || !origin || !destination || isPlanning}
          className="w-full gradient-electric"
          size="lg"
        >
          {isPlanning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Planning Route...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Plan Optimal Route
            </>
          )}
        </Button>

        {!selectedModel && (
          <p className="text-xs text-muted-foreground text-center">
            Please select an EV model first to plan your route
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RoutePlanner;
