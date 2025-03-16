import { Component } from '@angular/core';
import { AppState } from '../../../../app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { accionesUpdateRequest, accionesUpdateSuccess } from '../../../state/actions/acciones.actions';
import { incrementarRequest } from '../../../../state/actions/estado.actions';
import { ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { Actions } from '@ngrx/effects';
import { accionesError } from '../../../state/actions/acciones.actions';

@Component({
  selector: 'app-up-acciones',
  templateUrl: './up-acciones.component.html',
  styleUrl: './up-acciones.component.scss'
})
export class UpAccionesComponent {
  acciones: any;
  up: FormGroup;
  opcion: any;
  val: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private router: Router,
    private actions$: Actions,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let obj = JSON.parse(atob(params['accion']));
          
      this.acciones = obj.accion;
      this.opcion = obj.opcion;    
      this.up = this.fb.group({
        accDes: [this.acciones.accDes, Validators.required],
        accUrl: [this.acciones.accUrl, Validators.required],
        accetaDes: [this.acciones.accetaDes],
        accType: [this.acciones.accType, Validators.required],
        accMessage: [this.acciones.accMessage, Validators.required]
      });

    });
  }

  guardar(accDes: string, accUrl: string, accetaDes: string, accType: string, accMessage: string) {
    let parametros = {
      accDes: accDes,
      accUrl: accUrl,
      accetaDes: accetaDes,
      accType: accType,
      accMessage: accMessage,
      accId: this.acciones.accId,
      optId: this.opcion.optId
    }
    this.val = true;
    this.store.dispatch(incrementarRequest({request:1}));
    this.store.dispatch(accionesUpdateRequest({acciones: parametros}));

    this.actions$.pipe(
      ofType(accionesUpdateSuccess)
  ).subscribe(() => {    
    
     
      setTimeout(() => {
          this.val = false;
          this.router.navigate(['/desk/seguridad/administracion/opciones/acciones/' + btoa(JSON.stringify(this.opcion))]);
      }, 1000);
  });
  // Suscribirse a la acción de error
  this.actions$.pipe(
      ofType(accionesError)
  ).subscribe((error) => {
      this.val = false;
      this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar la acción'
      });
  });


  }

  volver() {
    let obj = btoa(JSON.stringify(this.opcion));
    this.router.navigate(['desk/seguridad/administracion/opciones/acciones/' + obj]);
  }

}
