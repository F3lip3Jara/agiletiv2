import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { ExcelService } from 'src/app/erp/dashboard/service/excel.service';
import { MessageService } from 'primeng/api';
import { AppState } from '../../../../app.state';
import { SECTOR_KEYS } from '../../../state/interface/sector.interface';
import { getSectorRequest, getSectorSuccess } from '../../../state/actions/sector.actions';
import { incrementarRequest } from '../../../../state/actions/estado.actions';
import { Actions, ofType } from '@ngrx/effects';
@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrl: './sector.component.scss'
})
export class SectorComponent  {
  data$: Observable<any[]>;
  loading: boolean = false;
  data: any[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions: number[] = [10, 20];
  subscription: Subscription = new Subscription();
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
  globalFilterFields  : string[] =SECTOR_KEYS;
  almacen: any;
  centro: any;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private actions$: Actions
  ) {
   

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
    this.centroAlmacen();    
    this.store.dispatch(getSectorRequest({almacen: this.almacen}));
      this.actions$.pipe(
        ofType(getSectorSuccess)
    ).subscribe((action :any) => {     
          this.data = action.sector.data;
        
    });

   
  }

  openNew() {  
    let dato = {centro : this.centro, almacen : this.almacen}; 
    let almacen = btoa(JSON.stringify(dato)); 
    this.router.navigate(['desk/parametros/centro/almacen/sector/inssector/' + almacen]);
  }

  edit(data: any) {  
    let dato = {centro : this.centro, almacen : this.almacen, sector : data}; 
    let almacen = btoa(JSON.stringify(dato)); 
    this.router.navigate(['desk/parametros/centro/almacen/sector/upsector/'+ almacen]);
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
    this.excelService.exportAsExcelFile(this.data, 'sector');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
   
    this.store.dispatch(getSectorRequest({almacen: this.almacen}));
  }

  onActionClick(item: any) {
    this.selectedRow = item;
  }

  volver(){
    let centro = btoa(JSON.stringify(this.centro));
    this.router.navigate(['/desk/parametros/centro/almacen/' + centro]);
  }

  centroAlmacen(){
    this.route.params.subscribe(params => {
      let almacen = JSON.parse(atob(params['almacen']));
      this.almacen = almacen.almacen;
      this.centro = almacen.centro;
    });
  }
}