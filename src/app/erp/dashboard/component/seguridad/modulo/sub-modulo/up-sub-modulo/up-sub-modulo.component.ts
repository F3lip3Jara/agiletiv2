import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { AppState } from '../../../../app.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { 
  getOpcionesNoAsignadasSubModuloByIdRequest,
  getOpcionesNoAsignadasSubModuloByIdSuccess,
  getOpcionesAsignadasSubModuloByIdRequest,
  getOpcionesAsignadasSubModuloByIdSuccess,
  updateSubModuloRequest,
  updateSubModuloSuccess
} from '../../../state/actions/submodulo.actions';
import { take } from 'rxjs/operators';
import { SubModulo } from '../../../state/interface/submodulo.interface';
import { incrementarRequest } from '../../../../state/actions/estado.actions';

@Component({
  selector: 'app-up-sub-modulo',
  templateUrl: './up-sub-modulo.component.html',
  styleUrl: './up-sub-modulo.component.scss'
})
export class UpSubModuloComponent implements OnInit {
  upd: FormGroup;
  submodulo: any;
  modulo: any;
  sourceOpciones: any[] = [];
  targetOpciones: any[] = [];
  loading: boolean = false;
  cambiosPendientes: boolean = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private actions$: Actions
  ) {
    this.initForm();
  }

  private initForm() {
    this.upd = this.fb.group({
      molsDes: ['', Validators.required],
      molId: [''],
      molsId: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let data = JSON.parse(atob(params['submodulo']));
      this.modulo = data.modulo;
      this.submodulo = data.submodulo;
      this.upd.setValue({
        molsDes: this.submodulo.molsDes,
        molId: this.submodulo.molId,
        molsId: this.submodulo.molsId
      });
      this.loadOpciones();
    });
  }

  loadOpciones() {
    this.store.dispatch(incrementarRequest({request: 2})); 

    if (this.submodulo?.molId) {
      // Cargar opciones no asignadas
      this.store.dispatch(getOpcionesNoAsignadasSubModuloByIdRequest({modulo: this.modulo}));
      this.actions$.pipe(
        ofType(getOpcionesNoAsignadasSubModuloByIdSuccess),
        take(1)
      ).subscribe((noAsignadas) => {
        this.sourceOpciones = [...noAsignadas.opciones].map(opcion => ({
          ...opcion
        }));
      });

      // Cargar opciones asignadas      
      this.store.dispatch(getOpcionesAsignadasSubModuloByIdRequest({modulo: this.modulo, molsId: this.submodulo.molsId}));
      this.actions$.pipe(
        ofType(getOpcionesAsignadasSubModuloByIdSuccess),
        take(1)
      ).subscribe((asignadas) => {
        this.targetOpciones = [...asignadas.opciones].map(opcion => ({
          ...opcion
        }));
      });
    }
  }

  trackByOpcionId(index: number, item: any): number {
    return item.optId;
  }

  onMoveToTarget(event: any) {
    this.cambiosPendientes = true;
    this.sourceOpciones = [...event.source];
    this.targetOpciones = [...event.target];
  }

  onMoveToSource(event: any) {
    this.cambiosPendientes = true;
    this.sourceOpciones = [...event.source];
    this.targetOpciones = [...event.target];
  }

  onMoveAllToTarget(event: any) {
    this.cambiosPendientes = true;
    this.sourceOpciones = [];
    this.targetOpciones = [...this.sourceOpciones, ...this.targetOpciones];
  }

  onMoveAllToSource(event: any) {
    this.cambiosPendientes = true;
    this.sourceOpciones = [...this.sourceOpciones, ...this.targetOpciones];
    this.targetOpciones = [];
  }

  volver() {
    const dato = btoa(JSON.stringify(this.modulo));    
    this.router.navigate(['desk/seguridad/modulos/submodulos/'+ dato]);
  }

  restaurarCambios() {
    this.initForm();
    if (this.submodulo) {
      this.upd.patchValue({
        molsDes: this.submodulo.molsDes,
        molId: this.submodulo.molId
      });
    }
    this.loadOpciones();
    this.cambiosPendientes = false;
  }

  actualizarSubModulo(molsDes: string, opt: any[]) {
    this.loading = true;
    
    const submodulo: SubModulo = {
      molsId: this.submodulo.molsId,
      molId: this.submodulo.molId,
      molsDes: molsDes,
      empId: this.submodulo.empId,
      opt: opt,
      modulo: this.modulo
    };

    this.store.dispatch(updateSubModuloRequest({submodulo}));

    this.actions$.pipe(
      ofType(updateSubModuloSuccess),
      take(1)
    ).subscribe(() => {
      this.loading = false;
      this.cambiosPendientes = false;
      this.volver();
    });
  }
}
