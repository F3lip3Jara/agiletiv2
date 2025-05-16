import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Usuario, USUARIO_KEYS } from '../state/interface/usuarios.interface';
import { AppState } from '../../app.state';
import { Store } from '@ngrx/store';
import { desactivarUsuarioRequest, desactivarUsuarioSuccess, getUsuariosRequest, getUsuariosSuccess, reiniciarUsuarioRequest, reiniciarUsuarioSuccess, usuariosError , aplicarFiltrosRequest , aplicarFiltrosSuccess } from '../state/actions/usuarios.actions';
import { selectUsuarioById } from '../state/selectors/usuarios.selectors';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { incrementarRequest } from '../../state/actions/estado.actions';
import { ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { ExcelService } from '../../../service/excel.service';
import { MenuItem } from 'primeng/api';

@Component({
  standalone:false,
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

  
  @ViewChild('searchInput') searchInput!: ElementRef;

  usuarios          : Observable<Usuario[]>  = new Observable;
  loading           : boolean        = false;
  globalFilterFields: string[]       = USUARIO_KEYS;
  data              : any[]          = []; // Tipado correcto
  selectedProducts  : Usuario[]      = [];
  submitted         : boolean        = false;
  cols              : any[]          = [];
  statuses          : any[]          = [];
  rowsPerPageOptions: number[]       = [10, 20];
  subscription      : Subscription   = new Subscription();
  items: MenuItem[] | undefined;
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
   // Propiedades para el diálogo de búsqueda
   showSearchDialog: boolean = false;
   dt!: Table;
   sidebarVisible = false;
   colums: any[] = [];
   COMPONENT_SELECTOR = 'app-usuarios';


  constructor(private store: Store<AppState>,
              private router: Router,
              private actions$: Actions,
              private messageService: MessageService,
              private excelService: ExcelService
  ) { 
    this.actionItems = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => {
           this.edit(this.selectedRow.id);          
        }
      },
      {
        label: 'Activar/Desactivar',
        icon: 'pi pi-stop-circle',
        command: () => {      
            this.desactivarUsuario(this.selectedRow);
          
        }
      },
      {
        label: 'Reiniciar',
        icon: 'pi pi-refresh',
        command: () => {         
            this.reiniciarUsuario(this.selectedRow);          
        }
      }
    ];
  }
  

  ngOnInit(): void {
    
   this.store.dispatch(getUsuariosRequest());
   this.store.dispatch(incrementarRequest({request: 1}));
    this.actions$.pipe(
      ofType(getUsuariosSuccess)
    ).subscribe((data : any)=>{
      this.data = data.usuarios;
      this.colums = data.colums;
    }); 
   
     this.globalFilterFields = USUARIO_KEYS;
    }

openNew() {  
  this.router.navigate(['desk/seguridad/usuarios/insusuarios']);
}

edit(id: number) {  
  let usuario$ = this.store.select(selectUsuarioById, { id });  
  this.subscription.add(
    usuario$.subscribe(usuario => {
      if (usuario && id > 0) {
        const dato = btoa(JSON.stringify(usuario));
        this.router.navigate(['desk/seguridad/usuarios/upusuarios/' + dato]);
      }
    })
  );
}


  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  desactivarUsuario(usuario : any) {
    this.store.dispatch(incrementarRequest({request: 2}));
    this.store.dispatch(desactivarUsuarioRequest({usuario: usuario}));
    this.actions$.pipe(
      ofType(desactivarUsuarioSuccess)
    ).subscribe(() => {
      this.store.dispatch(getUsuariosRequest());
    });

    this.actions$.pipe(
      ofType(usuariosError)
    ).subscribe((error) => {
      this.messageService.add({severity:'error', summary:'Error', detail:error.error});
    });
  }


  reiniciarUsuario(usuario : any) {
    this.store.dispatch(incrementarRequest({request: 2}));
    this.store.dispatch(reiniciarUsuarioRequest({usuario: usuario}));
    this.actions$.pipe(
      ofType(reiniciarUsuarioSuccess)
    ).subscribe(() => {
      this.store.dispatch(getUsuariosRequest());
    });

    this.actions$.pipe(
      ofType(usuariosError)
    ).subscribe((error) => {
      this.messageService.add({severity:'error', summary:'Error', detail:error.error});
    });
  }

  exportCSV() {
    this.excelService.exportAsExcelFile(this.data, 'usuarios');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getUsuariosRequest());
  }

  onRowSelect(event: any) {
    this.selectedRow = event.data;
  }

  onRowUnselect(event: any) {
    this.selectedRow = null;
  }

  onActionClick(item: any) {
    this.selectedRow = item;
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
    ).subscribe((data : any)=>{
      this.data = data.usuarios;
      this.colums = data.colums;
    });
  }

}
