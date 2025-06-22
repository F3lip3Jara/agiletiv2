import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UsersService } from '../../service/users.service';
import {Usuario} from '../model/usuario.model';
import { Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false,
    providers: [MessageService],
    animations: [
        trigger('slideInUp', [
            transition(':enter', [
                style({ transform: 'translateY(50px)', opacity: 0 }),
                animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
            ])
        ]),
        trigger('fadeInDown', [
            transition(':enter', [
                style({ transform: 'translateY(-30px)', opacity: 0 }),
                animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
            ])
        ]),
        trigger('fadeInUp', [
            transition(':enter', [
                style({ transform: 'translateY(30px)', opacity: 0 }),
                animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
            ])
        ]),
        trigger('slideInLeft', [
            transition(':enter', [
                style({ transform: 'translateX(-50px)', opacity: 0 }),
                animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
            ])
        ]),
        trigger('slideInRight', [
            transition(':enter', [
                style({ transform: 'translateX(50px)', opacity: 0 }),
                animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
            ])
        ]),
        trigger('logoFloat', [
            transition(':enter', [
                animate('2s ease-in-out', keyframes([
                    style({ transform: 'translateY(0px)', offset: 0 }),
                    style({ transform: 'translateY(-8px)', offset: 0.5 }),
                    style({ transform: 'translateY(0px)', offset: 1 })
                ]))
            ])
        ])
    ]
})
export class LoginComponent {
    valCheck: string[] = ['remember'];
    enabled = false;
    password!: string;
    username: string = '';
    isLoading = false;
    loginSuccess = false;
    shakeAnimation = false;
    showFieldError = false;

    constructor(
        public layoutService: LayoutService,
        private userService: UsersService,
        private router: Router,
        private messageService: MessageService
    ) {}

    login(userx: string) {
        this.showFieldError = false;
        
        if (!this.password || userx.length === 0) {
            this.showError('Por favor completa todos los campos');
            this.showFieldError = true;
            this.triggerShake();
            return;
        }

        this.isLoading = true;
        this.enabled = true;
        
        const user = new Usuario(1, '', this.password, '', userx);
        this.userService.login(user).subscribe(
            async (data: any) => {
                try {
                    if (data.error == 0) {
                        const { reinicio, token, crf, menu, rol, name, img, empresa, error, id, empNom, empApe } = data;
                        this.userService.setToken(token);
                        this.userService.setTokenCrf(crf);
                        this.userService.setUsuario(name, rol, menu, img, empresa, '', empNom, empApe);
                        
                        this.loginSuccess = true;
                        this.showSuccess(`¡Bienvenido ${name}!`);
                        
                        // Simular delay para mostrar la animación de éxito
                        setTimeout(() => {
                            this.router.navigate(['/desk']);
                            this.enabled = false;
                            this.isLoading = false;

                            if (reinicio === 'S') {
                                this.router.navigate(['/auth/login/cambiopass']);
                            }
                        }, 1500);
                    } else {
                        this.showError('Credenciales incorrectas. Por favor verifica tu usuario y contraseña.');
                        this.showFieldError = true;
                        this.triggerShake();
                        this.enabled = false;
                        this.isLoading = false;
                    }
                } catch {
                    this.showError('Error de conexión. Por favor intenta nuevamente.');
                    this.showFieldError = true;
                    this.triggerShake();
                    this.enabled = false;
                    this.isLoading = false;
                }
            },
            async (error) => {
                this.showError('Error de conexión. Por favor verifica tu conexión a internet.');
                this.showFieldError = true;
                this.triggerShake();
                this.enabled = false;
                this.isLoading = false;
            }
        );
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

    triggerShake() {
        this.shakeAnimation = true;
        setTimeout(() => {
            this.shakeAnimation = false;
        }, 500);
    }

    onKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.login(this.username);
        }
    }
}
