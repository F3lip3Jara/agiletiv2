import { Component } from '@angular/core';
import { Opciones } from '../../state/interface/opciones.interface';
import { OPCIONES_KEYS } from '../../state/interface/opciones.interface';
import { map, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AppState } from '../../../app.state';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { selectOpciones } from '../../state/selectors/opciones.selectors';
import { getOpcionesRequest } from '../../state/actions/opciones.actions';
import { selectOpcionesById } from '../../state/selectors/opciones.selectors';
import { ExcelService } from 'src/app/erp/dashboard/service/excel.service';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-opciones',
  templateUrl: './opciones.component.html',
  styleUrl: './opciones.component.scss'
})
export class OpcionesComponent {

  data$              :  Observable<any>;
  loading             : boolean        = false;
  globalFilterFields  : string[]       = OPCIONES_KEYS;
  data                : any[]          = []; // Tipado correcto
  selectedProducts    : Opciones[]        = [];
  submitted           : boolean        = false;
  cols                : any[]          = [];
  statuses            : any[]          = [];
  rowsPerPageOptions  : number[]       = [10, 20];
  subscription        : Subscription   = new Subscription();
  items: MenuItem[] | undefined;


  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService  
  ) {
    // Inicializar el observable
    this.data$   = this.store.select(selectOpciones).pipe(
      map(opciones => Array.isArray(opciones) ? opciones : [])
    );
  }

  ngOnInit(): void {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getOpcionesRequest());
    // Suscribirse al observable
    this.subscription.add(
      this.data$.subscribe(opciones => {
          this.data = opciones || []; // Asegurarse de que siempre sea un array
      })
    );
  }

  openNew() {  
    this.router.navigate(['desk/seguridad/administracion/opciones/ins-opciones']);
  }

  edit(id: number) {  
    this.subscription.add(
      this.store.select(selectOpcionesById, { id })
        .subscribe(opciones => {
           if (opciones && id > 0) {
            const dato = btoa(JSON.stringify(opciones));  
            this.router.navigate(['desk/seguridad/administracion/opciones/up-opciones/' + dato]);
          }
        })
    );
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  del(data: any) {  
  }

  editAcciones(opcion : any) {
    const dato = btoa(JSON.stringify(opcion));    
    this.router.navigate(['desk/seguridad/administracion/opciones/acciones/' + dato]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportCSV() {
    this.excelService.exportAsExcelFile(this.data, 'opciones');
  }
}
