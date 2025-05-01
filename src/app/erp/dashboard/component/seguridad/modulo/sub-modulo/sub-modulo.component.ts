import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { AppState } from '../../../app.state';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { ExcelService } from 'src/app/erp/dashboard/service/excel.service';
import { MessageService } from 'primeng/api';
import { deleteSubModuloRequest, deleteSubModuloSuccess, getSubModuloRequest } from '../../state/actions/submodulo.actions';
import { selectSubModulo } from '../../state/selectors/submodulo.selectors';
import { ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { SubModulo } from '../../state/interface/submodulo.interface';
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
   this.data$ = this.store.select(selectSubModulo).pipe(
      map(subModulo => Array.isArray(subModulo) ? subModulo : [])
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
    this.route.params.subscribe(params => {
      this.modulo = JSON.parse(atob(params['modulo']));
      
    });
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getSubModuloRequest({modulo: this.modulo}));
    this.subscription.add(
      this.data$.subscribe(subModulo => {
        this.data = subModulo || [];
      })
    );
  }

  openNew() {  
    const dato = btoa(JSON.stringify(this.modulo));    
    this.router.navigate(['desk/seguridad/modulos/submodulos/inssubmodulo/'+ dato]);
  }

  edit(submodulo: any) {  
    const dato = btoa(JSON.stringify({submodulo: submodulo, modulo: this.modulo}));    
    this.router.navigate(['desk/seguridad/modulos/submodulos/upsubmodulo/'+ dato]);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  del(data: any) {
    this.store.dispatch(incrementarRequest({request: 2}));
  
    const submodulo: SubModulo = {
      molsId: data.molsId,
      molId: data.molId,
      molsDes: data.molsDes,
      empId: data.empId,
      opt: data.opt,
      modulo: this.modulo
    }; 
    this.store.dispatch(deleteSubModuloRequest({submodulo: submodulo}));
    this.actions$.pipe(
      ofType(deleteSubModuloSuccess),
      take(1)
    ).subscribe((resp) => {
   
      this.store.dispatch(getSubModuloRequest({modulo: this.modulo}));
    });
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportCSV() {
    this.excelService.exportAsExcelFile(this.data, 'sub-modulo');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getSubModuloRequest({modulo: this.modulo}));
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
