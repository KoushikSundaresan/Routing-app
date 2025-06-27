import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RouteOptimizationRequest, 
  OptimizedRoute, 
  VehicleSpecifications,
  LocationPoint 
} from '@/types/comprehensive';
import { routeOptimizationService } from '@/services/RouteOptimizationService';
import { 
  Navigation, 
  MapPin, 
  Battery, 
  Clock, 
  DollarSign, 
  Zap,
  Route,
  Settings,
  Plus,
  X
} from 'lucide-react';

interface RouteOptimizerProps {
  vehicle?: VehicleSpecifications;
  onRouteCalculated: (route: OptimizedRoute) => void;
}

const RouteOptimizer: React.FC<RouteOptimizerProps> = ({
  vehicle,
  onRouteCalculated
}) => {
  const [origin, setOrigin] = useState<LocationPoint | null>(null);
  const [destination, setDestination] = useState<LocationPoint | null>(null);
  const [waypoints, setWaypoints] = useState<LocationPoint[]>([]);
  const [currentSoc, setCurrentSoc] = useState([75]);
  const [targetArrivalSoc, setTargetArrivalSoc] = useState([20]);
  const [maxDetourKm, setMaxDetourKm] = useState([25]);
  const [bufferRange, setBufferRange] = useState([30]);
  const [optimizationGoal, setOptimizationGoal] = useState<'Time' | 'Cost' | 'Comfort' | 'Reliability'>('Time');
  const [chargingStrategy, setChargingStrategy] = useState<'Minimal' | 'Frequent' | 'Opportunistic'>('Minimal');
  const [preferredNetworks, setPreferredNetworks] = useState<string[]>([]);
  const [avoidTollRoads, setAvoidTollRoads] = useState(false);
  const [departureTime, setDepartureTime] = useState(new Date());
  const [calculating, setCalculating] = useState(false);
  const [route, setRoute] = useState<OptimizedRoute | null>(null);

  const handleCalculateRoute = async () => {
    if (!vehicle || !origin || !destination) return;

    setCalculating(true);
    try {
      const request: RouteOptimizationRequest = {
        vehicle,
        origin,
        destination,
        waypoints,
        currentSoc: currentSoc[0],
        targetArrivalSoc: targetArrivalSoc[0],
        maxDetourKm: maxDetourKm[0],
        preferredChargingNetworks: preferredNetworks,
        avoidTollRoads,
        optimizationGoal,
        chargingStrategy,
        bufferRange: bufferRange[0],
        weather: {
          temperature: 28,
          windSpeed: 12,
          windDirection: 180,
          humidity: 65,
          precipitation: 0,
          visibility: 10,
          pressure: 1013,
          uvIndex: 6
        },
        trafficConditions: 'Current',
        departureTime
      };

      const response = await routeOptimizationService.calculateOptimizedRoute(request);
      if (response.success && response.data) {
        setRoute(response.data);
        onRouteCalculated(response.data);
      }
    } catch (error) {
      console.error('Route calculation failed:', error);
    } finally {
      setCalculating(false);
    }
  };

  const addWaypoint = () => {
    setWaypoints([...waypoints, { latitude: 0, longitude: 0, address: '', name: '' }]);
  };

  const removeWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const updateWaypoint = (index: number, waypoint: LocationPoint) => {
    const updated = [...waypoints];
    updated[index] = waypoint;
    setWaypoints(updated);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Route Planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {/* Origin */}
              <div>
                <label className="text-sm font-medium mb-2 block">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter starting location"
                    className="pl-10"
                    value={origin?.address || ''}
                    onChange={(e) => setOrigin(origin ? {...origin, address: e.target.value} : null)}
                  />
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="text-sm font-medium mb-2 block">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter destination"
                    className="pl-10"
                    value={destination?.address || ''}
                    onChange={(e) => setDestination(destination ? {...destination, address: e.target.value} : null)}
                  />
                </div>
              </div>

              {/* Waypoints */}
              {waypoints.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Waypoints</label>
                  {waypoints.map((waypoint, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder={`Waypoint ${index + 1}`}
                          className="pl-10"
                          value={waypoint.address}
                          onChange={(e) => updateWaypoint(index, {...waypoint, address: e.target.value})}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeWaypoint(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                onClick={addWaypoint}
                className="w-full flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Waypoint
              </Button>

              {/* Current SOC */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Current Battery Level</label>
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-primary" />
                    <span className="text-sm font-mono">{currentSoc[0]}%</span>
                  </div>
                </div>
                <Slider
                  value={currentSoc}
                  onValueChange={setCurrentSoc}
                  max={100}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Target Arrival SOC */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Target Arrival Level</label>
                  <span className="text-sm font-mono">{targetArrivalSoc[0]}%</span>
                </div>
                <Slider
                  value={targetArrivalSoc}
                  onValueChange={setTargetArrivalSoc}
                  max={80}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              {/* Optimization Goal */}
              <div>
                <label className="text-sm font-medium mb-2 block">Optimization Goal</label>
                <Select value={optimizationGoal} onValueChange={(value: any) => setOptimizationGoal(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Time">Fastest Route</SelectItem>
                    <SelectItem value="Cost">Lowest Cost</SelectItem>
                    <SelectItem value="Comfort">Most Comfortable</SelectItem>
                    <SelectItem value="Reliability">Most Reliable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Charging Strategy */}
              <div>
                <label className="text-sm font-medium mb-2 block">Charging Strategy</label>
                <Select value={chargingStrategy} onValueChange={(value: any) => setChargingStrategy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Minimal">Minimal Stops</SelectItem>
                    <SelectItem value="Frequent">Frequent Short Stops</SelectItem>
                    <SelectItem value="Opportunistic">Opportunistic Charging</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Max Detour */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Max Detour</label>
                  <span className="text-sm font-mono">{maxDetourKm[0]} km</span>
                </div>
                <Slider
                  value={maxDetourKm}
                  onValueChange={setMaxDetourKm}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Buffer Range */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Safety Buffer</label>
                  <span className="text-sm font-mono">{bufferRange[0]} km</span>
                </div>
                <Slider
                  value={bufferRange}
                  onValueChange={setBufferRange}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Departure Time */}
              <div>
                <label className="text-sm font-medium mb-2 block">Departure Time</label>
                <Input
                  type="datetime-local"
                  value={departureTime.toISOString().slice(0, 16)}
                  onChange={(e) => setDepartureTime(new Date(e.target.value))}
                />
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              {/* Preferred Networks */}
              <div>
                <label className="text-sm font-medium mb-2 block">Preferred Charging Networks</label>
                <div className="flex flex-wrap gap-2">
                  {['DEWA', 'ADDC', 'Tesla', 'ChargePoint', 'EVgo'].map((network) => (
                    <Badge
                      key={network}
                      variant={preferredNetworks.includes(network) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (preferredNetworks.includes(network)) {
                          setPreferredNetworks(preferredNetworks.filter(n => n !== network));
                        } else {
                          setPreferredNetworks([...preferredNetworks, network]);
                        }
                      }}
                    >
                      {network}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Avoid Toll Roads */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Avoid Toll Roads</label>
                <Button
                  variant={avoidTollRoads ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAvoidTollRoads(!avoidTollRoads)}
                >
                  {avoidTollRoads ? 'Yes' : 'No'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <Button
            onClick={handleCalculateRoute}
            disabled={!vehicle || !origin || !destination || calculating}
            className="w-full mt-6"
            size="lg"
          >
            {calculating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Calculating Route...
              </>
            ) : (
              <>
                <Route className="w-4 h-4 mr-2" />
                Calculate Optimal Route
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Route Summary */}
      {route && (
        <Card>
          <CardHeader>
            <CardTitle>Route Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="w-4 h-4 text-muted-foreground mr-1" />
                </div>
                <div className="text-2xl font-bold">{formatTime(route.summary.totalJourneyTime)}</div>
                <div className="text-sm text-muted-foreground">Total Time</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Navigation className="w-4 h-4 text-muted-foreground mr-1" />
                </div>
                <div className="text-2xl font-bold">{route.summary.totalDistance} km</div>
                <div className="text-sm text-muted-foreground">Distance</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Zap className="w-4 h-4 text-muted-foreground mr-1" />
                </div>
                <div className="text-2xl font-bold">{route.chargingStops.length}</div>
                <div className="text-sm text-muted-foreground">Charging Stops</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <DollarSign className="w-4 h-4 text-muted-foreground mr-1" />
                </div>
                <div className="text-2xl font-bold">{formatCurrency(route.summary.totalCost)}</div>
                <div className="text-sm text-muted-foreground">Total Cost</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Driving Time:</span>
                <span>{formatTime(route.summary.totalDrivingTime)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Charging Time:</span>
                <span>{formatTime(route.summary.totalChargingTime)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Energy Consumption:</span>
                <span>{route.summary.energyConsumption.toFixed(1)} kWh</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Arrival SOC:</span>
                <span>{route.summary.arrivalSoc}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Reliability Score:</span>
                <span>{route.summary.reliabilityScore}/100</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RouteOptimizer;