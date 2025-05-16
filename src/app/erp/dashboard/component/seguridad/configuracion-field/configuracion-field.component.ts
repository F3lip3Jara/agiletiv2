import { Component, OnInit, OnDestroy, ViewChild  , ElementRef} from '@angular/core';
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
import { CONFIG_FIELD_KEYS } from '../state/interface/configField.interface';
import { getConfigFieldRequest, getConfigFieldSuccess, updateConfigFieldRequest, updateConfigFieldSuccess } from '../state/actions/configField.actions';
import { Actions, ofType } from '@ngrx/effects';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-configuracion-field',
  templateUrl: './configuracion-field.component.html',
  styleUrl: './configuracion-field.component.scss',
  providers: [MessageService]
})
export class ConfiguracionFieldComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;
  data$: Observable<any[]>;
  loading: boolean = false;
  data: any[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions: number[] = [10, 20];
  subscription: Subscription = new Subscription();
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
  globalFilterFields  : string[]       =CONFIG_FIELD_KEYS;
  importDialogVisible: boolean = false;
  uploadedFiles: any[] = [];
    // Propiedades para el diálogo de búsqueda
    showSearchDialog: boolean = false;
    dt!: Table;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private excelService: ExcelService,
    private messageService: MessageService,
    private action$: Actions,
  
  ) {
  
  }

  ngOnInit(): void {
   this.store.dispatch(incrementarRequest({request: 1}));
   this.store.dispatch(getConfigFieldRequest());
   this.action$.pipe(
    ofType(getConfigFieldSuccess),
    map(action => action.configField)
  ).subscribe(data => {
    this.data = data;
  }); 

  
  }

 
 onGlobalFilter(table: Table, event: Event) {
    this.dt = table;
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportCSV() {
    this.excelService.exportAsExcelFile(this.data, 'configuracion-field');
  }

  refresh() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getConfigFieldRequest());
    this.action$.pipe(
     ofType(getConfigFieldSuccess),
     map(action => action.configField)
   ).subscribe(data => {
     this.data = data;
   }); 
   
  }

  onActionClick(item: any) {
    this.selectedRow = item;
  }

  showImportDialog() {
    this.importDialogVisible = true;
  }

  onUpload(event: any) {
    this.loading = true;
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      // Validar datos
      const validationResult = this.validateExcelData(jsonData);
      if (!validationResult.isValid) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error de validación',
          detail: validationResult.message
        });
        this.loading = false;
        return;
      }
      this.store.dispatch(incrementarRequest({request: 2}));
      this.store.dispatch(updateConfigFieldRequest({configField: jsonData}));
      
      this.action$.pipe(
        ofType(updateConfigFieldSuccess),
        map(action => action)
      ).subscribe(data => {
          this.store.dispatch(getConfigFieldRequest());
          this.action$.pipe(
            ofType(getConfigFieldSuccess),
            map(action => action.configField)
          ).subscribe(data => {
            this.data = data;
          });
      });
      
      // Enviar datos al backend
   //   this.configFieldService.updateConfigFieldFromExcel(jsonData).subscribe({
        
    };

    reader.readAsArrayBuffer(file);
  }

  private validateExcelData(data: any[]): { isValid: boolean; message: string } {
    for (const row of data) {
      if (!row.id) {
        return { isValid: false, message: 'El campo id no puede estar vacío' };
      }
      if (row.is_filterable !== 0 && row.is_filterable !== 1) {
        return { isValid: false, message: 'El campo is_filterable debe ser 0 o 1' };
      }
    }
    return { isValid: true, message: '' };
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
}
