import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TotpSetupResponse {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

export interface TotpVerificationResponse {
  success: boolean;
  message: string;
  resources: any;
}

@Injectable({
  providedIn: 'root'
})
export class TotpService {
  private baseUrl = 'totp'; // Ajustar según tu configuración de rutas

  constructor(private http: HttpClient) {}

  /**
   * Solicita la configuración inicial de TOTP para un usuario
   * @param username Nombre de usuario
   * @returns Observable con el código QR y secret
   */
  setupTotp(username: string): Observable<TotpSetupResponse> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<TotpSetupResponse>(`${this.baseUrl}/setup`, { username }, { headers });
  }

  /**
   * Verifica el código TOTP ingresado por el usuario
   * @param username Nombre de usuario
   * @param code Código de 6 dígitos
   * @returns Observable con el resultado de la verificación
   */
  verifyTotp(username: string, code: string, resources: any): Observable<TotpVerificationResponse> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<TotpVerificationResponse>(`${this.baseUrl}/verify`, 
      { username, code ,resources}, 
      { headers }
    );
  }

  /**
   * Verifica si un usuario ya tiene TOTP configurado
   * @param username Nombre de usuario
   * @returns Observable con el estado de configuración
   */
  checkTotpStatus(username: string): Observable<{ hasTotp: boolean }> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<{ hasTotp: boolean }>(`${this.baseUrl}/status`, { username }, { headers });
  }

  /**
   * Desactiva TOTP para un usuario
   * @param username Nombre de usuario
   * @returns Observable con el resultado
   */
  disableTotp(username: string): Observable<{ success: boolean; message: string }> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<{ success: boolean; message: string }>(`${this.baseUrl}/disable`, 
      { username }, 
      { headers }
    );
  }
}
