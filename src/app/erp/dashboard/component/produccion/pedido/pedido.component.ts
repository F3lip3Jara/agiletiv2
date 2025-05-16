import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Roles, ROLES_KEYS } from '../../seguridad/state/interface/roles.interface';
import { Pedidonac, PEDIDONAC_KEYS, PedidonacDet } from '../state/interface/pedidonac.interface';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Router } from '@angular/router';
import { ExcelService } from '../../../service/excel.service';
import { Actions, ofType } from '@ngrx/effects';
import { selectPedidonac } from '../state/selectors/pedidonac.selectors';
import { getPedidonacRequest, getPedidonacSuccess, getPedidoProductosRequest, getPedidoProductosSuccess, recepcionarPedidoRequest, recepcionarPedidoSuccess, aplicarFiltrosRequest, aplicarFiltrosSuccess } from '../state/actions/pedidonac.actions';
import { incrementarRequest } from '../../state/actions/estado.actions';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss'],
  providers: [
  
  ]
})
export class PedidoComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  data$              : Observable<any[]>;
  loading             : boolean        = false;
  globalFilterFields  : string[]       = PEDIDONAC_KEYS;
  data                : any[]          = []; // Tipado correcto
  selectedProducts    : Pedidonac[]        = [];
  submitted           : boolean        = false;
  cols                : any[]          = [];
  statuses            : any[]          = [];
  rowsPerPageOptions  : number[]       = [10, 20];
  subscription        : Subscription   = new Subscription();
  items: MenuItem[] | undefined;
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
  visible: boolean = false;
  pedido: any;

   // Propiedades para el diálogo de búsqueda
   showSearchDialog: boolean = false;
   dt!: Table;
   sidebarVisible = false;
   colums: any[] = [];
   COMPONENT_SELECTOR = 'app-pedido';


 
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
        label: 'Recepcionar',
        icon: 'pi pi-receipt',
        command: () => {
          if (this.selectedRow) {
            this.recepcionar(this.selectedRow);
          }
        }
      },
      {
        label: 'Ver',
        icon: 'pi pi-eye',
        command: () => {
          if (this.selectedRow) {
            const dato = btoa(JSON.stringify(this.selectedRow));
            this.router.navigate(['desk/produccion/orden_nacional/verpedido/'+ dato]);
          }
        }
      }
    ];
  }

  ngOnInit(): void {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getPedidonacRequest());
    // Suscribirse al observable
    this.actions$.pipe(
      ofType(getPedidonacSuccess)
    ).subscribe((pedidoNac) => {
      this.data = pedidoNac.pedidonac;
      this.colums = pedidoNac.colums;
    //  console.log(this.colums);
    }); 
  }

  openNew() {  
    this.router.navigate(['desk/produccion/orden_nacional/inspedido']);
  }

  edit(pedido: any) {  
    const dato = btoa(JSON.stringify(pedido));    

    if(pedido.estado_ord == 'PENDIENTE' && pedido.estado_pro == 'PENDIENTE'){
      this.router.navigate(['desk/produccion/orden_nacional/uppedido/'+ dato]);
    }else{
      this.messageService.add({severity:'error', summary:'Error', detail:'No se puede editar el pedido'});
    }
    
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  del(data: any) {
   /* this.store.dispatch(incrementarRequest({request: 2}));
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
    });*/
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportCSV() {
    this.excelService.exportAsExcelFile(this.data, 'roles');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getPedidonacRequest());
  } 

  onRowUnselect(event: any) {
    this.selectedRow = null;
  }

  onActionClick(item: any) {
    this.selectedRow = item;
  }

  recepcionar(pedido: any) {
    this.visible = true;
    this.pedido = pedido;
   
  }

  confirmar() {
    this.store.dispatch(incrementarRequest({request: 3}));
    this.store.dispatch(getPedidoProductosRequest({pedido: this.pedido}));
    
    this.actions$.pipe(
      ofType(getPedidoProductosSuccess)
    ).subscribe((pedido) => {
     
      let datos : PedidonacDet = {
        ...this.pedido,
        detalle: pedido.productos
      };
      
      this.store.dispatch(recepcionarPedidoRequest({pedido: datos}));

      this.actions$.pipe(
        ofType(recepcionarPedidoSuccess)
      ).subscribe((pedido) => {
        this.visible = false;
        this.store.dispatch(getPedidonacRequest());
      });
    });
  }

  getEstadoStyle(estado: string): { class: string, label: string } {
    const estados = {
      'PENDIENTE': { class: 'bg-yellow-100 text-yellow-900', label: 'Pendiente' },
      'PROCESANDO': { class: 'bg-blue-100 text-blue-900', label: 'Procesando' },
      'APROBADA': { class: 'bg-purple-100 text-purple-900', label: 'Aprobada' },
      'RECHAZADA': { class: 'bg-red-100 text-red-900', label: 'Rechazada' }
    };
    return estados[estado] || { class: 'bg-gray-100 text-gray-900', label: 'Desconocido' };
  }

  getEstadoProStyle(estado: string): { class: string, label: string } {
    const estados = {
      'PENDIENTE': { class: 'bg-yellow-100 text-yellow-900', label: 'Pendiente' },
      'PARCIAL': { class: 'bg-blue-100 text-blue-900', label: 'Parcial' },
      'COMPLETA': { class: 'bg-purple-100 text-purple-900', label: 'Completa' },
      'UBICADA': { class: 'bg-green-100 text-green-900', label: 'Ubicada' }
    };
    return estados[estado] || { class: 'bg-gray-100 text-gray-900', label: 'Desconocido' };
  }


  onSearchValueChange(value: string) {
    if (this.searchInput && this.searchInput.nativeElement) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      inputElement.value = value;
      // Disparar el evento input para activar el filtro
      const event = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(event);
    }
  }

  
  toggleSidebar() {
    const event = new KeyboardEvent('keydown', {
      key: 'a',
      code: 'KeyA',
      ctrlKey: true,
      bubbles: true
    });
  
    // Puedes despachar el evento en un elemento específico
    const targetElement = document.activeElement || document.body;
    targetElement.dispatchEvent(event);
  }


  onFilterApplied(filters: any[]) {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(aplicarFiltrosRequest({filtros: filters}));
    this.actions$.pipe(
      ofType(aplicarFiltrosSuccess)
    ).subscribe((pedido) => {
      this.data = pedido.pedidonac;
      this.colums = pedido.colums;
    
    });
  }

  
 
}