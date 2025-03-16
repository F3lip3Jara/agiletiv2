import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserIdleService } from 'angular-user-idle';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from './../erp/service/users.service';
@Component({
  selector: 'app-wait',
  templateUrl: './app.wait.component.html',
  styleUrl: './app.wait.component.scss'
})
export class AppWaitComponent implements OnInit, OnDestroy {
  visible: boolean = false;
  remainingTime: number = 0;
  initialTimeout: number = 0;
  progress: number = 100;
  private timerSubscription: Subscription;
  private timeoutSubscription: Subscription;

  constructor(
    private userIdle: UserIdleService,
    private router: Router,
    private userService: UsersService
  ) {
    // Obtener el valor del timeout configurado
    this.initialTimeout = this.userIdle.getConfigValue().timeout;
  }

  ngOnInit() {
    this.userIdle.startWatching();  
    this.timerSubscription = this.userIdle.onTimerStart().subscribe(count => {
      // Calcular el tiempo restante en segundos
      console.log(count);
      this.remainingTime = this.initialTimeout - count;
      if (!this.visible) {
        this.visible = true;
      }
      // Calcular el progreso como porcentaje del tiempo restante
      this.progress = (this.remainingTime / this.initialTimeout) * 100;

      
    });

    this.timeoutSubscription = this.userIdle.onTimeout().subscribe(() => {
      this.closeModalAndLogout();
    });

  
    
  }

  continueSession() {
    this.userIdle.resetTimer();
    setTimeout(() => {
      this.visible = false;
    }, 100);
  }

  logout() {
    this.closeModalAndLogout();
  }

  private closeModalAndLogout() {
    // Ocultar el modal
    this.visible = false;

    // Detener el monitoreo de inactividad
    this.userIdle.stopWatching();

    // Limpiar todas las suscripciones
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.timeoutSubscription) {
      this.timeoutSubscription.unsubscribe();
    }

    // Reiniciar estados
    this.remainingTime = 0;
    this.progress = 100;
    
    // Limpiar el token y la sesión
    localStorage.removeItem('token');
    localStorage.removeItem('crf');
    localStorage.removeItem('user');
    
        // Navegar al inicio y recargar para limpiar el estado completamente
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.timeoutSubscription) {
      this.timeoutSubscription.unsubscribe();
    }
    this.userIdle.stopWatching();
  //  this.router.navigate(['/login']);
  }
}
