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
import { selectComuna } from '../state/selectors/comuna.selectors';
import { aplicarFiltrosRequest, aplicarFiltrosSuccess, getComunaRequest, getComunaSuccess } from '../state/actions/comuna.actions';
import { Comuna, COMUNA_KEYS } from '../state/interface/comuna.interface';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-comuna',
  templateUrl: './comuna.component.html',
  styleUrl: './comuna.component.scss'
})
export class ComunaComponent implements OnInit {
  data$: Observable<any[]>;
  loading: boolean = false;
  data: any[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions: number[] = [10, 20];
  subscription: Subscription = new Subscription();
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
  globalFilterFields  : string[]               = [];
  showSearchDialog: boolean = false;
  @ViewChild('searchInput') searchInput!: ElementRef;
  dt!: Table;
  COMPONENT_SELECTOR = 'app-comuna';
  sidebarVisible = false;
  colums: any[] = [];
  

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService,
    private messageService: MessageService,
    private actions$: Actions
  ) {
    this.data$ = this.store.select(selectComuna).pipe(
      map(data => Array.isArray(data) ? data : [])
    );

    this.actionItems = [
     
    ];
  }

  ngOnInit(): void {
  
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getComunaRequest());
    // llama a la acción para obtener los todos
  
     this.actions$.pipe(
      ofType(getComunaSuccess)
    ).subscribe((comuna : any) => {
      this.data = comuna.comuna;
      this.colums = comuna.colums;  
    });
  
    this.globalFilterFields = Object.values(COMUNA_KEYS);
  }

  openNew() {  
   
  }

  edit(data: any) {  
    const dato = btoa(JSON.stringify(data));    
   // this.router.navigate(['desk/seguridad/comuna/upcomuna/'+ dato]);
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
    this.excelService.exportAsExcelFile(this.data, 'comuna');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getComunaRequest());
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
  this.store.dispatch(incrementarRequest({request: 1}));
 this.store.dispatch(aplicarFiltrosRequest({filtros: filters}));
  this.actions$.pipe(
    ofType(aplicarFiltrosSuccess)
  ).subscribe((comuna : any) => {
    this.data = comuna.comuna.map((p: Comuna) => ({
      ...p,
      imageLoaded: false,
      imageError: false
    }));
   // console.log(productos.colums);
   this.colums = comuna.colums;
  });
  
}
}
