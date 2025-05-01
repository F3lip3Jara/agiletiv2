import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Environment } from 'src/app/erp/service/environment.service';
import { Almacen } from '../../../../parametros/state/interface/almacen.interface';
import { Centro } from '../../../../parametros/state/interface/centro.interface';
import { Producto } from '../../../../parametros/state/interface/producto.interface';
import { Proveedor } from '../../../../parametros/state/interface/proveedor.interface';
import { Clase } from '../../../../parametros/state/interface/clase.interface';  
import { Store } from '@ngrx/store';    
import { AppState } from '../../../../app.state';
import { Actions, ofType } from '@ngrx/effects';
import { getClaseRequest, getClaseSuccess } from '../../../../parametros/state/actions/clase.actions';
import { getAlmacenRequest, getAlmacenSuccess } from '../../../../parametros/state/actions/almacen.actions';
import { getCentroRequest, getCentroSuccess } from '../../../../parametros/state/actions/centro.actions';
import { getProductosRequest, getProductoSuccess } from '../../../../parametros/state/actions/producto.actions';
import { getProveedorRequest, getProveedorSuccess } from '../../../../parametros/state/actions/proveedor.actions';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { incrementarRequest } from '../../../../state/actions/estado.actions';
import { Pedidonac } from '../../../../produccion/state/interface/pedidonac.interface';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import * as jspdfAutotable from 'jspdf-autotable';
import { getEmpresaPdfRequest, getEmpresaPdfSuccess, getPedidoProductosRequest, getPedidoProductosSuccess } from '../../../../produccion/state/actions/pedidonac.actions';
import { getOrdenEntradaDetalleRequest, getOrdenEntradaDetalleSuccess } from '../../../state/actions/ordenes.actions';
registerLocaleData(localeEs, 'es', localeEsExtra);

declare global {
  interface Window {
    google: typeof google;
  }
}

interface ProductoSeleccionado extends Producto {
  cantidad: number;
  subtotal: number;
  total: number;
}

interface SeguimientoEstado {
  fecha: Date;
  estado: string;
  descripcion: string;
  icono: string;
  color: string;
  usuario: string;
}

@Component({
  selector: 'app-ver-ordenentrada',
  templateUrl: './ver-ordenentrada.component.html',
  styleUrl: './ver-ordenentrada.component.scss',
  providers: [MessageService]
})
export class VerOrdenentradaComponent implements OnInit {
  @ViewChild('mapEnvio') mapEnvioElement!: ElementRef;

