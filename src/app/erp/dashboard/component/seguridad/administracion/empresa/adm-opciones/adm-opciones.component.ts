import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getOpcionesAsignadasRequest, getOpcionesNoAsignadasRequest, createOpcionAsignadaRequest, createOpcionAsignadaSuccess } from '../../../state/actions/empresa.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { selectOpcionesAsignadas, selectOpcionesNoAsignadas } from '../../../state/selectors/empresa.selectors';
import { incrementarRequest } from '../../../../state/actions/estado.actions';
import { Actions, ofType } from '@ngrx/effects';
interface Opcion {
  optId: number;
  optDes: string;
}

@Component({
  selector: 'app-adm-opciones',
  templateUrl: './adm-opciones.component.html',
  styleUrl: './adm-opciones.component.scss'
})
export class AdmOpcionesComponent implements OnInit {

  opcionesAsignadas$: Observable<Opcion[]>;
  opcionesNoAsignadas$: Observable<Opcion[]>;
  opcionesAsignadas: Opcion[] = [];
  opcionesNoAsignadas: Opcion[] = [];
  empresaId: number = 0;
  cambiosPendientes: boolean = false;
  val: boolean = false;
  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private actions$: Actions
  ) {
    this.opcionesAsignadas$ = this.store.select(selectOpcionesAsignadas);
    this.opcionesNoAsignadas$ = this.store.select(selectOpcionesNoAsignadas);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let empresa = atob(params['empresa']);
      this.empresaId = JSON.parse(empresa).empId;
      this.cargarOpciones();
    });

    this.opcionesAsignadas$.subscribe(opciones => {
      this.opcionesAsignadas = [...opciones];
    });

    this.opcionesNoAsignadas$.subscribe(opciones => {
      this.opcionesNoAsignadas = [...opciones];
    });
  }

  cargarOpciones() {
    this.store.dispatch(incrementarRequest({request:1}));
    this.store.dispatch(getOpcionesAsignadasRequest({ id: this.empresaId }));
    this.store.dispatch(getOpcionesNoAsignadasRequest({ id: this.empresaId }));
  }

  onMoveToTarget(event: any) {
    const items = event.items.map((item: Opcion) => ({ ...item }));
    this.cambiosPendientes = true;
  }

  onMoveToSource(event: any) {
    const items = event.items.map((item: Opcion) => ({ ...item }));
      this.cambiosPendientes = true;
   
  }

  restaurarCambios() {
    this.cargarOpciones();
    this.cambiosPendientes = false;
  }

  guardarCambios() {
    this.store.dispatch(incrementarRequest({request:1}));
    this.store.dispatch(createOpcionAsignadaRequest({ empId: this.empresaId, asig: this.opcionesAsignadas }));
    this.actions$.pipe(
      ofType(createOpcionAsignadaSuccess)
      ).subscribe(() => {    
          setTimeout(() => {
              this.val = false;
              this.router.navigate(['/desk/seguridad/administracion/empresa']);
          }, 1000);
      });
  }

  volver() {
    this.router.navigate(['desk/seguridad/administracion/empresa']);
  }
}
