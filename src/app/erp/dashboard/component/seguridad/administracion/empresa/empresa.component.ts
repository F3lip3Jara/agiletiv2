import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ExcelService } from '../../../../service/excel.service';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { MenuItem } from 'primeng/api';
import { getEmpresaRequest } from '../../state/actions/empresa.actions';
import { selectEmpresa } from '../../state/selectors/empresa.selectors';
import { Empresa, EMPRESA_KEYS } from '../../state/interface/empresa.interface';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss'
})
export class EmpresaComponent implements OnInit, OnDestroy {
  data$              : Observable<any[]>;
  loading             : boolean        = false;
  globalFilterFields  : string[]       = EMPRESA_KEYS;
  data                : any[]          = []; // Tipado correcto
  selectedProducts    : Empresa[]        = [];
  submitted           : boolean        = false;
  cols                : any[]          = [];
  statuses            : any[]          = [];
  rowsPerPageOptions  : number[]       = [10, 20];
  subscription        : Subscription   = new Subscription();
  items: MenuItem[] | undefined;
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
  showSearchDialog: boolean = false;
  @ViewChild('searchInput') searchInput!: ElementRef;
  dt!: Table;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService
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
        label: 'Opciones',
        icon: 'pi pi-sitemap',
        command: () => {
          if (this.selectedRow) {
            this.opciones(this.selectedRow);
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
    this.store.dispatch(getEmpresaRequest());
    // Suscribirse al observable
    this.subscription.add(
      this.store.select(selectEmpresa).pipe(
        map(empresa => Array.isArray(empresa) ? empresa : [])
      ).subscribe(empresa => {
        this.data = empresa || []; // Asegurarse de que siempre sea un array
      })
    );
  }

  openNew() {  
    this.router.navigate(['desk/seguridad/administracion/empresa/ins-empresa']);
  }

  edit(data: any) {  
    const dato = btoa(JSON.stringify(data));    
    this.router.navigate(['desk/seguridad/administracion/empresa/up-empresa/'+ dato]);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  del(data: any) {
    this.store.dispatch(incrementarRequest({request: 2}));
   // this.store.dispatch(deleteRolesRequest({roles: data}));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportCSV() {
    this.excelService.exportAsExcelFile(this.data, 'roles');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getEmpresaRequest());
  }

  opciones(data: any) {
    const dato = btoa(JSON.stringify(data));
    this.router.navigate(['desk/seguridad/administracion/empresa/adm-opciones/'+ dato]);
  }

  onActionClick(item: any) {
    this.selectedRow = item;
  }

  onRowUnselect(event: any) {
    this.selectedRow = null;
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.p-datatable') && !target.closest('.p-splitbutton-panel')) {
      this.selectedRow = null;
    }
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
