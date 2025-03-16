import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { Router } from '@angular/router';
import { 
  getOpcionesNoAsignadasModuloByIdRequest, 
  getOpcionesNoAsignadasModuloByIdSuccess, 
  getRolesNoAsignadasModuloByIdRequest, 
  getRolesNoAsignadasModuloByIdSuccess,
  moduloError,
  createModuloRequest,
  createModuloSuccess
} from '../../state/actions/modulo.actions';
import { incrementarRequest } from '../../../state/actions/estado.actions';

@Component({
  selector: 'app-ins-modulo', 
  templateUrl: './ins-modulo.component.html',
  styleUrl: './ins-modulo.component.scss'
})
export class InsModuloComponent implements OnInit {
  ins: FormGroup;
  sourceOpciones: any[] = [];
  targetOpciones: any[] = [];
  sourceRoles: any[] = [];
  targetRoles: any[] = [];
  showIconDialog: boolean = false;
  selectedIcon: string = 'pi pi-star';
  loading: boolean = false;
  cambiosPendientes: boolean = false;
  
  // Lista de iconos de PrimeIcons
  primeIcons: string[] = [
    'pi pi-home', 'pi pi-user', 'pi pi-users', 'pi pi-cog', 'pi pi-wrench',
    'pi pi-calendar', 'pi pi-clock', 'pi pi-inbox', 'pi pi-shield',
    'pi pi-chart-bar', 'pi pi-dollar', 'pi pi-database', 'pi pi-file',
    'pi pi-folder', 'pi pi-images', 'pi pi-camera', 'pi pi-video',
    'pi pi-map', 'pi pi-globe', 'pi pi-wifi', 'pi pi-cloud', 'pi pi-key',
    'pi pi-lock', 'pi pi-unlock', 'pi pi-bell', 'pi pi-bookmark',
    'pi pi-paperclip', 'pi pi-link', 'pi pi-share-alt', 'pi pi-search',
    'pi pi-angle-right', 'pi pi-angle-left', 'pi pi-angle-up', 'pi pi-angle-down',
    'pi pi-check', 'pi pi-times', 'pi pi-plus', 'pi pi-minus', 'pi pi-trash',
    'pi pi-pencil', 'pi pi-save', 'pi pi-refresh', 'pi pi-sync', 'pi pi-print'
  ];

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private messageService: MessageService,
    private actions$: Actions,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm() {
    this.ins = this.fb.group({
      descripcion: ['', Validators.required],
      icono: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Cargar opciones y roles no asignados
    this.store.dispatch(getRolesNoAsignadasModuloByIdRequest({ id: 0 }));
    this.store.dispatch(getOpcionesNoAsignadasModuloByIdRequest({ id: 0 }));
    this.store.dispatch(incrementarRequest({request: 2}));
    
    // Suscribirse a las respuestas de opciones
    this.actions$.pipe(
      ofType(getOpcionesNoAsignadasModuloByIdSuccess)
    ).subscribe(response => {
      this.sourceOpciones = [...response.opciones];
    });

    // Suscribirse a las respuestas de roles
    this.actions$.pipe(
      ofType(getRolesNoAsignadasModuloByIdSuccess)
    ).subscribe(response => {
      this.sourceRoles = [...response.roles];
    });

    // Manejar errores
    this.actions$.pipe(
      ofType(moduloError)
    ).subscribe((error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.error
      });
      this.loading = false;
    });
  }

  // Funciones de tracking para las listas
  trackByOpcionId(index: number, item: any): number {
    return item.optId;
  }

  trackByRolId(index: number, item: any): number {
    return item.rolId;
  }

  openIconDialog() {
    this.showIconDialog = true;
  }

  selectIcon(icon: string) {
    this.selectedIcon = icon;
    this.ins.patchValue({ icono: icon });
    this.showIconDialog = false;
  }

  // Manejadores de eventos para el drag and drop
  onMoveToTarget(event: any) {
    if (event.items) {
      this.cambiosPendientes = true;
      // Crear nuevas referencias de arrays para evitar problemas de mutabilidad
      if (event.items[0].optDes) {
        this.targetOpciones = [...this.targetOpciones];
        this.sourceOpciones = [...this.sourceOpciones];
      } else {
        this.targetRoles = [...this.targetRoles];
        this.sourceRoles = [...this.sourceRoles];
      }
      
    
    }
  }

  onMoveToSource(event: any) {
    if (event.items) {
      this.cambiosPendientes = true;
      // Crear nuevas referencias de arrays para evitar problemas de mutabilidad
      if (event.items[0].optDes) {
        this.targetOpciones = [...this.targetOpciones];
        this.sourceOpciones = [...this.sourceOpciones];
      } else {
        this.targetRoles = [...this.targetRoles];
        this.sourceRoles = [...this.sourceRoles];
      }

    }
  }

  volver() {
    this.router.navigate(['desk/seguridad/modulos']);
  }

  restaurarCambios() {
    // Recargar los datos originales
    this.store.dispatch(getRolesNoAsignadasModuloByIdRequest({ id: 0 }));
    this.store.dispatch(getOpcionesNoAsignadasModuloByIdRequest({ id: 0 }));
    this.store.dispatch(incrementarRequest({request: 2}));
    
    // Limpiar las listas target
    this.targetOpciones = [];
    this.targetRoles = [];
    
    // Resetear el formulario
    this.ins.reset();
    this.selectedIcon = 'pi pi-star';
    
    this.cambiosPendientes = false;
    
    this.messageService.add({
      severity: 'info',
      summary: 'Restaurado',
      detail: 'Se han restaurado todos los cambios'
    });
  }

  guardarModulo(molIcon:string , molDes:string , opt:any[] , rol:any[]) {
   
      this.loading = true;
    
      let modulo  :any = {
        modId: 0 , 
        opt:opt , 
        molDes: molDes ,
        molIcon : molIcon ,
        ok:'S' ,
        roles:rol  
      }
      // Aquí iría la lógica para guardar el módulo

      console.log(modulo);
      
    this.store.dispatch(createModuloRequest({modulo:modulo}));
    this.actions$.pipe(
      ofType(createModuloSuccess)
    ).subscribe(response => {
        setTimeout(() => {
          this.loading = false;
          this.volver();
        }, 1000);
    });
  }
}
