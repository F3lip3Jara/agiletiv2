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
import { selectComuna } from '../state/selectors/comuna.selectors';
import { getComunaRequest } from '../state/actions/comuna.actions';
import { COMUNA_KEYS } from '../state/interface/comuna.interface';

@Component({
  selector: 'app-comuna',
  templateUrl: './comuna.component.html',
  styleUrl: './comuna.component.scss'
})
export class ComunaComponent  {
  data$: Observable<any[]>;
  loading: boolean = false;
  data: any[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions: number[] = [10, 20];
  subscription: Subscription = new Subscription();
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
  globalFilterFields  : string[]       = COMUNA_KEYS;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService,
    private messageService: MessageService
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
    this.subscription.add(
      this.data$.subscribe(data => {
        this.data = data || [];
      })
    );
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
}
