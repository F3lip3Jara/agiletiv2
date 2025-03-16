import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  getOpcionesNoAsignadasModuloByIdRequest, 
  getRolesNoAsignadasModuloByIdRequest,
  getModuloRolByIdRequest,
  getOpcionesModuloByIdRequest,
  moduloError,
  getOpcionesModuloByIdSuccess,
  getOpcionesNoAsignadasModuloByIdSuccess,
  getRolesNoAsignadasModuloByIdSuccess,
  getModuloRolByIdSuccess,
  updateModuloRequest,
  updateModuloSuccess,
} from '../../state/actions/modulo.actions';
import { incrementarRequest } from '../../../state/actions/estado.actions';

@Component({
  selector: 'app-up-modulo',
  templateUrl: './up-modulo.component.html',
  styleUrl: './up-modulo.component.scss'
})
export class UpModuloComponent implements OnInit {
  upd: FormGroup;
  sourceOpciones: any[] = [];
  targetOpciones: any[] = [];
  sourceRoles: any[] = [];
  targetRoles: any[] = [];
  showIconDialog: boolean = false;
  selectedIcon: string = 'pi pi-star';
  loading: boolean = false;
  cambiosPendientes: boolean = false;
  moduloId: number = 0;
   modulo: any;
  
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
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  private initForm() {
    this.upd = this.fb.group({
      descripcion: ['', Validators.required],
      icono: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Obtener el ID del módulo de los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.modulo = JSON.parse(atob(params['modulo']));
      console.log(this.modulo);
      this.moduloId = this.modulo.molId;
      this.upd.patchValue({
        descripcion: this.modulo.molDes,
        icono: this.modulo.molIcon
      });
      this.selectedIcon = this.modulo.molIcon;     
      // Cargar datos del módulo
      this.cargarDatosModulo();
    });

    // Suscribirse a la respuesta del módulo
   this.actions$.pipe(
      ofType(getOpcionesModuloByIdSuccess)
    ).subscribe((response : any) => {
      this.targetOpciones = [...response.opciones.opt];
    });

    this.actions$.pipe(
      ofType( getModuloRolByIdSuccess)
    ).subscribe((response : any) => {    
      this.targetRoles = [...response.roles];
    });
    
    // Suscribirse a las respuestas de opciones
    this.actions$.pipe(
      ofType(getRolesNoAsignadasModuloByIdSuccess)
    ).subscribe((response : any) => {
      this.sourceRoles = [...response.roles];
    });

    // Suscribirse a las respuestas de roles
    this.actions$.pipe(
      ofType(getOpcionesNoAsignadasModuloByIdSuccess)
    ).subscribe((response : any) => {
      this.sourceOpciones = [...response.opciones];
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
    this.upd.patchValue({ icono: icon });
    this.showIconDialog = false;
    this.cambiosPendientes = true;
  }

  // Manejadores de eventos para el drag and drop
  onMoveToTarget(event: any) {
    if (event.items) {
      this.cambiosPendientes = true;
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
 
    this.cambiosPendientes = false; 
    this.loading = false;
    this.cargarDatosModulo();
    this.messageService.add({
      severity: 'info',
      summary: 'Restaurado',
      detail: 'Se han restaurado todos los cambios'
    });
  }

  actualizarModulo(molIcon: string, molDes: string, opt: any[], rol: any[]) {
    this.loading = true;
    
    let modulo: any = {
      molId: this.moduloId,
      opt: opt,
      molDes: molDes,
      molIcon: molIcon,
      ok: 'S',
      roles: rol
    }

   this.store.dispatch(updateModuloRequest({modulo: modulo}));
  this.actions$.pipe(
     ofType(updateModuloSuccess)
   ).subscribe(response => {
    setTimeout(() => {
        this.loading = false;
        this.volver();
      }, 1000);
    });
  }

  cargarDatosModulo(){
    this.store.dispatch(incrementarRequest({request: 4}));
    this.store.dispatch(getRolesNoAsignadasModuloByIdRequest({ id: this.moduloId }));
    this.store.dispatch(getOpcionesNoAsignadasModuloByIdRequest({ id: this.moduloId }));
    this.store.dispatch(getModuloRolByIdRequest({ id: this.moduloId }));
    this.store.dispatch(getOpcionesModuloByIdRequest({ id: this.moduloId }));
  }
}
