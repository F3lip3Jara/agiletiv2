import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RutValidatorService } from '../service/rut-validator.service';

export function rutValidator(): ValidatorFn {
  const rutValidatorService = new RutValidatorService();
  
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null;
    }

    if (!rutValidatorService.validateRut(value)) {
      return {
        invalidRut: true,
        message: 'El RUT ingresado no es válido'
      };
    }

    return null;
  };
}

export function rutFormatValidator(): ValidatorFn {
  const rutValidatorService = new RutValidatorService();
  
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null;
    }

    // Validar formato básico (12345678-9)
    if (!/^[0-9]{1,8}-[0-9kK]{1}$/.test(value)) {
      return {
        invalidFormat: true,
        message: 'El RUT debe tener el formato 12345678-9'
      };
    }

    return null;
  };
} 