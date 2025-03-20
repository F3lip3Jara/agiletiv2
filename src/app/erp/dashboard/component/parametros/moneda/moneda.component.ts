import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { selectMoneda } from '../state/selectors/moneda.selectors';
import { getMonedaRequest } from '../state/actions/moneda.actions';
import { Moneda, MONEDA_KEYS } from '../state/interface/moneda.interface';
@Component({
  selector: 'app-moneda',
  templateUrl: './moneda.component.html',
  styleUrl: './moneda.component.scss'
})
export class MonedaComponent implements OnInit, OnDestroy {
  data$              : Observable<any[]>;
  loading             : boolean        = false;
  globalFilterFields  : string[]       = MONEDA_KEYS;
  data                : any[]          = []; // Tipado correcto
  selectedProducts    : Moneda[]        = [];
  submitted           : boolean        = false;
  cols                : any[]          = [];
  statuses            : any[]          = [];
  rowsPerPageOptions  : number[]       = [10, 20];
  subscription        : Subscription   = new Subscription();
  items: MenuItem[] | undefined;
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
  


  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService,
    private messageService: MessageService
  ) {
    this.data$ = this.store.select(selectMoneda).pipe(
      map(moneda => Array.isArray(moneda) ? moneda : [])
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
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getMonedaRequest());
    this.subscription.add(
      this.data$.subscribe(moneda => {
        this.data = moneda || [];
      })
    );
  }

  openNew() {  
    this.router.navigate(['desk/seguridad/moneda/insmoneda']);
  }

  edit(moneda: any) {  
   // const dato = btoa(JSON.stringify(moneda));    
   // this.router.navigate(['desk/seguridad/moneda/upmoneda/'+ dato]);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  del(data: any) {
   // this.store.dispatch(incrementarRequest({request: 2}));
   // this.store.dispatch(deletemonedaRequest({moneda: data}));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportCSV() {
    this.excelService.exportAsExcelFile(this.data, 'moneda');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getMonedaRequest());
  }

 
  onRowUnselect(event: any) {
    this.selectedRow = null;
  }

  onActionClick(item: any) {
    this.selectedRow = item;
  }

 
}
