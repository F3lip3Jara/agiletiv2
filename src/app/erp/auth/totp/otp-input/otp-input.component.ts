import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true
    }
  ]
})
export class OtpInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() length: number = 6;
  @Input() onlyNumbers: boolean = true;
  @Input() disabled: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  
  @Output() valueChange = new EventEmitter<string>();
  @Output() complete = new EventEmitter<string>();

  otpValues: string[] = [];
  private onChange = (value: string) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.otpValues = new Array(this.length).fill('');
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  onInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    
    // Si solo números, filtrar caracteres no numéricos
    if (this.onlyNumbers) {
      value = value.replace(/[^0-9]/g, '');
    }

    // Tomar solo el último carácter
    const inputValue = value.slice(-1);
    
    // Actualizar el valor en el array
    this.otpValues[index] = inputValue;
    
    // Actualizar el valor del input para evitar acumulación
    input.value = inputValue;

    // Mover al siguiente input si se ingresó un valor
    if (inputValue && index < this.length - 1) {
      setTimeout(() => {
        const nextInput = document.querySelector(`#otp-input-${index + 1}`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
          // Limpiar el valor del siguiente input para evitar sugerencias
          nextInput.value = '';
        }
      }, 0);
    }

    this.updateValue();
  }

  onFocus(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    // Limpiar el campo cuando se enfoque para evitar sugerencias
    if (input.value && !this.otpValues[index]) {
      input.value = '';
    }
    this.onTouched();
  }

  // Método para manejar Backspace de manera más fluida
  private handleBackspace(index: number) {
    if (this.otpValues[index]) {
      // Si el campo actual tiene valor, limpiarlo y ir al anterior
      this.otpValues[index] = '';
      const input = document.querySelector(`#otp-input-${index}`) as HTMLInputElement;
      if (input) {
        input.value = '';
      }
      
      // Ir al campo anterior después de borrar
      if (index > 0) {
        setTimeout(() => {
          const prevInput = document.querySelector(`#otp-input-${index - 1}`) as HTMLInputElement;
          if (prevInput) {
            prevInput.focus();
          }
        }, 0);
      }
      
      this.updateValue();
    } else if (index > 0) {
      // Si el campo actual está vacío, ir al anterior y limpiarlo
      const prevIndex = index - 1;
      this.otpValues[prevIndex] = '';
      const prevInput = document.querySelector(`#otp-input-${prevIndex}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.value = '';
        prevInput.focus();
      }
      this.updateValue();
    } else {
      // Si estamos en el primer campo y está vacío, limpiar todo
      this.clear();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    // Manejar Backspace
    if (event.key === 'Backspace') {
      event.preventDefault();
      this.handleBackspace(index);
      return;
    }

    // Manejar Ctrl+A + Backspace para borrar todo
    if (event.key === 'Backspace' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.clear();
      return;
    }

    // Manejar flechas
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      const prevInput = document.querySelector(`#otp-input-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
      return;
    }

    if (event.key === 'ArrowRight' && index < this.length - 1) {
      event.preventDefault();
      const nextInput = document.querySelector(`#otp-input-${index + 1}`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
      return;
    }

    // Si es solo números, solo permitir dígitos
    if (this.onlyNumbers && !/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    
    // Filtrar datos según el tipo permitido
    let cleanData = pastedData;
    if (this.onlyNumbers) {
      cleanData = pastedData.replace(/[^0-9]/g, '');
    }

    // Llenar los inputs con los datos pegados
    for (let i = 0; i < Math.min(cleanData.length, this.length); i++) {
      this.otpValues[i] = cleanData[i];
    }

    // Enfocar el último input llenado o el siguiente vacío
    const lastFilledIndex = Math.min(cleanData.length - 1, this.length - 1);
    const nextEmptyIndex = this.otpValues.findIndex(val => !val);
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : lastFilledIndex;
    
    setTimeout(() => {
      const input = document.querySelector(`#otp-input-${focusIndex}`) as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 0);

    this.updateValue();
  }

  private updateValue() {
    const value = this.otpValues.join('');
    this.onChange(value);
    this.valueChange.emit(value);
    
    if (value.length === this.length) {
      this.complete.emit(value);
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    if (value) {
      const values = value.split('').slice(0, this.length);
      this.otpValues = [...values, ...new Array(this.length - values.length).fill('')];
    } else {
      this.otpValues = new Array(this.length).fill('');
    }
    
    // Sincronizar los inputs del DOM
    setTimeout(() => {
      this.otpValues.forEach((val, index) => {
        const input = document.querySelector(`#otp-input-${index}`) as HTMLInputElement;
        if (input) {
          input.value = val;
        }
      });
    }, 0);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Método para limpiar todos los inputs
  clear() {
    this.otpValues = new Array(this.length).fill('');
    
    // Limpiar también los inputs del DOM
    setTimeout(() => {
      for (let i = 0; i < this.length; i++) {
        const input = document.querySelector(`#otp-input-${i}`) as HTMLInputElement;
        if (input) {
          input.value = '';
        }
      }
    }, 0);
    
    this.updateValue();
  }

  // Método para enfocar el primer input
  focus() {
    setTimeout(() => {
      const firstInput = document.querySelector('#otp-input-0') as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
        firstInput.select();
      }
    }, 100);
  }

  // Método para enfocar automáticamente al mostrar el componente
  ngAfterViewInit() {
    // Enfocar automáticamente cuando el componente se inicializa
    this.focus();
  }
}
