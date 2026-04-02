import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TotpService, TotpSetupResponse } from '../../service/totp.service';
import { MessageService } from 'primeng/api';
import { OtpInputComponent } from './otp-input/otp-input.component';
import { UsersService } from '../../service/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-totp',
  templateUrl: './totp.component.html',
  styleUrls: ['./totp.component.scss'],
  standalone: false,
  providers: [MessageService]
})
export class TotpComponent implements AfterViewInit {
  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('otpInput') otpInput!: OtpInputComponent;
  @Input() username: string = '';
  @Output() totpSuccess = new EventEmitter<boolean>();
  @Output() totpCancel = new EventEmitter<void>();

  // TOTP properties
  showTotpModal = false;
  totpCode = '';
  qrCodeUrl = '';
  totpSecret = '';
  isTotpSetup = false;
  isTotpVerification = false;
  totpLoading = false;
  backupCodes: string[] = [];
  showUsernameInput = false;
  tempUsername = '';
  currentStep = 1;
  totalSteps = 4;
  stepTitle = '';
  stepDescription = '';
  resources: any;

  constructor(
    private totpService: TotpService,
    private messageService: MessageService,
    private userService: UsersService,
    private router: Router,
  ) {}

  ngAfterViewInit() {
    // El focus se manejará en openTotpModal
  }

  // Método público para abrir el modal TOTP
  openTotpModal() {
    // Reiniciar completamente el estado
    this.resetTotpState();
    
    this.showTotpModal = true;
    this.totpCode = '';
    this.tempUsername = this.username || '';
    this.showUsernameInput = !this.username || this.username.trim() === '';
    this.currentStep = 1;
    this.isTotpSetup = false;
    this.isTotpVerification = false;
    this.totpLoading = false;
    this.qrCodeUrl = '';
    this.totpSecret = '';
    this.backupCodes = [];
    
    this.updateStepInfo();
    
    // Focus en el input de usuario después de que se abra el modal
    setTimeout(() => {
      if (this.showUsernameInput && this.usernameInput) {
        this.usernameInput.nativeElement.focus();
      }
    }, 100);
  }

  // Método público para cerrar el modal
  closeTotpModal() {
    this.showTotpModal = false;
    this.resetTotpState();
    this.qrCodeUrl = '';
    this.totpSecret = '';
    this.totpLoading = false;
    this.backupCodes = [];
  }

  // Iniciar flujo TOTP
  async initTotpFlow() {
    const currentUsername = this.tempUsername || this.username;
    
    if (!currentUsername || currentUsername.trim() === '') {
      this.showError('Por favor ingresa tu usuario');
      return;
    }

    // Convertir a mayúsculas
    this.tempUsername = currentUsername.toUpperCase();
    this.username = this.tempUsername;
    this.showUsernameInput = false;
    this.currentStep = 2;
    this.updateStepInfo();
    this.totpLoading = true;

    try {
      // Verificar si el usuario ya tiene TOTP configurado
      const statusResponse = await this.totpService.checkTotpStatus(currentUsername).toPromise();
      
      if (statusResponse?.hasTotp) {
        // Usuario ya tiene TOTP configurado, mostrar solo verificación
        this.isTotpSetup = false;
        this.isTotpVerification = true;
        this.totpCode = '';
        this.currentStep = 4;
        this.updateStepInfo();
      } else {
            // Usuario no tiene TOTP, mostrar configuración
            this.isTotpSetup = true;
            this.isTotpVerification = false;
            this.currentStep = 2;
            this.updateStepInfo();
            await this.setupTotp();
            
            // Enfocar el input OTP cuando se muestre
            setTimeout(() => {
              if (this.otpInput) {
                this.otpInput.focus();
              }
            }, 200);
      }
    } catch (error) {
      // Para la maqueta, simular respuestas
      this.simulateTotpFlow(currentUsername);
    } finally {
      this.totpLoading = false;
    }
  }

