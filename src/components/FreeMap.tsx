
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockChargingStations } from '@/data/chargingStations';
import { ChargingStation } from '@/types/ev';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => void })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom charging station icons
const createChargingIcon = (isAvailable: boolean) => {
  const color = isAvailable ? '#10b981' : '#ef4444';
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: white;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface FreeMapProps {
  onStationSelect?: (station: ChargingStation) => void;
  className?: string;
}

const FreeMap: React.FC<FreeMapProps> = ({ onStationSelect, className = '' }) => {
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const handleStationClick = (station: ChargingStation) => {
    setSelectedStation(station);
    onStationSelect?.(station);
  };

  useEffect(() => {
    // Ensure Leaflet is properly loaded
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return (
      <div className={`${className} relative overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden rounded-lg border border-border`}>
      <MapContainer
        center={[25.2048, 55.2708]} // Dubai center
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mockChargingStations.map((station) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={createChargingIcon(station.isAvailable)}
            eventHandlers={{
              click: () => handleStationClick(station),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm mb-1">{station.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{station.address}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-800">
                    {station.network}
                  </span>
                  <span className={station.isAvailable ? 'text-green-600' : 'text-red-600'}>
                    {station.isAvailable ? 'Available' : 'Occupied'}
                  </span>
                </div>
                <div className="mt-2 text-xs">
                  <div>Max Power: {station.maxPower} kW</div>
                  <div>Ports: {station.numberOfPorts}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map legend */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3">
        <h4 className="text-sm font-semibold mb-2 text-white">Charging Stations</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-white/80">Available</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-white/80">Occupied</span>
          </div>
        </div>
      </div>

      {/* Free API Notice */}
      <div className="absolute bottom-4 right-4 bg-green-600/90 text-white text-xs px-2 py-1 rounded">
        Free OpenStreetMap
      </div>
    </div>
  );
};

export default FreeMap;
