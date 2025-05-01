import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { ExcelService } from 'src/app/erp/dashboard/service/excel.service';
import { MessageService } from 'primeng/api';
import { AppState } from '../../../app.state';
import { ORDENES_KEYS } from '../../state/interface/ordenes.interface';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { 
  generarListaRequest, 
  getOrdenesRequest, 
  getOrdenesSuccess,
  checkListaStatusSuccess,
  listaCompletadaSuccess, 
  generarListaSuccess,
  checkListaStatusRequest,
  liberarOrdenesRequest,
  liberarOrdenesSuccess
} from '../../state/actions/ordenes.actions';

@Component({
  selector: 'app-ordenes-entrada',
  templateUrl: './ordenes-entrada.component.html',
  styleUrl: './ordenes-entrada.component.scss'
})
export class OrdenesEntradaComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  data$: Observable<any[]>;
  loading: boolean = false;
  data: any[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions: number[] = [10, 20];
  subscription: Subscription = new Subscription();
  selectedRow: any = null;
  selectedRows: any[] = [];
  actionItems: MenuItem[] = [];
  globalFilterFields: string[] = ORDENES_KEYS;
  
  // Propiedades para el diálogo de búsqueda
  showSearchDialog: boolean = false;
  dt!: Table;
  sidebarVisible = false;
  columnDefinitions = []; // Aquí se llenarán las definiciones desde el backend



  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService,
    private messageService: MessageService,
    private action$: Actions
  ) {
    this.actionItems = [
      {
        label: 'Ver',
        icon: 'pi pi-eye',
        command: () => {
          if (this.selectedRow) {
            const dato = btoa(JSON.stringify(this.selectedRow));
            this.router.navigate(['desk/wms/sd/orden_entrada/ver/'+ dato]);
          }
        }
      }
    ];
  }

  ngOnInit(): void {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getOrdenesRequest());
    
    this.subscription.add(
      this.action$.pipe(
        ofType(getOrdenesSuccess),
        map(action => action.ordenes)
      ).subscribe(data => {
        this.data = data || [];
      })
    );

    // Suscripción para monitorear el estado de generación de listas
    this.subscription.add(
      this.action$.pipe(
        ofType(checkListaStatusSuccess)
      ).subscribe(({status}) => {
        if (status === 'processing') {
          this.messageService.add({
            severity: 'info',
            summary: 'Procesando',
            detail: 'Las listas están siendo generadas...',
            life: 3000
          });
        }
      })
    );

    // Suscripción para cuando la lista está completada
    this.subscription.add(
      this.action$.pipe(
        ofType(listaCompletadaSuccess)
      ).subscribe(({url}) => {
         // Abrir la URL en una nueva pestaña
        window.open(url, '_blank');
      })
    );
  }

  onGlobalFilter(table: Table, event: Event) {
    this.dt = table;
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onSearchValueChange(value: string) {
    if (this.searchInput && this.searchInput.nativeElement) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      inputElement.value = value;
      // Disparar el evento input para activar el filtro
      const event = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(event);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportCSV() {
    this.excelService.exportAsExcelFile(this.data, 'ordenes-entrada');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getOrdenesRequest());
  }

  onActionClick(item: any) {
    this.selectedRow = item;
  }

  liberarOrdenes() {
    if (this.selectedRows && this.selectedRows.length > 0) {
      this.store.dispatch(incrementarRequest({request: 2}));
      const ordenIds = this.selectedRows.map(row => row.ordId);
      this.store.dispatch(liberarOrdenesRequest({ordenIds}));

      this.action$.pipe(
        ofType(liberarOrdenesSuccess)
      ).subscribe(() => { 
         this.store.dispatch(getOrdenesRequest());
      });
    }
  }

  openNew() {
    // Implementación pendiente
  }

  generarListasMultiples() {
    if (this.selectedRows && this.selectedRows.length > 0) {
      const ordenIds = this.selectedRows.map(row => row.ordId);
      this.store.dispatch(generarListaRequest({ordenIds}));
      this.messageService.add({
        severity: 'info',
        summary: 'Generando listas',
        detail: `Generando ${this.selectedRows.length} lista(s)`,
        life: 3000
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor seleccione al menos una orden'
      });
    }
  }

  getEstadoStyle(estado: string): { class: string, label: string } {
    const estados = {
      'P': { class: 'bg-yellow-100 text-yellow-900', label: 'Pendiente' },
      'L': { class: 'bg-blue-100 text-blue-900', label: 'Liberado' },
      'V': { class: 'bg-purple-100 text-purple-900', label: 'Verificado' },
      'A': { class: 'bg-green-100 text-green-900', label: 'Almacenado' }
    };
    return estados[estado] || { class: 'bg-gray-100 text-gray-900', label: 'Desconocido' };
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
