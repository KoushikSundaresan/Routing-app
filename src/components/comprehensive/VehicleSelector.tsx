import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VehicleSpecifications } from '@/types/comprehensive';
import { vehicleManagementService } from '@/services/VehicleManagementService';
import { Car, Battery, Zap, Search, Plus } from 'lucide-react';

interface VehicleSelectorProps {
  selectedVehicle?: VehicleSpecifications;
  onVehicleSelect: (vehicle: VehicleSpecifications) => void;
  onCreateCustom?: () => void;
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  selectedVehicle,
  onVehicleSelect,
  onCreateCustom
}) => {
  const [vehicles, setVehicles] = useState<VehicleSpecifications[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleSpecifications[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    make: '',
    year: '',
    minRange: '',
    maxPrice: '',
    chargingType: ''
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm, filters]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const response = await vehicleManagementService.getUAEVehicleDatabase();
      if (response.success && response.data) {
        setVehicles(response.data);
      }
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = vehicles;

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Make filter
    if (filters.make) {
      filtered = filtered.filter(vehicle => vehicle.make === filters.make);
    }

    // Year filter
    if (filters.year) {
      filtered = filtered.filter(vehicle => vehicle.year.toString() === filters.year);
    }

    // Range filter
    if (filters.minRange) {
      const minRange = parseInt(filters.minRange);
      filtered = filtered.filter(vehicle => {
        const range = (vehicle.battery.capacity * 1000) / vehicle.consumption.combined;
        return range >= minRange;
      });
    }

    // Price filter
    if (filters.maxPrice) {
      const maxPrice = parseInt(filters.maxPrice);
      filtered = filtered.filter(vehicle => vehicle.market.msrpAED <= maxPrice);
    }

    // Charging type filter
    if (filters.chargingType) {
      filtered = filtered.filter(vehicle =>
        vehicle.charging.supportedProtocols.some(protocol => protocol.type === filters.chargingType)
      );
    }

    setFilteredVehicles(filtered);
  };

  const getUniqueValues = (key: keyof VehicleSpecifications) => {
    return [...new Set(vehicles.map(vehicle => vehicle[key]))].sort();
  };

  const calculateRange = (vehicle: VehicleSpecifications) => {
    return Math.round((vehicle.battery.capacity * 1000) / vehicle.consumption.combined);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading vehicles...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="w-5 h-5" />
          Select Your Vehicle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-2 gap-4">
              <Select value={filters.make} onValueChange={(value) => setFilters({...filters, make: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Make" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Makes</SelectItem>
                  {getUniqueValues('make').map((make) => (
                    <SelectItem key={make} value={make}>{make}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Years</SelectItem>
                  {getUniqueValues('year').map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedVehicle?.id === vehicle.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => onVehicleSelect(vehicle)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">
                        {vehicle.make} {vehicle.model} ({vehicle.year})
                      </h3>
                      <p className="text-sm text-muted-foreground">{vehicle.trim}</p>
                    </div>
                    {vehicle.market.isAvailableInUAE && (
                      <Badge variant="secondary">Available in UAE</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Battery className="w-4 h-4 text-green-500" />
                      <span>{vehicle.battery.capacity} kWh</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span>{vehicle.charging.dcMaxPower} kW</span>
                    </div>
                    <div>
                      <span className="font-medium">{calculateRange(vehicle)} km</span>
                      <span className="text-muted-foreground"> range</span>
                    </div>
                  </div>

                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex gap-1">
                      {vehicle.charging.supportedProtocols.slice(0, 3).map((protocol, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {protocol.type}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {formatPrice(vehicle.market.msrpAED)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Min Range (km)"
                value={filters.minRange}
                onChange={(e) => setFilters({...filters, minRange: e.target.value})}
                type="number"
              />
              <Input
                placeholder="Max Price (AED)"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                type="number"
              />
            </div>

            <Select value={filters.chargingType} onValueChange={(value) => setFilters({...filters, chargingType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Charging Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="CCS2">CCS2</SelectItem>
                <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
                <SelectItem value="Tesla">Tesla</SelectItem>
                <SelectItem value="Type2">Type 2</SelectItem>
              </SelectContent>
            </Select>

            {/* Search Results */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedVehicle?.id === vehicle.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => onVehicleSelect(vehicle)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">
                        {vehicle.make} {vehicle.model} ({vehicle.year})
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {calculateRange(vehicle)} km range • {vehicle.charging.dcMaxPower} kW charging
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {formatPrice(vehicle.market.msrpAED)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="text-center py-8">
              <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Create Custom Vehicle Profile</h3>
              <p className="text-muted-foreground mb-4">
                Don't see your vehicle? Create a custom profile with your specific specifications.
              </p>
              <Button onClick={onCreateCustom} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Custom Vehicle
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Selected Vehicle Details */}
        {selectedVehicle && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Selected Vehicle</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Battery:</span>
                <span className="ml-2">{selectedVehicle.battery.capacity} kWh ({selectedVehicle.battery.chemistry})</span>
              </div>
              <div>
                <span className="text-muted-foreground">Max Charging:</span>
                <span className="ml-2">{selectedVehicle.charging.dcMaxPower} kW DC</span>
              </div>
              <div>
                <span className="text-muted-foreground">Efficiency:</span>
                <span className="ml-2">{selectedVehicle.consumption.combined} Wh/km</span>
              </div>
              <div>
                <span className="text-muted-foreground">Range:</span>
                <span className="ml-2">{calculateRange(selectedVehicle)} km</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleSelector;