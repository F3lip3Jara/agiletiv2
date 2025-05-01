import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { AppState } from '../../../app.state';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { ExcelService } from 'src/app/erp/dashboard/service/excel.service';
import { MessageService } from 'primeng/api';
import { ALMACEN_KEYS } from '../../state/interface/almacen.interface';
import { getAlmacenRequest, getAlmacenSuccess } from '../../state/actions/almacen.actions';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrl: './almacen.component.scss'
})
export class AlmacenComponent implements OnInit, OnDestroy {
  data$: Observable<any[]>;
  loading: boolean = false;
  data: any[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions: number[] = [10, 20];
  subscription: Subscription = new Subscription();
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
  globalFilterFields  : string[]       =ALMACEN_KEYS;
  centro : any;
  showSearchDialog: boolean = false;
  @ViewChild('searchInput') searchInput!: ElementRef;
  dt!: Table;

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
        label: 'Sectores',
        icon: 'pi pi-sitemap',
        command: () => {
            if (this.selectedRow) {
              let dato = {centro : this.centro, almacen : this.selectedRow}
              let almacen = btoa(JSON.stringify(dato));
              this.router.navigate(['desk/parametros/centro/almacen/sector/' + almacen]);
            }
        }
      },
      
    ];
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {      
      let centro = JSON.parse(atob(params['centro']));
      this.centro = centro;     
      this.store.dispatch(incrementarRequest({request: 1}));
      this.store.dispatch(getAlmacenRequest({centro: centro}));
      this.actions$.pipe(
        ofType(getAlmacenSuccess)
      ).subscribe(data => {
           this.data = data.almacen;
      });
    }); 
   
  }

  openNew() {  
    let obj = btoa(JSON.stringify(this.centro));
    this.router.navigate(['desk/parametros/centro/almacen/insalmacen/'+ obj]);
  }

  edit(data: any) {
    const obj  = { centro : this.centro, almacen : data}  
    const dato = btoa(JSON.stringify(obj));    
    this.router.navigate(['desk/parametros/centro/almacen/upalmacen/'+ dato]);
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
    this.excelService.exportAsExcelFile(this.data, 'almacen');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getAlmacenRequest({centro: this.centro}));
  }

  onActionClick(item: any) {
    this.selectedRow = item;
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
