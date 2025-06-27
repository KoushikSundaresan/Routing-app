import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChargingStation, OptimizedRoute, RealTimeUpdate } from '@/types/comprehensive';
import { chargingNetworkService } from '@/services/ChargingNetworkService';
import { 
  MapPin, 
  Zap, 
  Clock, 
  DollarSign, 
  Star, 
  Filter,
  Navigation,
  Phone,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface ChargingStationMapProps {
  route?: OptimizedRoute;
  onStationSelect?: (station: ChargingStation) => void;
  onReserveStation?: (stationId: string, connectorId: string) => void;
}

const ChargingStationMap: React.FC<ChargingStationMapProps> = ({
  route,
  onStationSelect,
  onReserveStation
}) => {
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<ChargingStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    network: '',
    connectorType: '',
    minPower: '',
    availableOnly: false,
    maxDistance: '50'
  });
  const [searchLocation, setSearchLocation] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    getUserLocation();
    loadStations();
    subscribeToUpdates();

    return () => {
      chargingNetworkService.unsubscribeFromUpdates(handleRealTimeUpdate);
    };
  }, []);

  useEffect(() => {
    filterStations();
  }, [stations, filters]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Dubai
          setUserLocation({ lat: 25.2048, lng: 55.2708 });
        }
      );
    } else {
      // Default to Dubai
      setUserLocation({ lat: 25.2048, lng: 55.2708 });
    }
  };

  const loadStations = async () => {
    setLoading(true);
    try {
      const response = await chargingNetworkService.getAllStations();
      if (response.success && response.data) {
        setStations(response.data);
      }
    } catch (error) {
      console.error('Failed to load stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToUpdates = () => {
    chargingNetworkService.subscribeToUpdates(handleRealTimeUpdate);
  };

  const handleRealTimeUpdate = (update: RealTimeUpdate) => {
    if (update.type === 'Station Status' && update.stationId) {
      setStations(prevStations =>
        prevStations.map(station =>
          station.id === update.stationId
            ? { ...station, ...update.data }
            : station
        )
      );
    }
  };

  const filterStations = () => {
    let filtered = stations;

    if (filters.network) {
      filtered = filtered.filter(station => station.network === filters.network);
    }

    if (filters.connectorType) {
      filtered = filtered.filter(station =>
        station.connectors.some(connector => connector.type === filters.connectorType)
      );
    }

    if (filters.minPower) {
      const minPower = parseInt(filters.minPower);
      filtered = filtered.filter(station =>
        station.connectors.some(connector => connector.maxPower >= minPower)
      );
    }

    if (filters.availableOnly) {
      filtered = filtered.filter(station => station.realTime.availableConnectors > 0);
    }

    if (filters.maxDistance && userLocation) {
      const maxDistance = parseInt(filters.maxDistance);
      filtered = filtered.filter(station => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          station.location.latitude,
          station.location.longitude
        );
        return distance <= maxDistance;
      });
    }

    setFilteredStations(filtered);
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleStationClick = (station: ChargingStation) => {
    setSelectedStation(station);
    onStationSelect?.(station);
  };

  const handleReserveConnector = async (stationId: string, connectorId: string) => {
    try {
      const reservationTime = new Date();
      reservationTime.setMinutes(reservationTime.getMinutes() + 15); // 15 minutes from now
      
      const response = await chargingNetworkService.reserveConnector(
        stationId,
        connectorId,
        reservationTime,
        60 // 1 hour duration
      );

      if (response.success) {
        onReserveStation?.(stationId, connectorId);
        // Update station status
        loadStations();
      }
    } catch (error) {
      console.error('Reservation failed:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (station: ChargingStation) => {
    if (station.realTime.availableConnectors === 0) return 'bg-red-500';
    if (station.realTime.availableConnectors < station.realTime.totalConnectors / 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getNetworkColor = (network: string) => {
    const colors: { [key: string]: string } = {
      'DEWA': 'bg-blue-500',
      'ADDC': 'bg-green-500',
      'Tesla': 'bg-red-500',
      'ChargePoint': 'bg-purple-500',
      'EVgo': 'bg-orange-500'
    };
    return colors[network] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading charging stations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Station Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Select value={filters.network} onValueChange={(value) => setFilters({...filters, network: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Networks</SelectItem>
                <SelectItem value="DEWA">DEWA</SelectItem>
                <SelectItem value="ADDC">ADDC</SelectItem>
                <SelectItem value="Tesla">Tesla</SelectItem>
                <SelectItem value="ChargePoint">ChargePoint</SelectItem>
                <SelectItem value="EVgo">EVgo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.connectorType} onValueChange={(value) => setFilters({...filters, connectorType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Connector Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="CCS2">CCS2</SelectItem>
                <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
                <SelectItem value="Tesla">Tesla</SelectItem>
                <SelectItem value="Type2">Type 2</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Min Power (kW)"
              value={filters.minPower}
              onChange={(e) => setFilters({...filters, minPower: e.target.value})}
              type="number"
            />

            <Select value={filters.maxDistance} onValueChange={(value) => setFilters({...filters, maxDistance: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Max Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="25">25 km</SelectItem>
                <SelectItem value="50">50 km</SelectItem>
                <SelectItem value="100">100 km</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={filters.availableOnly ? "default" : "outline"}
              onClick={() => setFilters({...filters, availableOnly: !filters.availableOnly})}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Available Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Station List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Charging Stations ({filteredStations.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredStations.map((station) => (
              <div
                key={station.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedStation?.id === station.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleStationClick(station)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold">{station.name}</h3>
                    <p className="text-sm text-muted-foreground">{station.location.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(station)}`}></div>
                    <Badge className={`${getNetworkColor(station.network)} text-white`}>
                      {station.network}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span>{Math.max(...station.connectors.map(c => c.maxPower))} kW</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span>
                      {station.realTime.availableConnectors}/{station.realTime.totalConnectors} available
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-orange-500" />
                    <span>{formatCurrency(station.pricing.costPerKwh)}/kWh</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{station.userFeedback.averageRating.toFixed(1)}</span>
                  </div>
                </div>

                {station.realTime.averageWaitTime > 0 && (
                  <div className="flex items-center gap-1 text-sm text-orange-600">
                    <Clock className="w-4 h-4" />
                    <span>~{station.realTime.averageWaitTime} min wait</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mt-2">
                  {station.connectors.slice(0, 3).map((connector, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {connector.type} ({connector.maxPower}kW)
                    </Badge>
                  ))}
                  {station.connectors.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{station.connectors.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Station Details */}
      {selectedStation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedStation.name}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Navigation className="w-4 h-4 mr-1" />
                  Navigate
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Station Info */}
              <div>
                <h4 className="font-semibold mb-2">Station Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Network:</span>
                    <span className="ml-2">{selectedStation.network}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Access:</span>
                    <span className="ml-2">{selectedStation.operational.accessType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Operating Hours:</span>
                    <span className="ml-2">24/7</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reliability:</span>
                    <span className="ml-2">{selectedStation.userFeedback.reliabilityScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Connectors */}
              <div>
                <h4 className="font-semibold mb-2">Available Connectors</h4>
                <div className="space-y-2">
                  {selectedStation.connectors.map((connector) => (
                    <div
                      key={connector.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          connector.isAvailable ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <span className="font-medium">{connector.type}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {connector.maxPower} kW • {connector.maxVoltage} V
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {connector.status}
                        </span>
                        {connector.isAvailable && (
                          <Button
                            size="sm"
                            onClick={() => handleReserveConnector(selectedStation.id, connector.id)}
                          >
                            <Calendar className="w-4 h-4 mr-1" />
                            Reserve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h4 className="font-semibold mb-2">Pricing</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Cost per kWh:</span>
                    <span className="ml-2 font-medium">{formatCurrency(selectedStation.pricing.costPerKwh)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Session Fee:</span>
                    <span className="ml-2 font-medium">{formatCurrency(selectedStation.pricing.sessionFee)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Parking Fee:</span>
                    <span className="ml-2 font-medium">{formatCurrency(selectedStation.pricing.parkingFee)}/hr</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Member Discount:</span>
                    <span className="ml-2 font-medium">{selectedStation.pricing.membershipDiscount}%</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-semibold mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedStation.amenities)
                    .filter(([_, value]) => value === true)
                    .map(([key, _]) => (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Badge>
                    ))}
                </div>
              </div>

              {/* Recent Issues */}
              {selectedStation.userFeedback.recentIssues.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Recent Issues
                  </h4>
                  <div className="space-y-2">
                    {selectedStation.userFeedback.recentIssues.slice(0, 3).map((issue) => (
                      <div key={issue.id} className="p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{issue.type}</span>
                          <Badge variant="outline" className={`text-xs ${
                            issue.severity === 'Critical' ? 'border-red-500 text-red-700' :
                            issue.severity === 'High' ? 'border-orange-500 text-orange-700' :
                            'border-yellow-500 text-yellow-700'
                          }`}>
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">{issue.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Reported {new Date(issue.reportedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChargingStationMap;