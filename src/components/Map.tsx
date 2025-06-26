
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockChargingStations } from '@/data/chargingStations';
import { ChargingStation } from '@/types/ev';

// Note: In production, this should be stored in environment variables
// For demo purposes, using a placeholder - user needs to add their token
const MAPBOX_TOKEN = 'your-mapbox-token-here';

interface MapProps {
  onStationSelect?: (station: ChargingStation) => void;
  className?: string;
}

const Map: React.FC<MapProps> = ({ onStationSelect, className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Check if token is provided
      if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'your-mapbox-token-here') {
        setMapError('Mapbox token required. Please add your Mapbox public token to continue.');
        return;
      }

      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [55.2708, 25.2048], // Dubai center
        zoom: 10,
        attributionControl: false
      });

      // Add custom controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add charging stations
      map.current.on('load', () => {
        if (!map.current) return;

        // Add charging station markers
        mockChargingStations.forEach((station) => {
          const el = document.createElement('div');
          el.className = `w-8 h-8 rounded-full border-2 cursor-pointer transition-all hover:scale-110 ${
            station.isAvailable 
              ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/25' 
              : 'bg-red-500 border-red-400 shadow-lg shadow-red-500/25'
          }`;
          el.innerHTML = `
            <div class="w-full h-full rounded-full flex items-center justify-center">
              <div class="w-3 h-3 rounded-full bg-white"></div>
            </div>
          `;

          el.addEventListener('click', () => {
            onStationSelect?.(station);
          });

          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            className: 'custom-popup'
          }).setHTML(`
            <div class="p-3">
              <h3 class="font-semibold text-sm mb-1">${station.name}</h3>
              <p class="text-xs text-muted-foreground mb-2">${station.address}</p>
              <div class="flex justify-between items-center text-xs">
                <span class="px-2 py-1 rounded-md bg-primary/20 text-primary">${station.network}</span>
                <span class="${station.isAvailable ? 'text-emerald-400' : 'text-red-400'}">
                  ${station.isAvailable ? 'Available' : 'Occupied'}
                </span>
              </div>
            </div>
          `);

          new mapboxgl.Marker(el)
            .setLngLat([station.lng, station.lat])
            .setPopup(popup)
            .addTo(map.current!);
        });
      });

    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to initialize map. Please check your Mapbox token.');
    }

    return () => {
      map.current?.remove();
    };
  }, [onStationSelect]);

  if (mapError) {
    return (
      <div className={`${className} flex items-center justify-center bg-card border border-border rounded-lg`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.382v10.764a1 1 0 01-.553.894L15 18l-6-3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Map Setup Required</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            {mapError}
          </p>
          <p className="text-xs text-muted-foreground">
            Get your free token at{' '}
            <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden rounded-lg border border-border`}>
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Map overlay with legend */}
      <div className="absolute top-4 left-4 glass-dark rounded-lg p-3">
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
    </div>
  );
};

export default Map;
