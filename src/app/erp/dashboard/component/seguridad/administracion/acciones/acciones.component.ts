import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ACCIONES_KEYS } from '../../state/interface/acciones.interface';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ExcelService } from '../../../../service/excel.service';
import { Subscription } from 'rxjs';
import { Acciones } from '../../state/interface/acciones.interface';
import { selectAcciones } from '../../state/selectors/acciones.selectors';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { accionesDeleteRequest, accionesDeleteSuccess, getAccionesRequest } from '../../state/actions/acciones.actions';
import { Actions, ofType } from '@ngrx/effects';
@Component({
  selector: 'app-acciones',
  templateUrl: './acciones.component.html',
  styleUrl: './acciones.component.scss'
})
export class AccionesComponent {
  
    data$              : Observable<any[]>;
    loading             : boolean        = false;
    globalFilterFields  : string[]       = ACCIONES_KEYS;
    data                : any[]          = []; // Tipado correcto
    selectedProducts    : Acciones[]        = [];
    submitted           : boolean        = false;
    cols                : any[]          = [];
    statuses            : any[]          = [];
    rowsPerPageOptions  : number[]       = [10, 20];
    subscription        : Subscription   = new Subscription();
    items: MenuItem[] | undefined;
    opcion: any;
    selectedRow: any = null;
    actionItems: MenuItem[] = [];
  
  
    constructor(
      private store: Store<AppState>,
      private router: Router,
      private excelService: ExcelService,
      private route: ActivatedRoute,
      private actions$ : Actions
    ) {
      // Inicializar el observable
      this.data$  = this.store.select(selectAcciones).pipe(
        map(acciones => Array.isArray(acciones) ? acciones : [])
      );

      this.actionItems = [
        {
          label: 'Editar',
          icon: 'pi pi-pencil',
          command: () => {
            if (this.selectedRow) {
              this.edit(this.selectedRow);
            }
          }
        },
        {
          label: 'Eliminar',
          icon: 'pi pi-trash',
          command: () => {
            if (this.selectedRow) {
              this.del(this.selectedRow);
            }
          }
        }
      ];
    }
  
    ngOnInit(): void {

      this.route.params.subscribe(params => {
        const obj = params['opcion'];      
        this.opcion =  JSON.parse(atob(obj));
      }); 

      this.store.dispatch(incrementarRequest({request: 1}));
      this.store.dispatch(getAccionesRequest({optId: this.opcion.optId}));
      // Suscribirse al observable
      this.subscription.add(
        this.data$.subscribe(acciones => {
          this.data = acciones || []; // Asegurarse de que siempre sea un array
        })
      );
    }
  
    openNew() {  
     let dato = btoa(JSON.stringify(this.opcion));
      this.router.navigate(['desk/seguridad/administracion/opciones/acciones/ins-acciones/'+ dato]);
    }
  
    edit(acciones: any) {  
      let   data = { accion: acciones, opcion: this.opcion };
      const dato = btoa(JSON.stringify(data));    
      this.router.navigate(['desk/seguridad/administracion/opciones/acciones/up-acciones/'+ dato]);
      
    }
  
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
  
    del(data: any) {
      this.store.dispatch(incrementarRequest({request: 2}));
      this.store.dispatch(accionesDeleteRequest({acciones: data}));
      this.actions$.pipe(
        ofType(accionesDeleteSuccess)
      ).subscribe((response : any) => {
        this.store.dispatch(getAccionesRequest({optId: this.opcion.optId}));
      });
     
    }
  
    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
  
    exportCSV() {
      this.excelService.exportAsExcelFile(this.data, 'roles');
    }
  
    refresh() {
      this.store.dispatch(incrementarRequest({request: 1}));
      this.store.dispatch(getAccionesRequest({optId: this.opcion.optId}));
    }

    onRowSelect(event: any) {
      this.selectedRow = event.data;
    }

    onRowUnselect(event: any) {
      this.selectedRow = null;
    }

    onActionClick(item: any) {
      this.selectedRow = item;
    }
}
