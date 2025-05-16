import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
import { PROVEEDOR_KEYS } from '../state/interface/proveedor.interface';
import { selectProveedor } from '../state/selectors/proveedor.selectors';
import { aplicarFiltrosRequest, aplicarFiltrosSuccess, getProveedorRequest, getProveedorSuccess } from '../state/actions/proveedor.actions';
import { Actions, ofType } from '@ngrx/effects';
@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.scss'
})
export class ProveedorComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;

  loading: boolean = false;
  data: any[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions: number[] = [10, 20];
  subscription: Subscription = new Subscription();
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
  globalFilterFields  : string[]       =PROVEEDOR_KEYS;
   // Propiedades para el diálogo de búsqueda
   showSearchDialog: boolean = false;
   dt!: Table;
   sidebarVisible = false;
   colums: any[] = [];
   COMPONENT_SELECTOR = 'app-proveedor';



  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService,
    private messageService: MessageService,
    private actions$: Actions
  ) {
    

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
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getProveedorRequest());
    this.actions$.pipe(
      ofType(getProveedorSuccess)
    ).subscribe((proveedor: any) => {
      this.data = proveedor.proveedor;
      this.colums = proveedor.colums;
    });
  }

  openNew() {  
    this.router.navigate(['desk/parametros/proveedor/insproveedor']);
  }

  edit(data: any) {  
    const dato = btoa(JSON.stringify(data));    
    this.router.navigate(['desk/parametros/proveedor/upproveedor/'+ dato]);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  del(data: any) {
    this.store.dispatch(incrementarRequest({request: 2}));
   // this.store.dispatch(delete{INTERFACE_NAME}Request({{data: data}}));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportCSV() {
    this.excelService.exportAsExcelFile(this.data, 'proveedor');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getProveedorRequest());
  }

  onActionClick(item: any) {
    this.selectedRow = item;
  }

  onSearchValueChange(value: string) {
    if (this.searchInput && this.searchInput.nativeElement) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      inputElement.value = value;
      const event = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(event);
    }
  }

  
  toggleSidebar() {
    const event = new KeyboardEvent('keydown', {
      key: 'a',
      code: 'KeyA',
      ctrlKey: true,
      bubbles: true
    });
  
    // Puedes despachar el evento en un elemento específico
    const targetElement = document.activeElement || document.body;
    targetElement.dispatchEvent(event);
  }


  onFilterApplied(filters: any[]) {
  //  console.log(filters);
      this.store.dispatch(incrementarRequest({request: 1}));
      this.store.dispatch(aplicarFiltrosRequest({filtros: filters}));
      this.actions$.pipe(
        ofType(aplicarFiltrosSuccess)
      ).subscribe((proveedor: any) => {
       console.log(proveedor);
       console.log(proveedor.proveedor);
       this.colums = proveedor.colums;
       this.data = proveedor.proveedor;
      });
  }

}
