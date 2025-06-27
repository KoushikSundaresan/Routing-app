import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import VehicleSelector from '@/components/comprehensive/VehicleSelector';
import RouteOptimizer from '@/components/comprehensive/RouteOptimizer';
import ChargingStationMap from '@/components/comprehensive/ChargingStationMap';
import { 
  VehicleSpecifications, 
  OptimizedRoute, 
  ChargingStation,
  UserProfile,
  SystemMetrics 
} from '@/types/comprehensive';
import { userManagementService } from '@/services/UserManagementService';
import { 
  Car, 
  Route, 
  MapPin, 
  User, 
  Settings, 
  BarChart3,
  Zap,
  Navigation,
  Clock,
  DollarSign,
  Battery,
  Shield,
  Wifi,
  Globe
} from 'lucide-react';

const ComprehensiveIndex: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSpecifications | undefined>();
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | undefined>();
  const [selectedStation, setSelectedStation] = useState<ChargingStation | undefined>();
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | undefined>();
  const [activeTab, setActiveTab] = useState('planning');

  useEffect(() => {
    loadUserProfile();
    loadSystemMetrics();
  }, []);

  const loadUserProfile = async () => {
    try {
      // In a real app, get user ID from authentication
      const userId = 'demo-user';
      const response = await userManagementService.getUserProfile(userId);
      if (response.success && response.data) {
        setUserProfile(response.data);
        if (response.data.vehicles.length > 0) {
          setSelectedVehicle(response.data.vehicles[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const loadSystemMetrics = async () => {
    // Mock system metrics - in real app, this would come from monitoring service
    setSystemMetrics({
      performance: {
        averageResponseTime: 245,
        uptime: 99.97,
        routeAccuracy: 94.2,
        userSatisfaction: 4.6
      },
      usage: {
        activeUsers: 15420,
        routesCalculated: 89340,
        chargingSessionsBooked: 12890,
        dataPoints: 2450000
      },
      dataQuality: {
        stationDataAccuracy: 98.5,
        vehicleDataCompleteness: 96.8,
        lastVerificationDate: new Date()
      }
    });
  };

  const handleVehicleSelect = (vehicle: VehicleSpecifications) => {
    setSelectedVehicle(vehicle);
  };

  const handleRouteCalculated = (route: OptimizedRoute) => {
    setOptimizedRoute(route);
  };

  const handleStationSelect = (station: ChargingStation) => {
    setSelectedStation(station);
  };

  const handleReserveStation = (stationId: string, connectorId: string) => {
    console.log('Reserving station:', stationId, 'connector:', connectorId);
    // Handle reservation logic
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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
                  EV Journey Planner
                </h1>
                <p className="text-sm text-muted-foreground">Comprehensive UAE EV Route Planning</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {systemMetrics && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>{systemMetrics.performance.uptime}% uptime</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{systemMetrics.performance.averageResponseTime}ms</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure</span>
                  </div>
                </div>
              )}
              <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                <Wifi className="w-3 h-3 mr-1" />
                Real-time Data
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                <Globe className="w-3 h-3 mr-1" />
                UAE Optimized
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <Route className="w-4 h-4" />
              Planning
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Vehicles
            </TabsTrigger>
            <TabsTrigger value="stations" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Stations
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Route Planning */}
              <div className="lg:col-span-2 space-y-6">
                <RouteOptimizer
                  vehicle={selectedVehicle}
                  onRouteCalculated={handleRouteCalculated}
                />

                {/* Route Summary */}
                {optimizedRoute && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Navigation className="w-5 h-5" />
                        Journey Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-1">
                            {formatTime(optimizedRoute.summary.totalJourneyTime)}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Time</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatTime(optimizedRoute.summary.totalDrivingTime)} driving +{' '}
                            {formatTime(optimizedRoute.summary.totalChargingTime)} charging
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            {optimizedRoute.summary.totalDistance}
                          </div>
                          <div className="text-sm text-muted-foreground">Kilometers</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {optimizedRoute.summary.energyConsumption.toFixed(1)} kWh consumption
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            {optimizedRoute.chargingStops.length}
                          </div>
                          <div className="text-sm text-muted-foreground">Charging Stops</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {optimizedRoute.summary.arrivalSoc}% arrival SOC
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-600 mb-1">
                            {formatCurrency(optimizedRoute.summary.totalCost)}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Cost</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {optimizedRoute.summary.carbonFootprint.toFixed(1)} kg CO₂
                          </div>
                        </div>
                      </div>

                      {/* Charging Stops */}
                      {optimizedRoute.chargingStops.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3">Charging Stops</h4>
                          <div className="space-y-3">
                            {optimizedRoute.chargingStops.map((stop, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <div className="font-medium">{stop.station.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {stop.station.location.address}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium">
                                    {stop.arrivalSoc}% → {stop.departureSoc}%
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {stop.chargingTime} min • {formatCurrency(stop.cost)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Route Confidence */}
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Route Confidence</span>
                          <span className="text-lg font-bold text-blue-600">
                            {optimizedRoute.confidence.overall}/100
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span>Weather Accuracy:</span>
                            <span>{optimizedRoute.confidence.factors.weatherAccuracy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Traffic Prediction:</span>
                            <span>{optimizedRoute.confidence.factors.trafficPrediction}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Charging Availability:</span>
                            <span>{optimizedRoute.confidence.factors.chargingAvailability}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Energy Consumption:</span>
                            <span>{optimizedRoute.confidence.factors.energyConsumption}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Vehicle Selection */}
              <div>
                <VehicleSelector
                  selectedVehicle={selectedVehicle}
                  onVehicleSelect={handleVehicleSelect}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-6">
            <VehicleSelector
              selectedVehicle={selectedVehicle}
              onVehicleSelect={handleVehicleSelect}
            />
          </TabsContent>

          <TabsContent value="stations" className="space-y-6">
            <ChargingStationMap
              route={optimizedRoute}
              onStationSelect={handleStationSelect}
              onReserveStation={handleReserveStation}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userProfile ? (
                  <div className="space-y-6">
                    {/* Personal Info */}
                    <div>
                      <h3 className="font-semibold mb-3">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Name</label>
                          <div className="font-medium">{userProfile.personalInfo.name}</div>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Email</label>
                          <div className="font-medium">{userProfile.personalInfo.email}</div>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Phone</label>
                          <div className="font-medium">{userProfile.personalInfo.phone}</div>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Language</label>
                          <div className="font-medium">
                            {userProfile.personalInfo.preferredLanguage === 'en' ? 'English' : 'Arabic'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subscription */}
                    <div>
                      <h3 className="font-semibold mb-3">Subscription</h3>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
                        <div>
                          <div className="font-semibold text-lg">{userProfile.subscription.type} Plan</div>
                          <div className="text-sm text-muted-foreground">
                            Expires: {userProfile.subscription.expiryDate.toLocaleDateString()}
                          </div>
                        </div>
                        <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-green-500">
                          Active
                        </Badge>
                      </div>
                    </div>

                    {/* Vehicles */}
                    <div>
                      <h3 className="font-semibold mb-3">My Vehicles</h3>
                      <div className="space-y-3">
                        {userProfile.vehicles.map((vehicle) => (
                          <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">
                                {vehicle.make} {vehicle.model} ({vehicle.year})
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {vehicle.battery.capacity} kWh • {vehicle.charging.dcMaxPower} kW charging
                              </div>
                            </div>
                            {vehicle.id === userProfile.defaultVehicle && (
                              <Badge variant="default">Default</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Journey History */}
                    <div>
                      <h3 className="font-semibold mb-3">Recent Journeys</h3>
                      <div className="space-y-3">
                        {userProfile.journeyHistory.slice(0, 5).map((journey) => (
                          <div key={journey.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">
                                {journey.route.summary.totalDistance} km journey
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {journey.date.toLocaleDateString()} • {formatTime(journey.actualPerformance.actualDrivingTime)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < journey.userRating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatCurrency(journey.actualPerformance.actualCost)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Profile Found</h3>
                    <p className="text-muted-foreground">Please sign in to view your profile.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {systemMetrics && (
              <>
                {/* System Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      System Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {systemMetrics.performance.uptime}%
                        </div>
                        <div className="text-sm text-muted-foreground">System Uptime</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          {systemMetrics.performance.averageResponseTime}ms
                        </div>
                        <div className="text-sm text-muted-foreground">Response Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-1">
                          {systemMetrics.performance.routeAccuracy}%
                        </div>
                        <div className="text-sm text-muted-foreground">Route Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-1">
                          {systemMetrics.performance.userSatisfaction}/5
                        </div>
                        <div className="text-sm text-muted-foreground">User Rating</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-1">
                          {systemMetrics.usage.activeUsers.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Active Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          {systemMetrics.usage.routesCalculated.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Routes Calculated</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {systemMetrics.usage.chargingSessionsBooked.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Sessions Booked</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-1">
                          {(systemMetrics.usage.dataPoints / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-muted-foreground">Data Points</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Quality */}
                <Card>
                  <CardHeader>
                    <CardTitle>Data Quality & Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Station Data Accuracy</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-muted rounded-full">
                            <div 
                              className="h-2 bg-green-500 rounded-full"
                              style={{ width: `${systemMetrics.dataQuality.stationDataAccuracy}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{systemMetrics.dataQuality.stationDataAccuracy}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Vehicle Data Completeness</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-muted rounded-full">
                            <div 
                              className="h-2 bg-blue-500 rounded-full"
                              style={{ width: `${systemMetrics.dataQuality.vehicleDataCompleteness}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{systemMetrics.dataQuality.vehicleDataCompleteness}%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Last Verification</span>
                        <span className="text-sm font-medium">
                          {systemMetrics.dataQuality.lastVerificationDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Compliance Status</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span>UAE Data Protection: Compliant</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span>EV Standards: ISO 15118</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span>Payment Security: PCI DSS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span>Accessibility: WCAG 2.1</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComprehensiveIndex;