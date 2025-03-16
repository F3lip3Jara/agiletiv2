import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { AppState } from '../../../app.state';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { ExcelService } from 'src/app/erp/dashboard/service/excel.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sub-modulo',
  templateUrl: './sub-modulo.component.html',
  styleUrl: './sub-modulo.component.scss'
})
export class SubModuloComponent {
  data$: Observable<any[]>;
  loading: boolean = false;
  data: any[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions: number[] = [10, 20];
  subscription: Subscription = new Subscription();
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
  modulo: any;  

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
 /*   this.data$ = this.store.select(selectsub-modulo).pipe(
      map(sub-modulo => Array.isArray(sub-modulo) ? sub-modulo : [])
    );*/

    this.actionItems = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedRow) {
        //    this.edit(this.selectedRow);
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
    this.route.params.subscribe(params => {
      this.modulo = JSON.parse(atob(params['modulo']));
      
    });
    /*this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getsub-moduloRequest());
    this.subscription.add(
      this.data$.subscribe(sub-modulo => {
        this.data = sub-modulo || [];
      })
    );*/
  }

  openNew() {  
    this.router.navigate(['desk/seguridad/sub-modulo/inssub-modulo']);
  }

  edit(submodulo: any) {  
   // const dato = btoa(JSON.stringify(sub-modulo));    
   /// this.router.navigate(['desk/seguridad/sub-modulo/upsub-modulo/'+ dato]);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  del(data: any) {
    this.store.dispatch(incrementarRequest({request: 2}));
   // this.store.dispatch(deletesub-moduloRequest({sub-modulo: data}));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportCSV() {
    this.excelService.exportAsExcelFile(this.data, 'sub-modulo');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    //this.store.dispatch(getsub-moduloRequest());
  }

  onActionClick(item: any) {
    this.selectedRow = item;
  }
}
