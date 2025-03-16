import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UsersService } from '../../../service/users.service';
import { RestService } from '../../../dashboard/service/rest.service';
@Component({
  selector: 'app-cambiodepass',
  templateUrl: './cambiodepass.component.html',
  styleUrls: ['./cambiodepass.component.scss'],
  providers: []
})
export class CambiodepassComponent implements OnInit {
  
  changePasswordForm: FormGroup;
  loading = false;
  passwordsMatch = true;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private router: Router,
    private messageService: MessageService,
    private rest : RestService
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Verificar si el usuario está autenticado
    if (!this.userService.getToken()) {
      this.router.navigate(['/auth/login']);
    }
  }

  // Validadores simples
  hasMinLength(password: string): boolean {
    return password && password.length >= 8;
  }

  hasUpperCase(password: string): boolean {
    return password && /[A-Z]/.test(password);
  }

  hasNumber(password: string): boolean {
    return password && /[0-9]/.test(password);
  }

  // Validador de coincidencia de contraseñas
  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  getPasswordStrength(): number {
    const password = this.changePasswordForm.get('newPassword')?.value || '';
    let strength = 0;
    if (this.hasMinLength(password)) strength++;
    if (this.hasUpperCase(password)) strength++;
    if (this.hasNumber(password)) strength++;
    return strength;
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 1) return 'Débil';
    if (strength === 2) return 'Media';
    return 'Fuerte';
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 1) return 'weak';
    if (strength === 2) return 'medium';
    return 'strong';
  }

  onSubmit() {
    if (this.changePasswordForm.valid && !this.loading) {
      this.loading = true;
      const data = {
        currentPassword: this.changePasswordForm.get('currentPassword')?.value,
        newPassword: this.changePasswordForm.get('newPassword')?.value,
      };
      let auth = {'Authentication':btoa(JSON.stringify(data))};
      // Aquí deberías llamar a tu servicio de actualización de contraseña
      this.rest.post('cambiarPassword', this.userService.getToken(), auth).subscribe(
        (response: any) => {
       //   console.log(response);
          this.loading = false;
          if (response.type == 'success') {
            this.messageService.add({
              severity: 'success',
              summary: '¡Éxito!',
              detail: 'Tu contraseña ha sido actualizada correctamente'
            });
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 1500);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message || 'Error al actualizar la contraseña'
            });
          }
        },
        (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al conectar con el servidor'
          });
        }
      );
    }
  }
}
