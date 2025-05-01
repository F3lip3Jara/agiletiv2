import { Component, OnInit, ViewChild, ElementRef, NgZone, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Environment } from 'src/app/erp/service/environment.service';
import { Almacen } from '../../../parametros/state/interface/almacen.interface';
import { Centro } from '../../../parametros/state/interface/centro.interface';
import { Producto } from '../../../parametros/state/interface/producto.interface';
import { Proveedor } from '../../../parametros/state/interface/proveedor.interface';
import { Clase } from '../../../parametros/state/interface/clase.interface';  
import { Store } from '@ngrx/store';    
import { AppState } from '../../../app.state';
import { Actions, ofType } from '@ngrx/effects';
import { getClaseRequest, getClaseSuccess } from '../../../parametros/state/actions/clase.actions';
import { getAlmacenRequest, getAlmacenSuccess } from '../../../parametros/state/actions/almacen.actions';
import { getCentroRequest, getCentroSuccess } from '../../../parametros/state/actions/centro.actions';
import { getProductosRequest, getProductoSuccess } from '../../../parametros/state/actions/producto.actions';
import { getProveedorRequest, getProveedorSuccess } from '../../../parametros/state/actions/proveedor.actions';
import { take, takeUntil } from 'rxjs/operators';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';
import { createPedidonacRequest, createPedidonacSuccess } from '../../state/actions/pedidonac.actions'    ;
import { incrementarRequest } from '../../../state/actions/estado.actions';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { getEmpresaPdfRequest, getEmpresaPdfSuccess } from '../../state/actions/pedidonac.actions';
import { selectEmpresaPdf } from '../../state/selectors/pedidonac.selectors';
import { Router } from '@angular/router';
registerLocaleData(localeEs, 'es', localeEsExtra);

declare global {
  interface Window {
    google: typeof google;
  }
}

interface ProductoSeleccionado extends Producto {
  cantidad: number;
  subtotal: number;
  total:number;
}

@Component({
  selector: 'app-ins-pedido',
  templateUrl: './ins-pedido.component.html',
  styleUrl: './ins-pedido.component.scss'
})
export class InsPedidoComponent {
  @ViewChild('mapEnvio') mapEnvioElement!: ElementRef;
  @ViewChild('fileUpload') fileUpload: any;

  pedidoForm: FormGroup;
  loading = false;
  centros: Centro[] = [];  
  almacenes: Almacen[] = [];
  productos: Producto[] = [];
  proveedores: Proveedor[] = []; 
  proveedorSeleccionado: Proveedor | null = null;
  productosSeleccionados: ProductoSeleccionado[] = [];
  tiposDocumento: Clase[] = [];
  total: number = 0;
  totalProducto: number = 0;
  almacenesFiltrados: Almacen[] = [];
  visible: boolean = false;
  uploadedFiles: any[] = [];
  // Google Maps properties
  mapEnvio: google.maps.Map | null = null;
  markerEnvio: google.maps.Marker | null = null;
  archivoSeleccionado: any = null;
  excelData: any[] = [];
  empresa: any;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private ngZone: NgZone,
    private environment: Environment, 
    private actions$: Actions,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.store.dispatch(incrementarRequest({ request: 4 }));
    this.store.dispatch(getClaseRequest());
    this.store.dispatch(getCentroRequest()); 
    this.store.dispatch(getProductosRequest());
    this.store.dispatch(getProveedorRequest());
    this.store.dispatch(getEmpresaPdfRequest());

    this.actions$.pipe(
      ofType(getClaseSuccess, getCentroSuccess, getProductoSuccess, getProveedorSuccess, getEmpresaPdfSuccess)
    ).subscribe((data) => {
      switch(data.type){
        case "[Clase] Get Clase Success":
          this.tiposDocumento = data.clase.filter(c => c.clasTip === 'E'); 
          break;
        case "[Centro] Get Centro Success":
          this.centros = data.centro;
          break;
        case "[Productos] Get Productos Success":
          this.productos = data.productos.filter(p => p.tipo === 'FISICO');
          break;
        case "[Proveedor] Get Proveedor Success":
          this.proveedores = data.proveedor.filter(p => p.activado === 'S' && p.es_proveedor === 'S');
          break;
        case "[Pedidonac] Obtener empresa para PDF exitosa":
          this.empresa = data.empresa;
          break;
      }
    }); 

