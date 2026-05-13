import { Component, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UsersService } from '../../service/users.service';
import { TotpComponent } from '../totp/totp.component';
import { Usuario } from '../model/usuario.model';
import { Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Environment } from '../../service/environment.service';
import { UserIdleService } from 'angular-user-idle';
import {
    trigger,
    state,
    style,
    transition,
    animate,
    keyframes,
} from '@angular/animations';

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
                animate(
                    '600ms ease-out',
                    style({ transform: 'translateY(0)', opacity: 1 }),
                ),
            ]),
        ]),
        trigger('fadeInDown', [
            transition(':enter', [
                style({ transform: 'translateY(-30px)', opacity: 0 }),
                animate(
                    '500ms ease-out',
                    style({ transform: 'translateY(0)', opacity: 1 }),
                ),
            ]),
        ]),
        trigger('fadeInUp', [
            transition(':enter', [
                style({ transform: 'translateY(30px)', opacity: 0 }),
                animate(
                    '500ms ease-out',
                    style({ transform: 'translateY(0)', opacity: 1 }),
                ),
            ]),
        ]),
        trigger('slideInLeft', [
            transition(':enter', [
                style({ transform: 'translateX(-50px)', opacity: 0 }),
                animate(
                    '400ms ease-out',
                    style({ transform: 'translateX(0)', opacity: 1 }),
                ),
            ]),
        ]),
        trigger('slideInRight', [
            transition(':enter', [
                style({ transform: 'translateX(50px)', opacity: 0 }),
                animate(
                    '400ms ease-out',
                    style({ transform: 'translateX(0)', opacity: 1 }),
                ),
            ]),
        ]),
        trigger('logoFloat', [
            transition(':enter', [
                animate(
                    '2s ease-in-out',
                    keyframes([
                        style({ transform: 'translateY(0px)', offset: 0 }),
                        style({ transform: 'translateY(-8px)', offset: 0.5 }),
                        style({ transform: 'translateY(0px)', offset: 1 }),
                    ]),
                ),
            ]),
        ]),
    ],
})
export class LoginComponent {
    @ViewChild('totpComponent') totpComponent!: TotpComponent;

    valCheck: string[] = ['remember'];
    enabled = false;
    password!: string;
    username: string = '';
    isLoading = false;
    loginSuccess = false;
    shakeAnimation = false;
    showFieldError = false;
    validateTotp = false;

    constructor(
        public layoutService: LayoutService,
        private userService: UsersService,
        private router: Router,
        private messageService: MessageService,
        private environment: Environment,
        private userIdle: UserIdleService,
    ) {}

    login(userx: string) {
        // console.log('validateTotp' + this.validateTotp);
        if (this.validateTotp === false) {
            this.showFieldError = false;

            if (!this.password || (userx.length === 0 && !this.validateTotp)) {
                this.showError('Por favor completa todos los campos');
                this.showFieldError = true;
                this.triggerShake();
                console.log(
                    'Por favor completa todos los campos' + this.validateTotp,
                );
                return;
            }

            this.isLoading = true;
            this.enabled = true;

            const user = new Usuario(1, '', this.password, '', userx);
            this.userService.login(user).subscribe(
                async (data: any) => {
                    try {
                        if (data.error == 0) {
                            const {
                                reinicio,
                                token,
                                crf,
                                menu,
                                rol,
                                name,
                                img,
                                empresa,
                                error,
                                id,
                                empNom,
                                empApe,
                                empTiempoIdle,
                                empTiempoTimeout,
                            } = data;
                            this.userService.setToken(token);
                            this.userService.setTokenCrf(crf);
                            this.userService.setUsuario(
                                name,
                                rol,
                                menu,
                                img,
                                empresa,
                                '',
                                empNom,
                                empApe,
                                data.keygoogleMap,
                                data.openWeatherApiKey,
                                empTiempoIdle,
                                empTiempoTimeout,
                            );
                            this.loginSuccess = true;

                            const continueLogin = () => {
                                //Actualizo las key de api
                                this.environment.keygoogleMap =
                                    data.keygoogleMap;
                                this.environment.keygoogle = data.keygoogleMap;
                                this.environment.openWeatherApiKey =
                                    data.openWeatherApiKey;

                                // Configurar inactividad dinámicamente según la Empresa
                                if (empTiempoIdle && empTiempoTimeout) {
                                    this.userIdle.setConfigValues({
                                        idle: empTiempoIdle,
                                        timeout: empTiempoTimeout,
                                        ping: 120,
                                    });
                                }

                                // Simular delay para mostrar la animación de éxito
                                setTimeout(() => {
                                    this.router.navigate(['/desk']);
                                    this.enabled = false;
                                    this.isLoading = false;

                                    if (reinicio === 'S') {
                                        this.router.navigate([
                                            '/auth/reinicio',
                                        ]);
                                    }
                                }, 1500);
                            };

                            // Obtener cookie CSRF de Sanctum para peticiones posteriores
                            this.userService.getCsrfCookie().subscribe({
                                next: () => {
                                    this.showSuccess(`¡Bienvenido ${name}!`);
                                    continueLogin();
                                },
                                error: () => {
                                    this.showSuccess(`¡Bienvenido ${name}!`);
                                    continueLogin();
                                },
                            });
                        } else {
                            this.showError(
                                'Credenciales incorrectas. Por favor verifica tu usuario y contraseña.',
                            );
                            this.showFieldError = true;
                            this.triggerShake();
                            this.enabled = false;
                            this.isLoading = false;
                        }
                    } catch {
                        this.showError(
                            'Error de conexión. Por favor intenta nuevamente.',
                        );
                        this.showFieldError = true;
                        this.triggerShake();
                        this.enabled = false;
                        this.isLoading = false;
                    }
                },
                async (error) => {
                    this.showError(
                        'Error de conexión. Por favor verifica tu conexión a internet.',
                    );
                    this.showFieldError = true;
                    this.triggerShake();
                    this.enabled = false;
                    this.isLoading = false;
                },
            );
        }
    }

    showSuccess(message: string) {
        this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: message,
            life: 3000,
        });
    }

    showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 4000,
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

    // TOTP Event Handlers
    onTotpSuccess() {
        this.showSuccess('¡Autenticación TOTP exitosa!');
        // Proceder con login normal después de TOTP exitoso
        this.login(this.username);
    }

    onTotpCancel() {
        // No hacer nada, solo cerrar el modal
    }
}
