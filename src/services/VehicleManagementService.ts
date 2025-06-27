import { VehicleSpecifications, APIResponse } from '@/types/comprehensive';

export class VehicleManagementService {
  private readonly baseUrl = process.env.VITE_API_BASE_URL || 'https://api.evjourney.ae';
  private readonly apiKey = process.env.VITE_API_KEY;

  /**
   * Retrieve all vehicles available in the UAE market
   */
  async getUAEVehicleDatabase(): Promise<APIResponse<VehicleSpecifications[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/vehicles/uae`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: data.vehicles,
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
   * Get vehicle specifications by VIN
   */
  async getVehicleByVIN(vin: string): Promise<APIResponse<VehicleSpecifications>> {
    try {
      const response = await fetch(`${this.baseUrl}/vehicles/vin/${vin}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 404) {
        return {
          success: false,
          error: {
            code: 'VEHICLE_NOT_FOUND',
            message: 'Vehicle not found in database'
          },
          metadata: {
            timestamp: new Date(),
            requestId: '',
            processingTime: 0,
            version: '1.0'
          }
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.vehicle,
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
   * Create custom vehicle profile
   */
  async createCustomVehicle(vehicle: Partial<VehicleSpecifications>): Promise<APIResponse<VehicleSpecifications>> {
    try {
      const response = await fetch(`${this.baseUrl}/vehicles/custom`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehicle)
      });

      const data = await response.json();
      return {
        success: true,
        data: data.vehicle,
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
   * Update vehicle database from manufacturer APIs
   */
  async updateVehicleDatabase(): Promise<APIResponse<{ updated: number; added: number }>> {
    try {
      const response = await fetch(`${this.baseUrl}/vehicles/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: {
          updated: data.updated,
          added: data.added
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
   * Get vehicle performance history
   */
  async getVehiclePerformanceHistory(vehicleId: string): Promise<APIResponse<any[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/vehicles/${vehicleId}/performance`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: data.history,
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
   * Search vehicles by criteria
   */
  async searchVehicles(criteria: {
    make?: string;
    model?: string;
    year?: number;
    minRange?: number;
    maxPrice?: number;
    chargingType?: string;
  }): Promise<APIResponse<VehicleSpecifications[]>> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(criteria).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}/vehicles/search?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: data.vehicles,
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
    console.error('Vehicle Management Service Error:', error);
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

export const vehicleManagementService = new VehicleManagementService();