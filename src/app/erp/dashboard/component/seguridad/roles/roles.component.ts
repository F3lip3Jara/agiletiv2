import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Roles, ROLES_KEYS } from '../state/interface/roles.interface';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { incrementarRequest } from '../../state/actions/estado.actions';
import { selectRoles, selectRolesById } from '../state/selectors/roles.selectors';
import {  deleteRolesRequest, deleteRolesSuccess, getRolesRequest, rolesError } from '../state/actions/roles.actions';
import { AppState } from '../../app.state';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { ExcelService } from 'src/app/erp/dashboard/service/excel.service';
import { ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { HostListener } from '@angular/core';
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
  selectedRow: any = null;
  actionItems: MenuItem[] = [];

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.p-datatable') && !target.closest('.p-splitbutton-panel')) {
      this.selectedRow = null;
    }
  }

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService,
    private actions$: Actions,
    private messageService: MessageService
  ) {
    // Inicializar el observable
    this.data$  = this.store.select(selectRoles).pipe(
      map(roles => Array.isArray(roles) ? roles : [])
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
    
    this.actions$.pipe(
      ofType(deleteRolesSuccess)
    ).subscribe(() => {
      this.store.dispatch(getRolesRequest());
    });

    this.actions$.pipe(
      ofType(rolesError)
    ).subscribe((error) => {
      this.messageService.add({severity:'error', summary:'Error', detail:error.error});
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportCSV() {
    this.excelService.exportAsExcelFile(this.data, 'roles');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getRolesRequest());
  }

  

  onRowUnselect(event: any) {
    this.selectedRow = null;
  }

  onActionClick(item: any) {
    this.selectedRow = item;
  }
}
