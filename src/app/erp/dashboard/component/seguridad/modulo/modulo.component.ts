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
import { selectModulo } from '../state/selectors/modulo.selectors';
import { getModuloRequest, deleteModuloRequest, deleteModuloSuccess } from '../state/actions/modulo.actions';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrl: './modulo.component.scss'
})
export class ModuloComponent implements OnInit, OnDestroy {
  data$: Observable<any[]>;
  loading: boolean = false;
  data: any[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions: number[] = [10, 20];
  subscription: Subscription = new Subscription();
  selectedRow: any = null;
  actionItems: MenuItem[] = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService,
    private messageService: MessageService,
    private actions$: Actions
  ) {
    this.data$ = this.store.select(selectModulo).pipe(
      map(modulo => Array.isArray(modulo) ? modulo : [])
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
        label: 'Sub Módulos',
        icon: 'pi pi-sitemap',
        command: () => {
         
            this.subModulos(this.selectedRow);
          
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
      },
    ];
  }

  ngOnInit(): void {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getModuloRequest());
    this.subscription.add(
      this.data$.subscribe(modulo => {
        this.data = modulo || [];
      })
    );
  }

  openNew() {  
    this.router.navigate(['desk/seguridad/modulos/insmodulo']);
  }

  edit(modulo: any) {  
    const dato = btoa(JSON.stringify(modulo));    
    this.router.navigate(['desk/seguridad/modulos/upmodulo/'+ dato]);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  del(data: any) {
    this.store.dispatch(incrementarRequest({request: 2}));
    this.store.dispatch(deleteModuloRequest({modulo: data}));
    this.actions$.pipe(
      ofType(deleteModuloSuccess)
    ).subscribe((response : any) => {
       this.store.dispatch(getModuloRequest());
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportCSV() {
    this.excelService.exportAsExcelFile(this.data, 'modulo');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getModuloRequest());
  }

  onActionClick(item: any) {
    this.selectedRow = item;
  }

  subModulos(modulo: any) {
    const dato = btoa(JSON.stringify(modulo));    
    this.router.navigate(['desk/seguridad/modulos/submodulos/'+ dato]);
  }
}
