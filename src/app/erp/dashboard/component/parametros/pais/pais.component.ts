import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { incrementarRequest } from '../../state/actions/estado.actions';
import { AppState } from '../../app.state';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { ExcelService } from 'src/app/erp/dashboard/service/excel.service';
import { MessageService } from 'primeng/api';
import { selectPais } from '../state/selectors/pais.selectors';
import { getPaisRequest } from '../state/actions/pais.actions';
import { uploadRegionRequest, uploadRegionSuccess } from '../state/actions/region.actions';
import { Actions, ofType } from '@ngrx/effects';
import { PAIS_KEYS } from '../state/interface/pais.interface';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrl: './pais.component.scss'
})
export class PaisComponent implements OnInit {
  data$: Observable<any[]>;
  loading: boolean = false;
  data: any[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions: number[] = [10, 20];
  subscription: Subscription = new Subscription();
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
  visible: boolean = false;
  pais: any = null;
  globalFilterFields  : string[]       = PAIS_KEYS;
  showSearchDialog: boolean = false;
  @ViewChild('searchInput') searchInput!: ElementRef;
  dt!: Table;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService,
    private messageService: MessageService,
    private actions$: Actions
  ) {
    this.data$ = this.store.select(selectPais).pipe(
      map(data => Array.isArray(data) ? data : [])
    );

    this.actionItems = [
      {
        label: 'Cargar Regiones',
        icon: 'pi pi-upload',
        command: () => {
          if (this.selectedRow) {
            this.upload(this.selectedRow);
          }
        }
      }
    ];
  }

  ngOnInit(): void {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getPaisRequest());  
    this.subscription.add(
      this.data$.subscribe(data => {
        this.data = data || [];
      })
    );

      // Suscripción para monitorear el estado de generación de listas
     /* this.subscription.add(
        this.action$.pipe(
          ofType(check)
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
      );*/
  }

  openNew() {  
    this.router.navigate(['desk/seguridad/pais/inspais']);
  }

  upload(data: any) {  
    const dato = btoa(JSON.stringify(data)); 
    this.visible = true;
    this.pais = data;
   // this.router.navigate(['desk/seguridad/pais/uppais/'+ dato]);
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
    this.excelService.exportAsExcelFile(this.data, 'pais');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getPaisRequest());
    
  }

  onActionClick(item: any) {
    this.selectedRow = item;
  }

  confirm() {
    this.visible = false;
    this.store.dispatch(uploadRegionRequest({pais: this.pais}));
    this.actions$.pipe(
      ofType(uploadRegionSuccess),
      take(1)
    ).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Favor de esperar a que se carguen las regiones' });
      
    });
  }

  onSearchValueChange(value: string) {
    if (this.searchInput && this.searchInput.nativeElement) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      inputElement.value = value;
      const event = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(event);
    }
  }
}
