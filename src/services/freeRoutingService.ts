
import { GeocodingResult } from '@/types/ev';

interface RoutingResponse {
  features: Array<{
    geometry: {
      coordinates: number[][];
    };
    properties: {
      segments: Array<{
        distance: number;
        duration: number;
      }>;
      summary: {
        distance: number;
        duration: number;
      };
    };
  }>;
}

export class FreeRoutingService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openrouteservice.org/v2';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || 'demo'; // Users can add their free API key
  }

  async getRoute(
    start: [number, number], 
    end: [number, number],
    profile: string = 'driving-car'
  ): Promise<RoutingResponse | null> {
    // If no API key, return mock route data
    if (this.apiKey === 'demo') {
      return this.getMockRoute(start, end);
    }

    try {
      const url = `${this.baseUrl}/directions/${profile}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey,
        },
        body: JSON.stringify({
          coordinates: [start, end],
          format: 'geojson',
          instructions: false,
        }),
      });

      if (!response.ok) {
        console.log('Routing API failed, using mock data');
        return this.getMockRoute(start, end);
      }

      return await response.json();
    } catch (error) {
      console.error('Free routing error:', error);
      return this.getMockRoute(start, end);
    }
  }

  async geocode(query: string): Promise<GeocodingResult[]> {
    try {
      // Using free Nominatim service (no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ae`
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }

      const results = await response.json();
      return results.map((result: { display_name: string; lat: string; lon: string }) => ({
        display_name: result.display_name,
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon)
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      return [
        { display_name: 'Dubai Mall, Dubai', lat: 25.1972, lon: 55.2744 },
        { display_name: 'Abu Dhabi Mall, Abu Dhabi', lat: 24.4888, lon: 54.6094 }
      ];
    }
  }

  private getMockRoute(start: [number, number], end: [number, number]): RoutingResponse {
    // Calculate simple straight-line distance for mock
    const distance = this.calculateDistance(start[1], start[0], end[1], end[0]);
    const duration = distance * 60; // Assume 1 km per minute

    return {
      features: [{
        geometry: {
          coordinates: [start, end]
        },
        properties: {
          segments: [{
            distance: distance * 1000,
            duration: duration
          }],
          summary: {
            distance: distance * 1000,
            duration: duration
          }
        }
      }]
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export const freeRoutingService = new FreeRoutingService();
