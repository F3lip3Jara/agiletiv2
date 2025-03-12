import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, interval, map, Observable, of, takeWhile } from 'rxjs';
import { Estado } from 'src/app/erp/dashboard/component/state/interface/estado.interface';
import { selectEstado } from 'src/app/erp/dashboard/component/state/selectors/estado.selectors';

@Component({
  selector: 'app-progreso',
  templateUrl: './progreso.component.html',
  styleUrls: ['./progreso.component.css']
})
export class ProgresoComponent implements OnInit {
 
  progreso$: Observable<number>;
  isLoading$: Observable<boolean>;
  progres: number = 0;

  constructor(private store: Store<{ estado: Estado }>) {}

  ngOnInit(): void {

    this.store.select(state => state.estado).subscribe((estado: any) => {      
    this.isLoading$ = estado.estado.loading;
    const totalRequest = estado.estado.resquest + estado.estado.response;
    this.progreso$= totalRequest === 0 ? of(0) : of((estado.estado.resquest / totalRequest) * 100);
    // Animar la barra de progreso de 1 en 1 hasta el valor real
    this.progreso$.subscribe(targetProgreso => {
     
      if (targetProgreso <= 0) {
        this.progres = 0; // Reiniciar cuando no haya requests
        return;
      }

      interval(120).pipe(
        takeWhile(() => this.progres< targetProgreso)
      ).subscribe(() => this.progres++);

      

      // Si se llega al 100%, reiniciar después de un tiempo
      if (targetProgreso === 100) {
        setTimeout(() => this.progres = 0, 1500);
      }
      });
    });
  }
}