    this.loadGoogleMaps();
  }

  private initForm() {
    this.pedidoForm = this.fb.group({
      fechaCreacion: [new Date(), Validators.required],
      tipoDocumento: ['', Validators.required],
      estado: ['pendiente_aprobacion', Validators.required],
      proveedor: ['', Validators.required],
      centro: ['', Validators.required],
      almacen: new FormControl({value: '', disabled: true}, Validators.required),
      direccionEnvio: [''],
      correoElectronico: ['', [Validators.email]],
      latitudEnvio: [''],
      longitudEnvio: [''],
      notas: [''],
      fechaPromesaEntrega: [new Date(), Validators.required],
      documentoRelacionado: ['']  
    });

    // Suscribirse a cambios en el centro
    this.pedidoForm.get('centro')?.valueChanges.subscribe(centroId => {
      this.filtrarAlmacenes(centroId);
      this.actualizarUbicacionCentro(centroId);
      this.actualizarDatosCentro(centroId);
      
      // Habilitar/deshabilitar el campo almacen según si hay un centro seleccionado
      const almacenControl = this.pedidoForm.get('almacen');
      if (almacenControl) {
        if (centroId) {
          almacenControl.enable();
        } else {
          almacenControl.disable();
        }
      }
    });

    this.pedidoForm.get('proveedor')?.valueChanges.subscribe(proveedorId => {
      this.proveedorSeleccionado = this.proveedores.find(p => p.id === proveedorId) || null;   
    });
  }

  private actualizarDatosCentro(centroId: number) {
    const centro = this.centros.find(c => c.centroId === centroId);
    if (centro) {
      this.pedidoForm.patchValue({
        direccionEnvio: centro.cenDir,
        correoElectronico: centro.centEmail,
        latitudEnvio: centro.cenLat || '',
        longitudEnvio: centro.cenLong || ''
      });
    }
  }

  private loadGoogleMaps() {
    if (typeof window.google !== 'undefined' && window.google.maps) {
      this.initMapEnvio();
      return;
    }

    const script = document.createElement('script');
    script.src = this.environment.keygoogle;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initMapEnvio();
    };
    document.body.appendChild(script);
  }

  private initMapEnvio() {
    if (!this.mapEnvioElement?.nativeElement) {
      setTimeout(() => this.initMapEnvio(), 100);
      return;
    }

    const defaultLocation = { lat: -33.4489, lng: -70.6693 }; // Santiago, Chile
    const mapOptions = {
      center: defaultLocation,
      zoom: 12
    };

    this.mapEnvio = new window.google.maps.Map(this.mapEnvioElement.nativeElement, mapOptions);
  }

  private actualizarUbicacionCentro(centroId: number) {
    if (!this.mapEnvio) return;
    const centro = this.centros.find(c => c.centroId === centroId);
    if (centro && centro.cenLat && centro.cenLong) {
      const position = {
        lat: parseFloat(centro.cenLat),
        lng: parseFloat(centro.cenLong)
      };

      // Limpiar marcador anterior
      if (this.markerEnvio) {
        this.markerEnvio.setMap(null);
      }

      // Crear nuevo marcador
      this.markerEnvio = new window.google.maps.Marker({
        position: position,
        map: this.mapEnvio,
        title: centro.cenDes
      });

      this.mapEnvio.setCenter(position);
      this.mapEnvio.setZoom(15);
    }
  }

  filtrarAlmacenes(centroId: number) {  
    let dato = {centroId: centroId, cenDes: 'Centro de Envio'}; 
    this.store.dispatch(getAlmacenRequest({ centro: dato }));
    this.actions$.pipe(
      ofType(getAlmacenSuccess)
    ).subscribe((data: any) => {
      this.almacenes = data.almacen;
      this.almacenesFiltrados = this.almacenes.filter(alm => alm.centroId === centroId);
      this.pedidoForm.patchValue({ almacen: '' });
    });
  }

  private calcularSubtotal(producto: ProductoSeleccionado): number {
    return producto.neto * producto.cantidad;
  }

  private calcularIVA(subtotal: number): number {
    return Math.round(subtotal * 0.19);
  }

  private calcularTotalLinea(producto: ProductoSeleccionado): number {
    const subtotal = this.calcularSubtotal(producto);
    const iva = this.calcularIVA(subtotal);
    return subtotal + iva;
  }

  calcularTotalProducto(producto: ProductoSeleccionado): number {
    return this.calcularTotalLinea(producto);
  }

  calcularTotal() {
    // Sumamos los totales de cada línea
    this.total = this.productosSeleccionados.reduce((sum, producto) => 
      sum + this.calcularTotalLinea(producto), 0);

    this.totalProducto = this.productosSeleccionados.reduce((sum, producto) => 
      sum + producto.cantidad, 0);
    
  }

  agregarProducto(producto: Producto) {
    const productoExistente = this.productosSeleccionados.find(p => p.id === producto.id);
    
    if (productoExistente) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Producto ya agregado',
        detail: 'Este producto ya está en la lista'
      });
      return;
    }

    const totalLinea = this.calcularTotalLinea({ ...producto, cantidad: 1, subtotal: producto.neto || 0, total: 0 });

    const nuevoProducto: ProductoSeleccionado = {
      ...producto,
      cantidad: 1,
      subtotal: producto.neto || 0,
      total: totalLinea
    };

    this.productosSeleccionados.push(nuevoProducto);
    this.calcularTotal();
  }

  eliminarProducto(index: number) {
    this.productosSeleccionados.splice(index, 1);
    this.calcularTotal();
  }

  mostrarDialogoCarga() {
    this.visible = true;
    this.archivoSeleccionado = null;
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }

  onUpload(event: any) {
    for(let file of event.files) {
      this.uploadedFiles.push(file);
    }
    
    this.messageService.add({
      severity: 'info',
      summary: 'Archivo Cargado',
      detail: 'Se procesará el archivo Excel'
    });
    
    this.visible = false;
  }

  guardarPedido() {
    if (this.pedidoForm.valid) {
      const pedido = {
        ...this.pedidoForm.value,
        productos: this.productosSeleccionados,
        total: this.total,
        totalProducto: this.totalProducto
      };
      this.loading = true;

      this.store.dispatch(createPedidonacRequest({ pedidonac: pedido }));
      this.actions$.pipe(
        ofType(createPedidonacSuccess),
        take(1)
       ).subscribe(() => {
        setTimeout(() => {
          this.loading = false;
          this.router.navigate(['desk/produccion/orden_nacional/']);
        }, 1000);
     });
    
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos requeridos'
      });
    }
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.name.match(/\.(xls|xlsx)$/)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El archivo debe ser un Excel (.xls o .xlsx)'
      });
      return;
    }

    // Validar tamaño (máximo 1MB)
    if (file.size > 1000000) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El archivo no debe superar 1MB'
      });
      return;
    }

    this.archivoSeleccionado = file;
  }

  procesarArchivoExcel() {
    if (!this.archivoSeleccionado) return;

    this.loading = true;
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validar estructura del archivo
        if (!this.validarEstructuraExcel(jsonData)) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El archivo no tiene el formato correcto. Por favor, descargue el formato de ejemplo.'
          });
          return;
        }

        // Limpiar productos existentes
        this.productosSeleccionados = [];
        
        // Procesar los datos del Excel
        this.procesarDatosExcel(jsonData);
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al procesar el archivo Excel'
        });
      } finally {
        this.loading = false;
        this.archivoSeleccionado = null;
      }
    };

    reader.onerror = () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al leer el archivo'
      });
      this.loading = false;
      this.archivoSeleccionado = null;
    };

    reader.readAsArrayBuffer(this.archivoSeleccionado);
  }

  private validarEstructuraExcel(data: any[]): boolean {
    if (!data || data.length === 0) return false;
    
    const primeraFila = data[0];
    return 'sku' in primeraFila && 'cantidad' in primeraFila;
  }

  private procesarDatosExcel(data: any[]) {
    this.excelData = data;
    let productosNoEncontrados: string[] = [];

    data.forEach(row => {
      const producto = this.productos.find(p => p.cod_pareo === row.sku);
      if (producto) {
        const cantidad = parseInt(row.cantidad) || 1;
        if (cantidad <= 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Cantidad inválida',
            detail: `La cantidad para el SKU ${row.sku} debe ser mayor a 0`
          });
          return;
        }

        const nuevoProducto: ProductoSeleccionado = {
          ...producto,
          cantidad: cantidad,
          subtotal: producto.neto || 0,
          total: (producto.neto || 0) * cantidad
        };
        this.productosSeleccionados.push(nuevoProducto);
      } else {
        productosNoEncontrados.push(row.sku);
      }
    });

    if (productosNoEncontrados.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Productos no encontrados',
        detail: `Los siguientes SKUs no existen en la base de datos: ${productosNoEncontrados.join(', ')}`
      });
    }

    if (this.productosSeleccionados.length > 0) {
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: `Se cargaron ${this.productosSeleccionados.length} productos correctamente`
      });
    }

    this.calcularTotal();
    this.visible = false;
  }

  descargarFormato() {
    // Crear datos de ejemplo para el formato
    const datosFormato = [
      {
        'sku': 'SKU001',
        'cantidad': '1'
      },
      {
        'sku': 'SKU002',
        'cantidad': '2'
      }
    ];

    // Crear workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosFormato);

    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 15 }, // SKU
      { wch: 10 }  // Cantidad
    ];
    ws['!cols'] = colWidths;

    // Agregar hoja al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Formato');

    // Generar archivo
    XLSX.writeFile(wb, 'formato_carga_productos.xlsx');

    this.messageService.add({
      severity: 'info',
      summary: 'Formato descargado',
      detail: 'Se ha descargado el formato de ejemplo'
    });
  }


  descargarExcel() {
    // Crear datos para el Excel
    const datosExcel = this.productosSeleccionados.map(producto => ({
      'Código': producto.cod_pareo,
      'SKU': producto.cod_pareo,
      'Descripción': producto.descripcion,
      'Cantidad': producto.cantidad,
      'Precio': producto.neto,
      'Subtotal': this.calcularSubtotal(producto),
      'IVA': this.calcularIVA(this.calcularSubtotal(producto)),
      'Total': this.calcularTotalProducto(producto)
    }));

    // Crear workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExcel);

    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 15 }, // Código
      { wch: 15 }, // SKU
      { wch: 40 }, // Descripción
      { wch: 10 }, // Cantidad
      { wch: 15 }, // Precio
      { wch: 15 }, // Subtotal
      { wch: 15 }, // IVA
      { wch: 15 }  // Total
    ];
    ws['!cols'] = colWidths;

    // Agregar hoja al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');

    // Generar archivo
    XLSX.writeFile(wb, 'productos_pedido.xlsx');
  }
}
