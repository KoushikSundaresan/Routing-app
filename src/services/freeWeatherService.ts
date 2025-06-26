
import { WeatherData } from '@/types/ev';

interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

export class FreeWeatherService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || 'demo'; // Users can add their free API key
  }

  async getCurrentWeather(lat: number, lng: number): Promise<WeatherData> {
    // If no API key is provided, return mock data
    if (this.apiKey === 'demo') {
      return this.getMockWeather();
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        console.log('Weather API failed, using mock data');
        return this.getMockWeather();
      }

      const data: WeatherResponse = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: data.wind.deg,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon
      };
    } catch (error) {
      console.error('Weather service error:', error);
      return this.getMockWeather();
    }
  }

  private getMockWeather() {
    return {
      temperature: 28,
      humidity: 65,
      windSpeed: 12,
      windDirection: 180,
      condition: 'Clear',
      description: 'clear sky',
      icon: '01d'
    };
  }
}

export const freeWeatherService = new FreeWeatherService();
