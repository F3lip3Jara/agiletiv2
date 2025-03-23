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
import { selectCentro } from '../state/selectors/centro.selectors';
import { getCentroRequest } from '../state/actions/centro.actions';
import { CENTRO_KEYS } from '../state/interface/centro.interface';  
@Component({
  selector: 'app-centro',
  templateUrl: './centro.component.html',
  styleUrl: './centro.component.scss'
})
export class CentroComponent  {
  data$: Observable<any[]>;
  loading: boolean = false;
  data: any[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions: number[] = [10, 20];
  subscription: Subscription = new Subscription();
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
  globalFilterFields  : string[]       = CENTRO_KEYS;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService,
    private messageService: MessageService
  ) {
    this.data$ = this.store.select(selectCentro).pipe(
      map(data => Array.isArray(data) ? data : [])
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
    this.store.dispatch(getCentroRequest());
    this.subscription.add(
      this.data$.subscribe(data => {
        this.data = data || [];
      })
    );
  }

  openNew() {  
   this.router.navigate(['desk/parametros/centro/inscentro']);
  }

  edit(data: any) {  
    const dato = btoa(JSON.stringify(data));    
     this.router.navigate(['desk/parametros/centro/upcentro/'+ dato]);
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
    this.excelService.exportAsExcelFile(this.data, 'centro');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    //this.store.dispatch(get{INTERFACE_NAME}Request());
  }

  onActionClick(item: any) {
    this.selectedRow = item;
  }
}
