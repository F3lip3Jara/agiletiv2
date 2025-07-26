import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrl: './sector.component.scss'
})
export class SectorComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;
  showSearchDialog: boolean = false;
  data$: Observable<any[]>;
  loading: boolean = false;
  data: any[] = [];
  treeData: TreeNode[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions: number[] = [10, 20];
  subscription: Subscription = new Subscription();
  selectedRow: any = null;
  actionItems: MenuItem[] = [];
  globalFilterFields: string[] = ['name', 'code', 'type'];
  almacen: any;
  centro: any;
  
  // Propiedades para importación Excel
  importDialogVisible: boolean = false;
  uploadedFiles: any[] = [];
  
  // Propiedades para gestión de ubicaciones
  ubicacionDialogVisible: boolean = false;
  ubicacion: any = {
    code: '',
    active: 1,
    volume: null,
    height: null,
    width: null,
    length: null
  };
  activeOptions = [
    { label: 'Activo', value: 1 },
    { label: 'Inactivo', value: 0 }
  ];

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
      this.transformDataToTree();
    });
  }

  // Transformar datos planos a estructura de árbol
  transformDataToTree() {
    this.treeData = this.data.map(sector => ({
      data: {
        id: sector.sectorId,
        name: sector.secDes,
        code: sector.secCod,
        type: 'sector',
        active: 1,
        volume: null,
        height: null,
        width: null,
        length: null
      },
      children: this.getUbicacionesForSector(sector.sectorId).map((ubicacion: any) => ({
        data: {
          id: ubicacion.id,
          name: ubicacion.nombre,
          code: ubicacion.codigo,
          type: 'ubicacion',
          active: ubicacion.activo,
          volume: ubicacion.volumen,
          height: ubicacion.alto,
          width: ubicacion.ancho,
          length: ubicacion.largo
        }
      }))
    }));
  }

  // Simular obtención de ubicaciones para un sector
  getUbicacionesForSector(sectorId: number): any[] {
    // Aquí normalmente harías una llamada al servicio para obtener las ubicaciones
    // Por ahora simulamos datos de ejemplo
    const ubicacionesEjemplo = [
      {
        id: 1,
        nombre: 'Ubicación A1',
        codigo: 'U001',
        activo: 1,
        volumen: 1000,
        alto: 10,
        ancho: 10,
        largo: 10
      },
      {
        id: 2,
        nombre: 'Ubicación A2',
        codigo: 'U002',
        activo: 1,
        volumen: 2000,
        alto: 20,
        ancho: 10,
        largo: 10
      }
    ];
    
    return ubicacionesEjemplo;
  }

  // Obtener acciones según el tipo de elemento
  getActionItems(item: any): MenuItem[] {
    if (item.type === 'sector') {
      return [
        {
          label: 'Editar Sector',
          icon: 'pi pi-pencil',
          command: () => this.edit(item)
        },
        {
          label: 'Nueva Ubicación',
          icon: 'pi pi-plus',
          command: () => this.openNewUbicacion(item)
        },
        {
          label: 'Eliminar Sector',
          icon: 'pi pi-trash',
          command: () => this.del(item)
        }
      ];
    } else {
      return [
        {
          label: 'Editar Ubicación',
          icon: 'pi pi-pencil',
          command: () => this.editUbicacion(item)
        },
        {
          label: 'Eliminar Ubicación',
          icon: 'pi pi-trash',
          command: () => this.delUbicacion(item)
        }
      ];
    }
  }

  // Métodos para importación Excel
  showImportDialog() {
    this.importDialogVisible = true;
  }

  onUpload(event: any) {
    const file = event.files[0];
    if (file) {
      this.uploadedFiles = [file];
      this.processExcelFile(file);
    }
  }

  removeFile(file: any) {
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
  }

  processExcelFile(file: any) {
    // Aquí implementarías la lógica para procesar el archivo Excel
    // Por ahora solo mostramos un mensaje de éxito
    this.messageService.add({
      severity: 'success',
      summary: 'Archivo cargado',
      detail: `Archivo ${file.name} cargado correctamente`
    });
    
    // Simular procesamiento de datos
    setTimeout(() => {
      this.importDialogVisible = false;
      this.uploadedFiles = [];
      this.messageService.add({
        severity: 'info',
        summary: 'Procesamiento completado',
        detail: 'Las ubicaciones han sido importadas correctamente'
      });
      // Recargar datos
      this.refresh();
    }, 2000);
  }

  // Métodos para gestión de ubicaciones
  openNewUbicacion(sector: any) {
    this.ubicacion = {
      code: '',
      active: 1,
      volume: null,
      height: null,
      width: null,
      length: null
    };
    this.ubicacionDialogVisible = true;
  }

  editUbicacion(ubicacion: any) {
    this.ubicacion = { ...ubicacion };
    this.ubicacionDialogVisible = true;
  }

  saveUbicacion() {
    // Aquí implementarías la lógica para guardar la ubicación
    this.messageService.add({
      severity: 'success',
      summary: 'Ubicación guardada',
      detail: 'La ubicación se ha guardado correctamente'
    });
    this.ubicacionDialogVisible = false;
    // Recargar datos
    this.refresh();
  }

  delUbicacion(ubicacion: any) {
    // Aquí implementarías la lógica para eliminar la ubicación
    this.messageService.add({
      severity: 'warn',
      summary: 'Ubicación eliminada',
      detail: 'La ubicación se ha eliminado correctamente'
    });
    // Recargar datos
    this.refresh();
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
    const value = (event.target as HTMLInputElement).value;
    table.filterGlobal(value, 'contains');
    console.log('Filtro global aplicado:', value);
  }

  del(data: any) {
    this.store.dispatch(incrementarRequest({request: 2}));
    // this.store.dispatch(delete{INTERFACE_NAME}Request({{data: data}}));
    this.messageService.add({
      severity: 'warn',
      summary: 'Sector eliminado',
      detail: 'El sector se ha eliminado correctamente'
    });
    // Recargar datos
    this.refresh();
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

  onSearchValueChange(value: string) {
    if (this.searchInput && this.searchInput.nativeElement) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      inputElement.value = value;
      // Disparar el evento input para activar el filtro del TreeTable
      const event = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(event);
      
      // También aplicar el filtro directamente al TreeTable si es necesario
      if (value.trim()) {
        // El filtro se aplicará automáticamente a través del evento input
        console.log('Búsqueda aplicada:', value);
      }
    }
  }
} 