  ordenForm: FormGroup;
  centros: Centro[] = [];  
  almacenes: Almacen[] = [];
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  proveedores: Proveedor[] = []; 
  proveedorSeleccionado: Proveedor | null = null;
  productosSeleccionados: ProductoSeleccionado[] = [];
  tiposDocumento: Clase[] = [];
  total: number = 0;
  totalProducto: number = 0;
  almacenesFiltrados: Almacen[] = [];
  mapEnvio: google.maps.Map | null = null;
  markerEnvio: google.maps.Marker | null = null;
   orden: any;
  subscription: Subscription = new Subscription();
  empresa: any;
  seguimientoTimeline: SeguimientoEstado[] = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private actions$: Actions,
    private fb: FormBuilder,
    private environment: Environment,
  ) {
    this.ordenForm = this.fb.group({
      tipoDocumento: [''],
      fechaCreacion: [''],
      fechaPromesaEntrega: [''],
      documentoRelacionado: [''],
      proveedor: [''],
      centro: [''],
      almacen: [''],
      direccionEnvio: [''],
      correoElectronico: [''],
      notas: ['']
    });
  }

  ngOnInit(): void {
    this.initForm();

    this.route.params.pipe(
      take(1)
    ).subscribe(params => {
     this.orden = JSON.parse(atob(params['orden']));     
     
      let proveedorId = parseInt(this.orden.ordHdrCustShortText2);
      if (this.ordenForm) {
        this.ordenForm.patchValue({
          fechaCreacion: new Date(this.orden.created_at),  
          tipoDocumento:this.orden.ordTip,
          estado:this.orden.ordestatus,
          proveedor:proveedorId ,
          centro:this.orden.centroId,
          almacen:this.orden.almId,
          latitudEnvio:this.orden.cenLat,
          longitudEnvio:this.orden.cenLong,
          notas:this.orden.ordHdrCustShortText13,
          fechaPromesaEntrega: new Date(this.orden.ordHdrCustShortText5),
          documentoRelacionado:this.orden.ordNumber,
          orpId:this.orden.ordId
        });
      }
    });

    this.store.dispatch(incrementarRequest({ request: 6 }));  
    this.store.dispatch(getClaseRequest());
    this.store.dispatch(getCentroRequest()); 
    this.store.dispatch(getProductosRequest());
    this.store.dispatch(getProveedorRequest()); 
    this.store.dispatch(getEmpresaPdfRequest());

    this.subscription.add(
      this.actions$.pipe(
        ofType(getClaseSuccess, getCentroSuccess, getProductoSuccess, getProveedorSuccess, getEmpresaPdfSuccess)
      ).subscribe((data) => {
        switch(data.type){
          case "[Clase] Get Clase Success":
            this.tiposDocumento = data.clase.filter(c => c.clasTip === 'E'); 
            if (this.orden && this.ordenForm) {
              const tipoId = this.tiposDocumento.find(c => c.clasTipId ===this.orden.ordTip);
              this.ordenForm.patchValue({
                tipoDocumento: tipoId
              });
            }
            break;
          case "[Centro] Get Centro Success":
            this.centros = data.centro;
            if (this.orden) {
              this.actualizarDatosCentro(this.orden.centroId);
              this.actualizarUbicacionCentro(this.orden.centroId);
             
            }
            break;
          case "[Productos] Get Productos Success":
            this.productos = data.productos.filter(p => p.tipo === 'FISICO');
            this.productosFiltrados = this.productos;
            if (this.orden) {
              this.store.dispatch(getOrdenEntradaDetalleRequest({orden:this.orden}));
            }
            break;
          case "[Proveedor] Get Proveedor Success":
            this.proveedores = data.proveedor.filter(p => p.activado === 'S' && p.es_proveedor === 'S');
            if (this.orden) {
              this.proveedorSeleccionado = this.proveedores.find(p => p.id === this.ordenForm.get('proveedor')?.value);
            }
            break;
          case "[Pedidonac] Obtener empresa para PDF exitosa":
            this.empresa = data.empresa;
            break;
        }
      })
    );

    this.subscription.add(
      this.actions$.pipe(
        ofType(getOrdenEntradaDetalleSuccess),
        take(1)
      ).subscribe((data) => {
        if (data.ordenDetalle && Array.isArray(data.ordenDetalle)) {
          this.productosSeleccionados = [];
          data.ordenDetalle.forEach((row: any) => {
            const producto = this.productos.find(p => p.cod_pareo === row.ordDtlCustShortText1);
            if (producto) {
              const cantidad = parseInt(row.orddQtySol) || 1;
              if (cantidad <= 0) {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Cantidad inválida',
                  detail: `La cantidad para el SKU ${row.ordDtlCustShortText1} debe ser mayor a 0`
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
            }
          });
          this.calcularTotal();
        }
      })
    );

    this.loadGoogleMaps();
  }

  private initForm() {
    this.ordenForm = this.fb.group({
      fechaCreacion: [{value: new Date(), disabled: true}, []],
      tipoDocumento: [{value: '', disabled: true}, []],
      estado: [{value: 'pendiente_aprobacion', disabled: true}, []],
      proveedor: [{value: '', disabled: true}, []],
      centro: [{value: '', disabled: true}, []],
      almacen: [{value: '', disabled: true}, []],
      direccionEnvio: [{value: '', disabled: true}, []],
      correoElectronico: [{value: '', disabled: true}, []],
      latitudEnvio: [{value: '', disabled: true}, []],
      longitudEnvio: [{value: '', disabled: true}, []],
      notas: [{value: '', disabled: true}, []],
      fechaPromesaEntrega: [{value: new Date(), disabled: true}, []],
      documentoRelacionado: [{value: '', disabled: true}, []],
      orpId: [{value: '', disabled: true}, []]
    });
  }

  private actualizarDatosCentro(centroId: number) {
    const centro = this.centros.find(c => c.centroId === centroId);
    if (centro) {
      this.ordenForm.patchValue({
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

    const defaultLocation = { lat: -33.4489, lng: -70.6693 };
    const mapOptions = {
      center: defaultLocation,
      zoom: 12
    };

    this.mapEnvio = new window.google.maps.Map(this.mapEnvioElement.nativeElement, mapOptions);
  }

  private actualizarUbicacionCentro(centroId: number) {
    if (!this.mapEnvio) return;
    const centro = this.centros.find(c => c.centroId === centroId);
    this.store.dispatch(getAlmacenRequest({centro}));

    this.actions$.pipe(
      ofType(getAlmacenSuccess),
      take(1)
    ).subscribe((data) => {
      this.almacenes = data.almacen;
      this.almacenesFiltrados = this.almacenes;
    });

    if (centro && centro.cenLat && centro.cenLong) {
      const position = {
        lat: parseFloat(centro.cenLat),
        lng: parseFloat(centro.cenLong)
      };

      if (this.markerEnvio) {
        this.markerEnvio.setMap(null);
      }

      this.markerEnvio = new window.google.maps.Marker({
        position: position,
        map: this.mapEnvio,
        title: centro.cenDes
      });

      this.mapEnvio.setCenter(position);
      this.mapEnvio.setZoom(15);
    }
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
    this.total = this.productosSeleccionados.reduce((sum, producto) => 
      sum + this.calcularTotalLinea(producto), 0);

    this.totalProducto = this.productosSeleccionados.reduce((sum, producto) => 
      sum + producto.cantidad, 0);
  }

  descargarExcel() {
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

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExcel);

    const colWidths = [
      { wch: 15 },
      { wch: 15 },
      { wch: 40 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'productos_pedido.xlsx');
  }

  descargarPDF() {
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
