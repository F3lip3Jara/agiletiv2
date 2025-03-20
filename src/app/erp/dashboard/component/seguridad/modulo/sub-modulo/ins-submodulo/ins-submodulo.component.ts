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
  createSubModuloRequest,
  createSubModuloSuccess
} from '../../../state/actions/submodulo.actions';
import { take } from 'rxjs/operators';
import { SubModulo } from '../../../state/interface/submodulo.interface';

@Component({
  selector: 'app-ins-submodulo',
  templateUrl: './ins-submodulo.component.html',
  styleUrl: './ins-submodulo.component.scss'
})
export class InsSubmoduloComponent implements OnInit {
  ins: FormGroup;
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
    this.ins = this.fb.group({
      molsDes: ['', Validators.required],
      molId: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.modulo = JSON.parse(atob(params['modulo']));
      console.log(this.modulo);
      if (this.modulo) {
        this.ins.patchValue({
          molId: this.modulo.molId
        });
      }
      this.loadOpciones();
    });
  }

  loadOpciones() {
    if (this.modulo?.molId) {
      this.store.dispatch(getOpcionesNoAsignadasSubModuloByIdRequest({modulo: this.modulo}));
      this.actions$.pipe(
        ofType(getOpcionesNoAsignadasSubModuloByIdSuccess),
        take(1)
      ).subscribe((noAsignadas) => {
        this.sourceOpciones = [...noAsignadas.opciones].map(opcion => ({
          ...opcion,
          isSubmodulo: false
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
    this.targetOpciones = [];
    this.loadOpciones();
    this.cambiosPendientes = false;
  }

  guardarSubModulo(molsDes: string, opt: any[]) {
    this.loading = true;
    
    const submodulo: SubModulo = {
      molsId: 0,
      molId: this.modulo.molId,
      molsDes: molsDes,
      empId: this.modulo.empId,
      opt: opt,
      modulo: this.modulo
    };
    this.store.dispatch(createSubModuloRequest({submodulo}));

    this.actions$.pipe(
      ofType(createSubModuloSuccess),
      take(1)
    ).subscribe(() => {
      this.loading = false;
      this.volver();
    });
  }
}
