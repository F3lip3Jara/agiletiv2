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
import { selectCiudad } from '../state/selectors/ciudad.selectors';
import { getCiudadRequest } from '../state/actions/ciudad.actions';
import { Ciudad } from '../state/interface/ciudad.interface';
import { CIUDAD_KEYS } from '../state/interface/ciudad.interface';
@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrl: './ciudad.component.scss'
})
export class CiudadComponent  {
  data$: Observable<Ciudad[]>;
  loading: boolean = false;
  data: Ciudad[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions: number[] = [10, 20];
  subscription: Subscription = new Subscription();
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
  globalFilterFields  : string[]       = CIUDAD_KEYS;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService,
    private messageService: MessageService
  ) {
    this.data$ = this.store.select(selectCiudad).pipe(
      map(data => Array.isArray(data) ? data : [])
    );

    this.actionItems = [
      
    ];
  }

  ngOnInit(): void {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getCiudadRequest());
    this.subscription.add(
      this.data$.subscribe(data => {
        this.data = data || [];
      })
    );
  }

  openNew() {  
    this.router.navigate(['desk/seguridad/ciudad/insciudad']);
  }

  edit(data: any) {  
   //const dato = btoa(JSON.stringify(data));    
   //this.router.navigate(['desk/seguridad/ciudad/upciudad/'+ dato]);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  del(data: any) {
   // this.store.dispatch(incrementarRequest({request: 2}));
    //this.store.dispatch(delete{INTERFACE_NAME}Request({{data: data}}));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportCSV() {
    this.excelService.exportAsExcelFile(this.data, 'ciudad');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getCiudadRequest());
  }

  onActionClick(item: any) {
    this.selectedRow = item;
  }
}
