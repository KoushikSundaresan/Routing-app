
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FreeMap from '@/components/FreeMap';
import EVSelector from '@/components/EVSelector';
import RoutePlanner from '@/components/RoutePlanner';
import RouteResults from '@/components/RouteResults';
import ApiKeyConfig from '@/components/ApiKeyConfig';
import { EVModel, ChargingStation, SimplifiedRoutePlan } from '@/types/ev';
import { mockChargingStations } from '@/data/chargingStations';
import { useToast } from '@/hooks/use-toast';
import { Zap, MapPin } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState<EVModel | undefined>();
  const [selectedStation, setSelectedStation] = useState<ChargingStation | undefined>();
  const [routePlan, setRoutePlan] = useState<SimplifiedRoutePlan | null>(null);

  const handleStationSelect = (station: ChargingStation) => {
    setSelectedStation(station);
  };

  const handlePlanRoute = (plan: SimplifiedRoutePlan) => {
    setRoutePlan(plan);
  };

  const handleStartNavigation = () => {
    if (!routePlan) return;
    
    try {
      // Create Google Maps URL with waypoints for charging stops
      const origin = `${routePlan.origin.lat},${routePlan.origin.lng}`;
      const destination = `${routePlan.destination.lat},${routePlan.destination.lng}`;
      
      // Find optimal charging stops based on route and vehicle needs
      const optimalChargingStops = findOptimalChargingStops(routePlan);
      
      let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(routePlan.origin.address)}&destination=${encodeURIComponent(routePlan.destination.address)}&travelmode=driving`;
      
      // Add charging stops as waypoints
      if (optimalChargingStops.length > 0) {
        const waypoints = optimalChargingStops.map(stop => `${stop.lat},${stop.lng}`).join('|');
        mapsUrl += `&waypoints=${waypoints}`;
      }
      
      // Show success toast
      toast({
        title: "Navigation Started! 🗺️",
        description: `Opening Google Maps with ${optimalChargingStops.length} charging stop${optimalChargingStops.length !== 1 ? 's' : ''}`,
        duration: 3000,
      });
      
      // Open Google Maps in a new tab
      window.open(mapsUrl, '_blank');
      
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Navigation Error",
        description: "Could not open Google Maps. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  // Helper function to find optimal charging stops
  const findOptimalChargingStops = (plan: SimplifiedRoutePlan): ChargingStation[] => {
    const stops: ChargingStation[] = [];
    
    // If route requires charging stops, find the best available stations
    if (plan.chargingStops > 0) {
      // Filter available stations that are compatible with the vehicle
      const compatibleStations = mockChargingStations.filter(station => {
        const isAvailable = station.isAvailable;
        const hasCompatibleConnector = station.connectorTypes.some(type => 
          plan.vehicle.chargingPorts.some(port => port.type === type)
        );
        return isAvailable && hasCompatibleConnector;
      });
      
      // For demo: select up to 2 best stations (highest power, preferably DEWA/Tesla)
      const bestStations = compatibleStations
        .sort((a, b) => {
          // Prioritize Tesla Superchargers and DEWA stations
          const aPriority = (a.network === 'Tesla' || a.network === 'DEWA') ? 1 : 0;
          const bPriority = (b.network === 'Tesla' || b.network === 'DEWA') ? 1 : 0;
          if (aPriority !== bPriority) return bPriority - aPriority;
          // Then by max power
          return b.maxPower - a.maxPower;
        })
        .slice(0, Math.min(plan.chargingStops, 2));
      
      stops.push(...bestStations);
    }
    
    return stops;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Plusfind
                </h1>
                <p className="text-sm text-muted-foreground">UAE EV Route Planner</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                100% Free APIs
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                Beta
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Left Panel - Controls */}
          <div className="space-y-6 overflow-y-auto max-h-full">
            <ApiKeyConfig />
            
            <EVSelector
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
            />

            <RoutePlanner
              selectedModel={selectedModel}
              onPlanRoute={handlePlanRoute}
            />

            {routePlan && (
              <RouteResults
                routePlan={routePlan}
                onStartNavigation={handleStartNavigation}
              />
            )}
          </div>

          {/* Center Panel - Map */}
          <div className="lg:col-span-2">
            <FreeMap
              onStationSelect={handleStationSelect}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Selected Station Info */}
        {selectedStation && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-md px-4 lg:px-0">
            <Card className="bg-black/80 backdrop-blur-sm border-border/50 animate-slide-up">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white">
                  <MapPin className="w-5 h-5 text-primary" />
                  {selectedStation.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-white/70">{selectedStation.address}</p>
                
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={selectedStation.isAvailable ? "default" : "destructive"}
                    className={selectedStation.isAvailable ? "bg-green-500" : ""}
                  >
                    {selectedStation.isAvailable ? 'Available' : 'Occupied'}
                  </Badge>
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    {selectedStation.network}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/50">Max Power</p>
                    <p className="text-white font-medium">{selectedStation.maxPower} kW</p>
                  </div>
                  <div>
                    <p className="text-white/50">Ports Available</p>
                    <p className="text-white font-medium">{selectedStation.numberOfPorts}</p>
                  </div>
                </div>

                {selectedStation.amenities.length > 0 && (
                  <div>
                    <p className="text-white/50 text-sm mb-1">Amenities</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedStation.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
