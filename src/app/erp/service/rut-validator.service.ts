import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RutValidatorService {
  
  constructor() { }

  /**
   * Valida si un RUT es válido
   * @param rut RUT a validar (con o sin puntos y guión)
   * @returns boolean
   */
  validateRut(rut: string): boolean {
    if (!rut) return false;
    
    // Limpiar el RUT
    const cleanRut = this.cleanRut(rut);
    
    // Validar formato básico
    if (!/^[0-9]{1,8}-[0-9kK]{1}$/.test(cleanRut)) {
      return false;
    }

    const [body, dv] = cleanRut.split('-');
    const calculatedDv = this.calculateDv(body);

    return calculatedDv === dv.toLowerCase();
  }

  /**
   * Calcula el dígito verificador de un RUT
   * @param body Parte numérica del RUT
   * @returns string
   */
  private calculateDv(body: string): string {
    let sum = 0;
    let multiplier = 2;

    // Calcular suma
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    // Calcular dígito verificador
    const dv = 11 - (sum % 11);
    
    if (dv === 11) return '0';
    if (dv === 10) return 'k';
    return dv.toString();
  }

  /**
   * Limpia el RUT de puntos y guiones
   * @param rut RUT a limpiar
   * @returns string
   */
  cleanRut(rut: string): string {
    return rut.replace(/\./g, '').replace(/-/g, '');
  }

  /**
   * Formatea un RUT con puntos y guión
   * @param rut RUT a formatear
   * @returns string
   */
  formatRut(rut: string): string {
    const cleanRut = this.cleanRut(rut);
    if (!cleanRut) return '';

    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    // Agregar puntos cada 3 dígitos desde la derecha
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedBody}-${dv}`;
  }

  /**
   * Extrae solo la parte numérica del RUT
   * @param rut RUT completo
   * @returns string
   */
  getRutBody(rut: string): string {
    const cleanRut = this.cleanRut(rut);
    return cleanRut.slice(0, -1);
  }

  /**
   * Extrae solo el dígito verificador del RUT
   * @param rut RUT completo
   * @returns string
   */
  getRutDv(rut: string): string {
    const cleanRut = this.cleanRut(rut);
    return cleanRut.slice(-1);
  }
} 