import { UserProfile, JourneyRecord, APIResponse } from '@/types/comprehensive';

export class UserManagementService {
  private readonly baseUrl = process.env.VITE_API_BASE_URL || 'https://api.evjourney.ae';
  private readonly apiKey = process.env.VITE_API_KEY;

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<APIResponse<UserProfile>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: data.profile,
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
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<APIResponse<UserProfile>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      return {
        success: true,
        data: data.profile,
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
   * Get user journey history
   */
  async getJourneyHistory(
    userId: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<APIResponse<JourneyRecord[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/journeys?limit=${limit}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: data.journeys,
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
   * Save journey record
   */
  async saveJourneyRecord(userId: string, journey: JourneyRecord): Promise<APIResponse<string>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/journeys`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(journey)
      });

      const data = await response.json();
      return {
        success: true,
        data: data.journeyId,
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
   * Add favorite location
   */
  async addFavoriteLocation(
    userId: string, 
    location: { latitude: number; longitude: number; address: string; name?: string }
  ): Promise<APIResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/favorites`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(location)
      });

      const data = await response.json();
      return {
        success: true,
        data: data.added,
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
   * Remove favorite location
   */
  async removeFavoriteLocation(userId: string, locationId: string): Promise<APIResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/favorites/${locationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: data.removed,
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
   * Update notification preferences
   */
  async updateNotificationPreferences(
    userId: string, 
    preferences: any
  ): Promise<APIResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/notifications`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });

      const data = await response.json();
      return {
        success: true,
        data: data.updated,
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
   * Add payment method
   */
  async addPaymentMethod(
    userId: string, 
    paymentMethod: any
  ): Promise<APIResponse<string>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/payment-methods`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentMethod)
      });

      const data = await response.json();
      return {
        success: true,
        data: data.paymentMethodId,
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
   * Get user analytics
   */
  async getUserAnalytics(userId: string): Promise<APIResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/analytics`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return {
        success: true,
        data: data.analytics,
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
    console.error('User Management Service Error:', error);
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

export const userManagementService = new UserManagementService();