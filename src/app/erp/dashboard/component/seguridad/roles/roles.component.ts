import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Roles, ROLES_KEYS } from '../state/interface/roles.interface';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { incrementarRequest } from '../../state/actions/estado.actions';
import { selectRoles, selectRolesById } from '../state/selectors/roles.selectors';
import {  deleteRolesRequest, getRolesRequest } from '../state/actions/roles.actions';
import { AppState } from '../../app.state';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { ExcelService } from 'src/app/erp/dashboard/service/excel.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit, OnDestroy {
  data$              : Observable<any[]>;
  loading             : boolean        = false;
  globalFilterFields  : string[]       = ROLES_KEYS;
  data                : any[]          = []; // Tipado correcto
  selectedProducts    : Roles[]        = [];
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
    this.data$  = this.store.select(selectRoles).pipe(
      map(roles => Array.isArray(roles) ? roles : [])
    );
  }

  ngOnInit(): void {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getRolesRequest());
    // Suscribirse al observable
    this.subscription.add(
      this.data$.subscribe(roles => {
        this.data = roles || []; // Asegurarse de que siempre sea un array
      })
    );
  }

  openNew() {  
    this.router.navigate(['desk/seguridad/roles/insroles']);
  }

  edit(roles: any) {  
    const dato = btoa(JSON.stringify(roles));    
    this.router.navigate(['desk/seguridad/roles/uproles/'+ dato]);
    
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  del(data: any) {
    this.store.dispatch(incrementarRequest({request: 2}));
    this.store.dispatch(deleteRolesRequest({roles: data}));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportCSV() {
    this.excelService.exportAsExcelFile(this.data, 'roles');
  }
}
