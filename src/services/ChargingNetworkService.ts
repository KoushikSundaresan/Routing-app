import { ChargingStation, APIResponse, RealTimeUpdate } from '@/types/comprehensive';

export class ChargingNetworkService {
  private readonly baseUrl = process.env.VITE_API_BASE_URL || 'https://api.evjourney.ae';
  private readonly apiKey = process.env.VITE_API_KEY;
  private websocket: WebSocket | null = null;
  private updateCallbacks: ((update: RealTimeUpdate) => void)[] = [];

  constructor() {
    this.initializeWebSocket();
  }

  /**
   * Get all charging stations in UAE
   */
  async getAllStations(): Promise<APIResponse<ChargingStation[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/charging/stations`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: data.stations,
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
   * Get stations within radius of location
   */
  async getStationsNearby(
    latitude: number, 
    longitude: number, 
    radiusKm: number = 50,
    filters?: {
      network?: string;
      connectorType?: string;
      minPower?: number;
      availableOnly?: boolean;
    }
  ): Promise<APIResponse<ChargingStation[]>> {
    try {
      const queryParams = new URLSearchParams({
        lat: latitude.toString(),
        lng: longitude.toString(),
        radius: radiusKm.toString()
      });

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${this.baseUrl}/charging/stations/nearby?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: data.stations,
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
   * Get real-time station status
   */
  async getStationStatus(stationId: string): Promise<APIResponse<ChargingStation>> {
    try {
      const response = await fetch(`${this.baseUrl}/charging/stations/${stationId}/status`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: data.station,
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
   * Reserve charging connector
   */
  async reserveConnector(
    stationId: string, 
    connectorId: string, 
    reservationTime: Date,
    durationMinutes: number
  ): Promise<APIResponse<{ reservationId: string; expiryTime: Date }>> {
    try {
      const response = await fetch(`${this.baseUrl}/charging/stations/${stationId}/reserve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          connectorId,
          reservationTime: reservationTime.toISOString(),
          durationMinutes
        })
      });

      const data = await response.json();
      return {
        success: true,
        data: {
          reservationId: data.reservationId,
          expiryTime: new Date(data.expiryTime)
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
   * Cancel reservation
   */
  async cancelReservation(reservationId: string): Promise<APIResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/charging/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: data.cancelled,
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
   * Submit station review
   */
  async submitReview(
    stationId: string,
    review: {
      rating: number;
      categories: {
        accessibility: number;
        cleanliness: number;
        safety: number;
        convenience: number;
        reliability: number;
      };
      comment: string;
      photos?: string[];
    }
  ): Promise<APIResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/charging/stations/${stationId}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
      });

      const data = await response.json();
      return {
        success: true,
        data: data.submitted,
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
   * Report station issue
   */
  async reportIssue(
    stationId: string,
    issue: {
      type: string;
      description: string;
      severity: 'Low' | 'Medium' | 'High' | 'Critical';
      photos?: string[];
    }
  ): Promise<APIResponse<{ issueId: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/charging/stations/${stationId}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(issue)
      });

      const data = await response.json();
      return {
        success: true,
        data: { issueId: data.issueId },
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
   * Get station pricing information
   */
  async getStationPricing(stationId: string): Promise<APIResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/charging/stations/${stationId}/pricing`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: data.pricing,
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
   * Initialize WebSocket connection for real-time updates
   */
  private initializeWebSocket(): void {
    const wsUrl = process.env.VITE_WS_URL || 'wss://ws.evjourney.ae';
    
    try {
      this.websocket = new WebSocket(`${wsUrl}?token=${this.apiKey}`);
      
      this.websocket.onopen = () => {
        console.log('WebSocket connected for real-time charging updates');
      };
      
      this.websocket.onmessage = (event) => {
        try {
          const update: RealTimeUpdate = JSON.parse(event.data);
          this.updateCallbacks.forEach(callback => callback(update));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.websocket.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(() => this.initializeWebSocket(), 5000);
      };
      
      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }

  /**
   * Subscribe to real-time updates
   */
  subscribeToUpdates(callback: (update: RealTimeUpdate) => void): void {
    this.updateCallbacks.push(callback);
  }

  /**
   * Unsubscribe from real-time updates
   */
  unsubscribeFromUpdates(callback: (update: RealTimeUpdate) => void): void {
    const index = this.updateCallbacks.indexOf(callback);
    if (index > -1) {
      this.updateCallbacks.splice(index, 1);
    }
  }

  /**
   * Get historical reliability data for station
   */
  async getStationReliability(stationId: string, days: number = 30): Promise<APIResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/charging/stations/${stationId}/reliability?days=${days}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: data.reliability,
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
    console.error('Charging Network Service Error:', error);
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

  /**
   * Cleanup WebSocket connection
   */
  disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.updateCallbacks = [];
  }
}

export const chargingNetworkService = new ChargingNetworkService();