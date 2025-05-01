import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly SECRET_KEY = 'your-secret-key'; // Reemplazar con tu clave secreta

  constructor() { }

  /**
   * Encripta un valor
   * @param value Valor a encriptar
   * @returns string
   */
  encrypt(value: string | number): string {
    return CryptoJS.AES.encrypt(value.toString(), this.SECRET_KEY).toString();
  }

  /**
   * Desencripta un valor
   * @param encryptedValue Valor encriptado
   * @returns string
   */
  decrypt(encryptedValue: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, this.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
} 