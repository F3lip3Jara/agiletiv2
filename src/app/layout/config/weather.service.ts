import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Environment } from '../../erp/service/environment.service';

export interface WeatherData {
  temperature: number;
  location: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  timestamp: number;
  tempMin: number;
  tempMax: number;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly storageKey = 'clima_usuario';

  constructor(
    private http: HttpClient,
    private environment: Environment
  ) {}

  getWeatherData(): Observable<WeatherData> {
    return this.getCurrentPosition().pipe(
      switchMap(position => this.fetchWeatherFromAPI(position)),
      map(response => 
        this.transformWeatherData(response)),
      catchError(error => {
        console.error('Error obteniendo datos del clima:', error);
        return throwError(() => error);
      })
    );
  }

  private getCurrentPosition(): Observable<GeolocationPosition> {
    return from(new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      );
    }));
  }

  private fetchWeatherFromAPI(position: GeolocationPosition): Observable<any> {
    const { latitude, longitude } = position.coords;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=es&appid=${this.environment.openWeatherApiKey}`;
    
    return this.http.get(url);
  }

  private transformWeatherData(apiResponse: any): WeatherData {
    console.log(apiResponse);
    return {
      temperature: Math.round(apiResponse.main.temp),
      location: apiResponse.name + ', ' + apiResponse.sys.country,
      description: this.capitalizeFirst(apiResponse.weather[0].description),
      icon: apiResponse.weather[0].icon,
      humidity: apiResponse.main.humidity,
      windSpeed: Math.round(apiResponse.wind.speed * 3.6), // Convertir m/s a km/h
      timestamp: Date.now(),
      tempMin: Math.round(apiResponse.main.temp_min),
      tempMax: Math.round(apiResponse.main.temp_max)
    };
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  saveWeatherToStorage(weatherData: WeatherData): void {
    try {
      const data = {
        ...weatherData,
        fecha: new Date().toDateString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error guardando clima en localStorage:', error);
    }
  }

  loadWeatherFromStorage(): WeatherData | null {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const data = JSON.parse(storedData);
        const today = new Date().toDateString();
        
        // Verificar si los datos son de hoy y no tienen más de 1 hora
        if (data.fecha === today && data.timestamp) {
          const oneHourAgo = Date.now() - (60 * 60 * 1000);
          if (data.timestamp > oneHourAgo) {
            return data;
          }
        }
      }
    } catch (error) {
      console.error('Error cargando clima desde localStorage:', error);
    }
    return null;
  }

  clearWeatherStorage(): void {
    localStorage.removeItem(this.storageKey);
  }

  // Método para probar que la URL no sea interceptada
  testWeatherAPI(): Observable<any> {
    const testUrl = `https://api.openweathermap.org/data/2.5/weather?lat=-33.02328201759588&lon=-71.63273046887598&units=metric&lang=es&appid=${this.environment.openWeatherApiKey}`;
    console.log('Probando URL de OpenWeatherMap:', testUrl);
    return this.http.get(testUrl);
  }
} 