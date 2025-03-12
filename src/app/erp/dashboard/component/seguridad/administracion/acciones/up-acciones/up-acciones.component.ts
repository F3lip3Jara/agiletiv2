import { Component } from '@angular/core';
import { AppState } from '../../../../app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { accionesUpdateRequest } from '../../../state/actions/acciones.actions';

@Component({
  selector: 'app-up-acciones',
  templateUrl: './up-acciones.component.html',
  styleUrl: './up-acciones.component.scss'
})
export class UpAccionesComponent {
  acciones: any;
  up: FormGroup;
  opcion: any;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private router: Router
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
    
    this.store.dispatch(accionesUpdateRequest({acciones: parametros}));
  }

  volver() {
    let obj = btoa(JSON.stringify(this.opcion));
    this.router.navigate(['desk/seguridad/administracion/opciones/acciones/' + obj]);
  }

}
