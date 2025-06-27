import { 
  RouteOptimizationRequest, 
  OptimizedRoute, 
  APIResponse, 
  WeatherConditions,
  VehicleSpecifications,
  ChargingStation 
} from '@/types/comprehensive';

export class RouteOptimizationService {
  private readonly baseUrl = process.env.VITE_API_BASE_URL || 'https://api.evjourney.ae';
  private readonly apiKey = process.env.VITE_API_KEY;

  /**
   * Calculate optimized route with charging stops
   */
  async calculateOptimizedRoute(request: RouteOptimizationRequest): Promise<APIResponse<OptimizedRoute>> {
    try {
      const response = await fetch(`${this.baseUrl}/routing/optimize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      const data = await response.json();
      return {
        success: true,
        data: data.route,
        metadata: {
          timestamp: new Date(),
          requestId: data.requestId,
          processingTime: data.processingTime,
          version: '1.0'
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get alternative routes
   */
  async getAlternativeRoutes(
    routeId: string, 
    maxAlternatives: number = 3
  ): Promise<APIResponse<OptimizedRoute[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/routing/${routeId}/alternatives?max=${maxAlternatives}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: data.alternatives,
        metadata: {
          timestamp: new Date(),
          requestId: data.requestId,
          processingTime: data.processingTime,
          version: '1.0'
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Recalculate route with updated conditions
   */
  async recalculateRoute(
    routeId: string,
    updates: {
      currentLocation?: { latitude: number; longitude: number };
      currentSoc?: number;
      trafficConditions?: any;
      weatherConditions?: WeatherConditions;
      stationAvailability?: { stationId: string; isAvailable: boolean }[];
    }
  ): Promise<APIResponse<OptimizedRoute>> {
    try {
      const response = await fetch(`${this.baseUrl}/routing/${routeId}/recalculate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      return {
        success: true,
        data: data.route,
        metadata: {
          timestamp: new Date(),
          requestId: data.requestId,
          processingTime: data.processingTime,
          version: '1.0'
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Calculate energy consumption for route segment
   */
  async calculateEnergyConsumption(
    vehicle: VehicleSpecifications,
    segment: {
      distance: number;
      elevationGain: number;
      elevationLoss: number;
      averageSpeed: number;
      weather: WeatherConditions;
    }
  ): Promise<APIResponse<{ energyConsumption: number; efficiency: number }>> {
    try {
      const response = await fetch(`${this.baseUrl}/routing/energy-calculation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vehicle, segment })
      });

      const data = await response.json();
      return {
        success: true,
        data: {
          energyConsumption: data.energyConsumption,
          efficiency: data.efficiency
        },
        metadata: {
          timestamp: new Date(),
          requestId: data.requestId,
          processingTime: data.processingTime,
          version: '1.0'
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get optimal charging strategy
   */
  async getOptimalChargingStrategy(
    vehicle: VehicleSpecifications,
    route: {
      totalDistance: number;
      segments: any[];
    },
    currentSoc: number,
    targetArrivalSoc: number,
    availableStations: ChargingStation[]
  ): Promise<APIResponse<{
    chargingStops: any[];
    totalChargingTime: number;
    totalCost: number;
    strategy: string;
  }>> {
    try {
      const response = await fetch(`${this.baseUrl}/routing/charging-strategy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vehicle,
          route,
          currentSoc,
          targetArrivalSoc,
          availableStations
        })
      });

      const data = await response.json();
      return {
        success: true,
        data: data.strategy,
        metadata: {
          timestamp: new Date(),
          requestId: data.requestId,
          processingTime: data.processingTime,
          version: '1.0'
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get real-time traffic data
   */
  async getTrafficData(
    coordinates: { latitude: number; longitude: number }[],
    departureTime?: Date
  ): Promise<APIResponse<any>> {
    try {
      const queryParams = new URLSearchParams();
      if (departureTime) {
        queryParams.append('departureTime', departureTime.toISOString());
      }

      const response = await fetch(`${this.baseUrl}/routing/traffic?${queryParams}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coordinates })
      });

      const data = await response.json();
      return {
        success: true,
        data: data.traffic,
        metadata: {
          timestamp: new Date(),
          requestId: data.requestId,
          processingTime: data.processingTime,
          version: '1.0'
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get weather forecast for route
   */
  async getWeatherForecast(
    coordinates: { latitude: number; longitude: number }[],
    departureTime: Date
  ): Promise<APIResponse<WeatherConditions[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/routing/weather-forecast`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coordinates,
          departureTime: departureTime.toISOString()
        })
      });

      const data = await response.json();
      return {
        success: true,
        data: data.forecast,
        metadata: {
          timestamp: new Date(),
          requestId: data.requestId,
          processingTime: data.processingTime,
          version: '1.0'
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Validate route feasibility
   */
  async validateRoute(
    vehicle: VehicleSpecifications,
    route: any,
    currentSoc: number
  ): Promise<APIResponse<{
    isFeasible: boolean;
    issues: string[];
    recommendations: string[];
  }>> {
    try {
      const response = await fetch(`${this.baseUrl}/routing/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vehicle, route, currentSoc })
      });

      const data = await response.json();
      return {
        success: true,
        data: data.validation,
        metadata: {
          timestamp: new Date(),
          requestId: data.requestId,
          processingTime: data.processingTime,
          version: '1.0'
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get route performance prediction
   */
  async getRoutePerformancePrediction(
    routeId: string
  ): Promise<APIResponse<{
    accuracyScore: number;
    confidenceInterval: { min: number; max: number };
    factors: any[];
  }>> {
    try {
      const response = await fetch(`${this.baseUrl}/routing/${routeId}/prediction`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: data.prediction,
        metadata: {
          timestamp: new Date(),
          requestId: data.requestId,
          processingTime: data.processingTime,
          version: '1.0'
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): APIResponse<any> {
    console.error('Route Optimization Service Error:', error);
    return {
      success: false,
      error: {
        code: 'SERVICE_ERROR',
        message: error.message || 'An unexpected error occurred',
        details: error
      },
      metadata: {
        timestamp: new Date(),
        requestId: '',
        processingTime: 0,
        version: '1.0'
      }
    };
  }
}

export const routeOptimizationService = new RouteOptimizationService();