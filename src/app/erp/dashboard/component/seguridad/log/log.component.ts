import { Component, OnInit, OnDestroy, ViewChild  , ElementRef} from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { incrementarRequest } from '../../state/actions/estado.actions';
import { AppState } from '../../app.state';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { ExcelService } from 'src/app/erp/dashboard/service/excel.service';
import { MessageService } from 'primeng/api';
import { selectLog } from '../state/selectors/log.selectors';
import { LOG_KEYS } from '../state/interface/log.interface';
import { getLogRequest } from '../state/actions/log.actions';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrl: './log.component.scss'
})
export class LogComponent  {
@ViewChild('searchInput') searchInput!: ElementRef;
@ViewChild('dt', { read: ElementRef }) tablaRef!: ElementRef;
  data$: Observable<any[]>;
  loading: boolean = false;
  data: any[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions: number[] = [10, 20];
  subscription: Subscription = new Subscription();
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
  globalFilterFields  : string[]       =LOG_KEYS;
    // Propiedades para el diálogo de búsqueda
  showSearchDialog: boolean = false;
  
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService,
    private messageService: MessageService
  ) {
    this.data$ = this.store.select(selectLog).pipe(
      map(data => Array.isArray(data) ? data : [])
    );

   
  }

  ngOnInit(): void {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getLogRequest());
    this.subscription.add(
      this.data$.subscribe(data => {
        this.data = data || [];
      })
    );
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportCSV() {

    const tabla = this.tablaRef.nativeElement as HTMLElement;
      const cabeceras: string[] = [];  
      // Obtener cabeceras
      tabla.querySelectorAll('thead th').forEach(th => {
        cabeceras.push(th.textContent?.trim() || '');
      });
  
      const datos: any[] = [];
  
      // Obtener filas
      tabla.querySelectorAll('tbody tr').forEach(tr => {
        const celdas = tr.querySelectorAll('td');
        const fila: any = {};
  
        celdas.forEach((td, index) => {
          const clave = cabeceras[index];
          fila[clave] = td.textContent?.trim();
        });
  
        datos.push(fila);
      });
  
      console.log(datos);
    
    this.excelService.exportAsExcelFile(datos, 'log');
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  
  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getLogRequest());
  }

  onActionClick(item: any) {
    this.selectedRow = item;
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

  
  getTipoStyle(tipo: string): { class: string, label: string } {
    const estados = {
      'success': { class: 'bg-green-100 text-green-900', label: 'success' },
      'error': { class: 'bg-red-100 text-red-900', label: 'error' },
      'info': { class: 'bg-blue-100 text-blue-900', label: 'info' },
      'warning': { class: 'bg-yellow-100 text-yellow-900', label: 'warning' }
    };
    return estados[tipo] || { class: 'bg-gray-100 text-gray-900', label: 'sin tipo' };
  }
}