  // Simular flujo TOTP para la maqueta
  private simulateTotpFlow(username: string) {
    // Simular que el usuario no tiene TOTP configurado
    this.isTotpSetup = true;
    this.isTotpVerification = false;
    this.totpCode = '';
    this.username = username;
    
    // Generar datos simulados
    this.qrCodeUrl = this.generateMockQRCode();
    this.totpSecret = 'JBSWY3DPEHPK3PXP';
    this.backupCodes = ['ABC12345', 'DEF67890', 'GHI11111', 'JKL22222', 'MNO33333', 'PQR44444', 'STU55555', 'VWX66666'];
  }

  // Generar código QR simulado
  private generateMockQRCode(): string {
    // Generar un SVG simple como código QR simulado
    const qrSvg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="10" y="10" width="20" height="20" fill="black"/>
        <rect x="40" y="10" width="20" height="20" fill="black"/>
        <rect x="70" y="10" width="20" height="20" fill="black"/>
        <rect x="100" y="10" width="20" height="20" fill="black"/>
        <rect x="130" y="10" width="20" height="20" fill="black"/>
        <rect x="160" y="10" width="20" height="20" fill="black"/>
        <rect x="10" y="40" width="20" height="20" fill="black"/>
        <rect x="40" y="40" width="20" height="20" fill="white"/>
        <rect x="70" y="40" width="20" height="20" fill="black"/>
        <rect x="100" y="40" width="20" height="20" fill="white"/>
        <rect x="130" y="40" width="20" height="20" fill="black"/>
        <rect x="160" y="40" width="20" height="20" fill="white"/>
        <rect x="10" y="70" width="20" height="20" fill="black"/>
        <rect x="40" y="70" width="20" height="20" fill="black"/>
        <rect x="70" y="70" width="20" height="20" fill="white"/>
        <rect x="100" y="70" width="20" height="20" fill="black"/>
        <rect x="130" y="70" width="20" height="20" fill="white"/>
        <rect x="160" y="70" width="20" height="20" fill="black"/>
        <rect x="10" y="100" width="20" height="20" fill="black"/>
        <rect x="40" y="100" width="20" height="20" fill="white"/>
        <rect x="70" y="100" width="20" height="20" fill="black"/>
        <rect x="100" y="100" width="20" height="20" fill="white"/>
        <rect x="130" y="100" width="20" height="20" fill="black"/>
        <rect x="160" y="100" width="20" height="20" fill="white"/>
        <rect x="10" y="130" width="20" height="20" fill="black"/>
        <rect x="40" y="130" width="20" height="20" fill="black"/>
        <rect x="70" y="130" width="20" height="20" fill="white"/>
        <rect x="100" y="130" width="20" height="20" fill="black"/>
        <rect x="130" y="130" width="20" height="20" fill="white"/>
        <rect x="160" y="130" width="20" height="20" fill="black"/>
        <rect x="10" y="160" width="20" height="20" fill="black"/>
        <rect x="40" y="160" width="20" height="20" fill="white"/>
        <rect x="70" y="160" width="20" height="20" fill="black"/>
        <rect x="100" y="160" width="20" height="20" fill="white"/>
        <rect x="130" y="160" width="20" height="20" fill="black"/>
        <rect x="160" y="160" width="20" height="20" fill="white"/>
        <text x="100" y="190" text-anchor="middle" font-family="Arial" font-size="12" fill="black">Código QR Simulado</text>
      </svg>
    `;
    
    return 'data:image/svg+xml;base64,' + btoa(qrSvg);
  }

  async setupTotp() {
    try {
      const response = await this.totpService.setupTotp(this.username).toPromise();
      
      console.log(response);
      if (response) {
        this.qrCodeUrl = response.qrCode;
        this.totpSecret = response.secret;
        this.backupCodes = response.backupCodes;
      }
    } catch (error) {
      // Para la maqueta, usar datos simulados
      this.qrCodeUrl = this.generateMockQRCode();
      this.totpSecret = 'JBSWY3DPEHPK3PXP';
      this.backupCodes = ['ABC12345', 'DEF67890', 'GHI11111', 'JKL22222', 'MNO33333', 'PQR44444', 'STU55555', 'VWX66666'];
    }
  }

  async verifyTotpCode() {
    if (!this.totpCode || this.totpCode.length !== 6) {
      this.showError('Por favor ingresa un código de 6 dígitos');
      return;
    }

    this.totpLoading = true;
    this.currentStep = 4;
    this.updateStepInfo();

    try {
      // Verificar con API real
      const response = await this.totpService.verifyTotp(this.username, this.totpCode, this.resources).toPromise();
      
      if (response?.success) {
        this.showSuccess('¡Autenticación TOTP exitosa!');
        this.totpSuccess.emit(true);
        this.resetTotpState();
        this.closeTotpModal();
        this.loginSuccess(response.resources);



      } else {
        this.showError(response?.message || 'Código TOTP inválido');
        this.resetTotpState();
      }
    } catch (error) {
      console.error('Error en verificación TOTP:', error);
      
      // Fallback para demostración
         } finally {
      this.totpLoading = false;
    }
  }

  // Método para reiniciar el estado del TOTP
  private resetTotpState() {
    this.totpCode = '';
    this.currentStep = 1;
    this.isTotpSetup = false;
    this.isTotpVerification = false;
    this.showUsernameInput = false;
    this.tempUsername = '';
    
    // Limpiar el input OTP si existe
    if (this.otpInput) {
      this.otpInput.clear();
    }
  }

  // Actualizar información del paso actual
  updateStepInfo() {
    if (this.showUsernameInput) {
      this.stepTitle = 'Paso 1 de 4: Ingresa tu Usuario';
      this.stepDescription = 'Ingresa tu nombre de usuario para configurar la autenticación de dos factores';
    } else if (this.isTotpSetup && this.currentStep === 2) {
      this.stepTitle = 'Paso 2 de 4: Escanea el Código QR';
      this.stepDescription = 'Abre tu aplicación autenticadora y escanea este código QR';
    } else if (this.isTotpSetup && this.currentStep === 3) {
      this.stepTitle = 'Paso 3 de 4: Verifica tu Código';
      this.stepDescription = 'Ingresa el código de 6 dígitos que aparece en tu aplicación';
    } else if (this.isTotpVerification) {
      this.stepTitle = 'Paso 4 de 4: Verifica tu Código';
      this.stepDescription = 'Ingresa el código de 6 dígitos de tu aplicación autenticadora';
    }
  }

  // Avanzar al siguiente paso
  nextStep() {
    if (this.isTotpSetup && this.currentStep < 3) {
      this.currentStep++;
      this.updateStepInfo();
      
      // Enfocar el input OTP cuando se llegue al paso de verificación
      if (this.currentStep === 3) {
        setTimeout(() => {
          if (this.otpInput) {
            this.otpInput.focus();
          }
        }, 200);
      }
    }
  }

  // Retroceder al paso anterior
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepInfo();
    }
  }

  // Manejar cambio en el input de usuario
  onUsernameChange() {
    this.tempUsername = this.tempUsername.toUpperCase();
  }

  onTotpCodeChange(value: string) {
    this.totpCode = value;
  }

  onTotpCodeComplete(value: string) {
    this.totpCode = value;
    // No auto-verificar, dejar que el usuario controle la verificación
    // Solo actualizar el estado del botón de verificación
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess('Código copiado al portapapeles');
    }).catch(() => {
      this.showError('Error al copiar el código');
    });
  }

  onCancel() {
    this.totpCancel.emit();
    this.closeTotpModal();
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: '¡Éxito!',
      detail: message,
      life: 3000
    });
  }

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 4000
    });
  }

  loginSuccess(resources: any) {
    if (resources.error == 0) {
        const { reinicio, token, crf, menu, rol, name, img, empresa, error, id, empNom, empApe } = resources;
        this.userService.setToken(token);
        this.userService.setTokenCrf(crf);
        this.userService.setUsuario(name, rol, menu, img, empresa, '', empNom, empApe);        
       
        this.showSuccess(`¡Bienvenido ${name}!`);
        
        // Simular delay para mostrar la animación de éxito
        setTimeout(() => {
            this.router.navigate(['/desk']);
            if (reinicio === 'S') {
                this.router.navigate(['/auth/login/cambiopass']);
            }
        }, 1500);
    } else {
        this.showError('Credenciales incorrectas. Por favor verifica tu usuario y contraseña.');
    
    }
  }
}
