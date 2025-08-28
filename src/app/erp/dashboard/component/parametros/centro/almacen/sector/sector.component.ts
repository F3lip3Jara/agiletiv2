import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
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
import { createUbicacionesRequest, createUbicacionesSuccess, getUbicacionesRequest, getUbicacionesSuccess } from '../../../state/actions/ubicaciones.actions';
import * as XLSX from 'xlsx';

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
    // Primero crear la estructura básica de sectores sin ubicaciones
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
      children: [] // Inicialmente vacío, se llenará después
    }));
    
    // Luego obtener las ubicaciones para cada sector de manera optimizada
    this.cargarUbicaciones();
  }

  
  private cargarUbicaciones() {
    
    // Crear un mapa para almacenar las ubicaciones por sector
    const ubicacionesPorSector = new Map<number, any[]>();
    
    // Obtener todos los sectores que necesitan ubicaciones
    const sectores = this.data.map(sector => sector.sectorId);
   // console.log('Sectores a cargar ubicaciones:', sectores);
    
    // Hacer una sola llamada para obtener todas las ubicaciones
    this.store.dispatch(getUbicacionesRequest({ sectorId: 0 })); // 0 para obtener todas
    
    // Suscribirse a la respuesta una sola vez
    const ubicacionesSubscription = this.actions$.pipe(
      ofType(getUbicacionesSuccess),
      take(1), // Solo tomar la primera respuesta
      map((action: any) => {
     //   console.log('Ubicaciones recibidas:', action.ubicaciones);
        return action.ubicaciones;
      })
    ).subscribe((ubicaciones: any[]) => {
      // Agrupar ubicaciones por sector
      if (ubicaciones && Array.isArray(ubicaciones)) {
        ubicaciones.forEach(ubicacion => {
          const sectorId = ubicacion.sectorId || ubicacion.sector_id;
          if (sectorId) {
            if (!ubicacionesPorSector.has(sectorId)) {
              ubicacionesPorSector.set(sectorId, []);
            }
            ubicacionesPorSector.get(sectorId)!.push(ubicacion);
          }
        });
      }
      
      // Actualizar el treeData con las ubicaciones
      this.actualizarTreeDataConUbicaciones(ubicacionesPorSector);
      
      // Limpiar la suscripción
      ubicacionesSubscription.unsubscribe();
    });
    
    // Agregar la suscripción al subscription para limpieza
    this.subscription.add(ubicacionesSubscription);
  }
  
  // Método para actualizar el treeData con las ubicaciones
  private actualizarTreeDataConUbicaciones(ubicacionesPorSector: Map<number, any[]>) {
    this.treeData = this.treeData.map(sectorNode => {
      const sectorId = sectorNode.data.id;
      const ubicaciones = ubicacionesPorSector.get(sectorId) || [];
      
      return {
        ...sectorNode,
        children: ubicaciones.map((ubicacion: any) => ({
          data: {
            id: ubicacion.ubicacionId || ubicacion.id,
            name: ubicacion.ubiDes || ubicacion.nombre,
            code: ubicacion.ubiCod || ubicacion.codigo,
            type: 'ubicacion',
            active: ubicacion.ubiAct || ubicacion.activo || 1,
            volume: ubicacion.ubiVol || ubicacion.volumen,
            height: ubicacion.ubiAlto || ubicacion.alto,
            width: ubicacion.ubiAncho || ubicacion.ancho,
            length: ubicacion.ubiLargo || ubicacion.largo
          }
        }))
      };
    });
    
   // console.log('TreeData actualizado con ubicaciones:', this.treeData);
  }

  // Método para obtener ubicaciones de un sector específico (si es necesario)
  getUbicacionesForSector(sectorId: number): any[] {
    // Buscar en el treeData actual
    const sectorNode = this.treeData.find(node => node.data.id === sectorId);
    if (sectorNode && sectorNode.children) {
      return sectorNode.children.map((child: any) => child.data);
    }
    return [];
  }

  // Métodos para importación Excel
  showImportDialog() {
    this.importDialogVisible = true;
  }

  // Método para descargar el formato del archivo Excel
  downloadFormat() {
   // console.log('TreeData para formato:', this.treeData);
    
    // Crear un array plano de ubicaciones con sus sectores
    const formatData: any[] = [];
    
    this.treeData.forEach(sector => {
      // Si el sector tiene ubicaciones, agregarlas al formato
      if (sector.children && sector.children.length > 0) {
        sector.children.forEach((ubicacion: any) => {
          formatData.push({
            'Sector': sector.data.code || '',
            'Ubicación': ubicacion.data.code || '',
            'Activo': ubicacion.data.active || 1,
            'cm3': ubicacion.data.volume || 0,
            'Alto': ubicacion.data.height || 0,
            'Ancho': ubicacion.data.width || 0,
            'Largo': ubicacion.data.length || 0
          });
        });
      } else {
        // Si el sector no tiene ubicaciones, agregar una fila de ejemplo
        formatData.push({
          'Sector': sector.data.code || '',
          'Ubicación': '-',
          'Activo': '-',
          'cm3': '-',
          'Alto': '-',
          'Ancho': '-',
          'Largo': '-'
        });
      }
    });
    
   // console.log('Datos de formato generados:', formatData);
    this.excelService.exportAsExcelFile(formatData, 'formato_importacion_ubicaciones');
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
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      try {
        // Leer el archivo Excel usando XLSX
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Obtener la primera hoja
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convertir a JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Validar que hay datos
        if (!jsonData || jsonData.length < 2) {
          this.showValidationError('El archivo Excel no contiene datos válidos o está vacío.');
          return;
        }
        
        // Obtener encabezados (primera fila)
        const headers = jsonData[0] as string[];
        
        // Validar encabezados requeridos
        const requiredHeaders = ['Sector', 'Ubicación', 'Activo', 'cm3', 'Alto', 'Ancho', 'Largo'];
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
        
        if (missingHeaders.length > 0) {
          this.showValidationError(`Faltan los siguientes encabezados requeridos: ${missingHeaders.join(', ')}`);
          return;
        }
        
        // Procesar datos (excluyendo la fila de encabezados)
        const processedData = [];
        const errors = [];
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          const rowNumber = i + 1;
          
          // Validar que la fila no esté vacía
          if (!row || row.length === 0 || row.every(cell => cell === null || cell === undefined || cell === '')) {
            continue; // Saltar filas vacías
          }
          
          // Crear objeto de datos
          const rowData = {
            sector: row[headers.indexOf('Sector')],
            ubicacion: row[headers.indexOf('Ubicación')],
            activo: row[headers.indexOf('Activo')],
            volumen: row[headers.indexOf('cm3')],
            alto: row[headers.indexOf('Alto')],
            ancho: row[headers.indexOf('Ancho')],
            largo: row[headers.indexOf('Largo')]
          };
          
          // Validar datos de la fila
          const rowErrors = this.validateRowData(rowData, rowNumber);
          if (rowErrors.length > 0) {
            errors.push(...rowErrors);
          } else {
            processedData.push(rowData);
          }
        }
        
        // Si hay errores, mostrarlos
        if (errors.length > 0) {
          this.showValidationError(`Se encontraron ${errors.length} errores en el archivo:\n${errors.join('\n')}`);
          return;
        }
        
        // Si no hay datos válidos
        if (processedData.length === 0) {
          this.showValidationError('No se encontraron datos válidos en el archivo Excel.');
          return;
        }
        
        // Si todo está correcto, mostrar éxito y preparar para backend
        this.showValidationSuccess(processedData);
        
      } catch (error) {
        console.error('Error al procesar el archivo Excel:', error);
        this.showValidationError('Error al procesar el archivo Excel. Verifique que el archivo sea válido.');
      }
    };
    
    reader.onerror = () => {
      this.showValidationError('Error al leer el archivo.');
    };
    
    reader.readAsArrayBuffer(file);
  }
  
  private validateRowData(rowData: any, rowNumber: number): string[] {
    const errors = [];
    
    // Validar Sector
    if (!rowData.sector || typeof rowData.sector !== 'string' || rowData.sector.trim() === '') {
      errors.push(`Fila ${rowNumber}: El campo 'Sector' es requerido y debe ser texto`);
    }
    
    // Validar Ubicación
    if (!rowData.ubicacion || typeof rowData.ubicacion !== 'string' || rowData.ubicacion.trim() === '') {
      errors.push(`Fila ${rowNumber}: El campo 'Ubicación' es requerido y debe ser texto`);
    }
    
    // Validar Activo
    if (rowData.activo !== 0 && rowData.activo !== 1) {
      errors.push(`Fila ${rowNumber}: El campo 'Activo' debe ser 0 (inactivo) o 1 (activo)`);
    }
    
    // Validar Volumen (cm3)
    if (rowData.volumen === null || rowData.volumen === undefined || isNaN(rowData.volumen) || rowData.volumen <= 0) {
      errors.push(`Fila ${rowNumber}: El campo 'cm3' debe ser un número mayor a 0`);
    }
    
    // Validar Alto
    if (rowData.alto === null || rowData.alto === undefined || isNaN(rowData.alto) || rowData.alto <= 0) {
      errors.push(`Fila ${rowNumber}: El campo 'Alto' debe ser un número mayor a 0`);
    }
    
    // Validar Ancho
    if (rowData.ancho === null || rowData.ancho === undefined || isNaN(rowData.ancho) || rowData.ancho <= 0) {
      errors.push(`Fila ${rowNumber}: El campo 'Ancho' debe ser un número mayor a 0`);
    }
    
    // Validar Largo
    if (rowData.largo === null || rowData.largo === undefined || isNaN(rowData.largo) || rowData.largo <= 0) {
      errors.push(`Fila ${rowNumber}: El campo 'Largo' debe ser un número mayor a 0`);
    }
    
    return errors;
  }
  
  private showValidationError(message: string) {
    this.importDialogVisible = false;
    this.uploadedFiles = [];
    this.messageService.add({
      severity: 'error',
      summary: 'Error de validación',
      detail: message,
      life: 10000
    });
  }
  
  private showValidationSuccess(processedData: any[]) {
    this.importDialogVisible = false;
    this.uploadedFiles = [];
    
    let datos = {
      centroId: this.centro.centroId,
      almacenId: this.almacen.almId,
      ubicaciones: processedData
    }

     //console.log(datos);

    this.store.dispatch(createUbicacionesRequest({datos: datos}));
    this.actions$.pipe(
      ofType(createUbicacionesSuccess)
    ).subscribe((action :any) => {     
   //     console.log(action);
        // Recargar datos
        this.refresh();
        
    });
    
    
  }

  // Métodos para gestión de ubicaciones
  openNewUbicacion(sector: any) {
    console.log('Abriendo modal de nueva ubicación para sector:', sector);
    this.ubicacion = {
      code: '',
      active: 1,
      volume: null,
      height: null,
      width: null,
      length: null
    };
    this.ubicacionDialogVisible = true;
    console.log('Modal de ubicación visible:', this.ubicacionDialogVisible);
  }

  editUbicacion(ubicacion: any) {
    console.log('Editando ubicación:', ubicacion);
    this.messageService.add({
      severity: 'info',
      summary: 'Editando ubicación',
      detail: `Editando ubicación: ${ubicacion.name}`
    });
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
    console.log('Eliminando ubicación:', ubicacion);
    // Aquí implementarías la lógica para eliminar la ubicación
    this.messageService.add({
      severity: 'warn',
      summary: 'Ubicación eliminada',
      detail: `La ubicación ${ubicacion.name} se ha eliminado correctamente`
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
    console.log('Editando sector:', data);
    this.messageService.add({
      severity: 'info',
      summary: 'Editando sector',
      detail: `Editando sector: ${data.name}`
    });
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
    console.log('Eliminando sector:', data);
    this.store.dispatch(incrementarRequest({request: 2}));
    // this.store.dispatch(delete{INTERFACE_NAME}Request({{data: data}}));
    this.messageService.add({
      severity: 'warn',
      summary: 'Sector eliminado',
      detail: `El sector ${data.name} se ha eliminado correctamente`
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
    this.actions$.pipe(
      ofType(getSectorSuccess)
    ).subscribe((action :any) => {     
      this.data = action.sector.data;
      this.transformDataToTree();
    });
  }
  
  // Método para actualizar un sector específico con sus ubicaciones
  private actualizarSectorConUbicaciones(sectorId: number, ubicaciones: any[]) {
    this.treeData = this.treeData.map(sectorNode => {
      if (sectorNode.data.id === sectorId) {
        return {
          ...sectorNode,
          children: ubicaciones.map((ubicacion: any) => ({
            data: {
              id: ubicacion.ubicacionId || ubicacion.id,
              name: ubicacion.ubiDes || ubicacion.nombre,
              code: ubicacion.ubiCod || ubicacion.codigo,
              type: 'ubicacion',
              active: ubicacion.ubiAct || ubicacion.activo || 1,
              volume: ubicacion.ubiVol || ubicacion.volumen,
              height: ubicacion.ubiAlto || ubicacion.alto,
              width: ubicacion.ubiAncho || ubicacion.ancho,
              length: ubicacion.ubiLargo || ubicacion.largo
            }
          }))
        };
      }
      return sectorNode;
    });
    
    console.log('Sector', sectorId, 'actualizado con ubicaciones');
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