import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { Pedidonac } from '../../state/interface/pedidonac.interface';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import * as jspdfAutotable from 'jspdf-autotable';
import { getEmpresaPdfRequest, getEmpresaPdfSuccess, getPedidoProductosRequest, getPedidoProductosSuccess } from '../../state/actions/pedidonac.actions';
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
  selector: 'app-ver-pedido',
  templateUrl: './ver-pedido.component.html',
  styleUrl: './ver-pedido.component.scss'
})
export class VerPedidoComponent implements OnInit, OnDestroy {
  @ViewChild('mapEnvio') mapEnvioElement!: ElementRef;

  pedidoForm: FormGroup;
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
  pedido: Pedidonac;
  subscription: Subscription = new Subscription();
  empresa: any;
  seguimientoTimeline: SeguimientoEstado[] = [];
  /*seguimientoTimeline: SeguimientoEstado[] = [
    {
      fecha: new Date('2024-03-20T10:00:00'),
      estado: 'Creación de Orden',
      descripcion: 'La orden de compra ha sido creada en el sistema',
      icono: 'pi pi-file',
      color: '#22C55E',
      usuario: 'Juan Pérez'
    },
    {
      fecha: new Date('2024-03-20T11:30:00'),
      estado: 'Revisión',
      descripcion: 'Orden en proceso de revisión por el departamento de compras',
      icono: 'pi pi-search',
      color: '#3B82F6',
      usuario: 'María González'
    },
    {
      fecha: new Date('2024-03-20T14:15:00'),
      estado: 'Aprobación',
      descripcion: 'Orden aprobada por el supervisor',
      icono: 'pi pi-check',
      color: '#22C55E',
      usuario: 'Carlos Rodríguez'
    },
    {
      fecha: new Date('2024-03-20T15:00:00'),
      estado: 'Envío a Proveedor',
      descripcion: 'Orden enviada al proveedor para su procesamiento',
      icono: 'pi pi-send',
      color: '#F59E0B',
      usuario: 'Ana Martínez'
    }
  ];*/

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private actions$: Actions,
    private fb: FormBuilder,
    private environment: Environment,
  ) {}  

  ngOnInit(): void {
    this.initForm();

    this.route.params.pipe(
      take(1)
    ).subscribe(params => {
      this.pedido = JSON.parse(atob(params['pedido']));             
      if (this.pedidoForm) {
        this.pedidoForm.patchValue({
          fechaCreacion: new Date(this.pedido.created_at),  
          tipoDocumento: this.pedido.tipo_id,
          estado: this.pedido.estado_ord,
          proveedor: this.pedido.proveedor_id,
          centro: this.pedido.centro_id,
          almacen: this.pedido.almacen_id,
          latitudEnvio: this.pedido.latitud,
          longitudEnvio: this.pedido.longitud,
          notas: this.pedido.observaciones,
          fechaPromesaEntrega: new Date(this.pedido.fech_promesa),
          documentoRelacionado: this.pedido.orden_compra,
          orpId: this.pedido.id
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
            if (this.pedido && this.pedidoForm) {
              const tipoId = this.tiposDocumento.find(c => c.clasTipId === this.pedido.tipo_id);
              this.pedidoForm.patchValue({
                tipoDocumento: tipoId
              });
            }
            break;
          case "[Centro] Get Centro Success":
            this.centros = data.centro;
            if (this.pedido) {
              this.actualizarDatosCentro(this.pedido.centro_id);
              this.actualizarUbicacionCentro(this.pedido.centro_id);
            }
            break;
          case "[Productos] Get Productos Success":
            this.productos = data.productos.filter(p => p.tipo === 'FISICO');
            this.productosFiltrados = this.productos;
            if (this.pedido) {
              this.store.dispatch(getPedidoProductosRequest({ pedido: this.pedido }));
            }
            break;
          case "[Proveedor] Get Proveedor Success":
            this.proveedores = data.proveedor.filter(p => p.activado === 'S' && p.es_proveedor === 'S');
            if (this.pedido) {
              this.proveedorSeleccionado = this.proveedores.find(p => p.id === this.pedido.proveedor_id);
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
        ofType(getPedidoProductosSuccess),
        take(1)
      ).subscribe((data) => {
        if (data.productos && Array.isArray(data.productos)) {
          this.productosSeleccionados = [];
          data.productos.forEach((row: any) => {
            const producto = this.productos.find(p => p.cod_pareo === row.orpdPrdCod);
            if (producto) {
              const cantidad = parseInt(row.orpdCant) || 1;
              if (cantidad <= 0) {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Cantidad inválida',
                  detail: `La cantidad para el SKU ${row.orpdPrdCod} debe ser mayor a 0`
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
    this.pedidoForm = this.fb.group({
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

    this.store.dispatch(getAlmacenRequest({centro}));

    this.actions$.pipe(
      ofType(getAlmacenSuccess),
      take(1)
    ).subscribe((data) => {
      this.almacenes = data.almacen;
      this.almacenesFiltrados = this.almacenes;
    });

    
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
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;

      if (this.empresa && this.empresa[0]?.empImg) {
        const img = new Image();
        img.src = this.empresa[0].empImg;
        doc.addImage(img, 'PNG', margin, margin, 15, 15);
      }

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('ORDEN DE COMPRA', pageWidth / 2, 20, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('FECHA', pageWidth - 60, 15);
      doc.text(new Date().toLocaleDateString(), pageWidth - 60, 20);
      doc.text('OC #', pageWidth - 60, 25);
      doc.text(`${this.pedido?.id || 'N/A'}`, pageWidth - 60, 30);

      doc.setFontSize(10);
      doc.text(this.empresa[0].empDes || '[Nombre]', margin, 40);
      doc.text(this.empresa[0].empDir || '[Nombre de empresa]', margin, 45);
      doc.text(this.empresa[0].empRut || '[Dirección]', margin, 50);
      doc.text(this.empresa[0].empGiro || '[Ciudad, Estado, postal]', margin, 55);
      doc.text(this.empresa[0].empFono || '[Teléfono]', margin, 60);

      doc.setFillColor(255, 0, 0);
      doc.rect(margin, 70, 80, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text('VENDEDOR', margin + 2, 75);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      const proveedor = this.proveedores.find(p => p.id === this.pedidoForm.get('proveedor')?.value);
      doc.text(proveedor?.nombre || '[Nombre]', margin, 85);
      doc.text(proveedor?.rut || '[RUT]', margin, 90);
      doc.text(proveedor?.direccion || '[Dirección]', margin, 95);
      doc.text('[Ciudad, Estado, postal]', margin, 100);
      doc.text(proveedor?.telefono || '[Teléfono]', margin, 105);

      doc.setFillColor(255, 0, 0);
      doc.rect(pageWidth - margin - 80, 70, 80, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text('ENVIE A', pageWidth - margin - 78, 75);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      const centro = this.centros.find(c => c.centroId === this.pedidoForm.get('centro')?.value);
      doc.text(centro?.cenDes || '[Nombre]', pageWidth - margin - 78, 85);
      doc.text('[Nombre de empresa]', pageWidth - margin - 78, 90);
      doc.text(centro?.cenDir || '[Dirección]', pageWidth - margin - 78, 95);
      doc.text('[Ciudad, Estado, postal]', pageWidth - margin - 78, 100);
      doc.text(centro?.centEmail || '[Teléfono]', pageWidth - margin - 78, 105);

      doc.setFillColor(255, 0, 0);
      doc.rect(margin, 120, (pageWidth - 2 * margin) / 4, 7, 'F');
      doc.rect(margin + (pageWidth - 2 * margin) / 4, 120, (pageWidth - 2 * margin) / 4, 7, 'F');
      doc.rect(margin + 2 * (pageWidth - 2 * margin) / 4, 120, (pageWidth - 2 * margin) / 4, 7, 'F');
      doc.rect(margin + 3 * (pageWidth - 2 * margin) / 4, 120, (pageWidth - 2 * margin) / 4, 7, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.text('REQUISAR', margin + 2, 125);
      doc.text('EMBARCAR VÍA', margin + (pageWidth - 2 * margin) / 4 + 2, 125);
      doc.text('F.O.B.', margin + 2 * (pageWidth - 2 * margin) / 4 + 2, 125);
      doc.text('CONDICIONES DE ENVÍO', margin + 3 * (pageWidth - 2 * margin) / 4 + 2, 125);

      doc.setFillColor(255, 0, 0);
      const tableTop = 140;
      doc.rect(margin, tableTop, 30, 7, 'F');
      doc.rect(margin + 30, tableTop, pageWidth - 2 * margin - 90, 7, 'F');
      doc.rect(pageWidth - margin - 60, tableTop, 20, 7, 'F');
      doc.rect(pageWidth - margin - 40, tableTop, 20, 7, 'F');
      doc.rect(pageWidth - margin - 20, tableTop, 20, 7, 'F');

      doc.setTextColor(255, 255, 255);
      doc.text('ARTÍCULO #', margin + 2, tableTop + 5);
      doc.text('DESCRIPCIÓN', margin + 32, tableTop + 5);
      doc.text('CANT', pageWidth - margin - 58, tableTop + 5);
      doc.text('p/u', pageWidth - margin - 38, tableTop + 5);
      doc.text('TOTAL', pageWidth - margin - 18, tableTop + 5);

      doc.setTextColor(0, 0, 0);
      let yPos = tableTop + 15;
      this.productosSeleccionados.forEach((producto) => {
        doc.text(producto.cod_pareo || '', margin + 2, yPos);
        doc.text(producto.descripcion || '', margin + 32, yPos);
        doc.text(producto.cantidad.toString(), pageWidth - margin - 58, yPos);
        doc.text(producto.neto.toLocaleString('es-CL'), pageWidth - margin - 38, yPos);
        doc.text(this.calcularTotalProducto(producto).toLocaleString('es-CL'), pageWidth - margin - 18, yPos);
        yPos += 7;
      });

      const commentBoxY = yPos + 20;
      doc.setFillColor(255, 0, 0);
      doc.rect(margin, commentBoxY, pageWidth / 2 - margin - 5, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('Comentarios o instrucciones especiales', margin + 2, commentBoxY + 5);

      const subtotal = this.productosSeleccionados.reduce((sum, producto) => 
        sum + this.calcularSubtotal(producto), 0);
      
      const iva = this.productosSeleccionados.reduce((sum, producto) => 
        sum + this.calcularIVA(this.calcularSubtotal(producto)), 0);
      
      const total = subtotal + iva;

      doc.setTextColor(0, 0, 0);
      const totalesY = commentBoxY;
      doc.text('SUBTOTAL', pageWidth - margin - 60, totalesY);
      doc.text(subtotal.toLocaleString('es-CL'), pageWidth - margin - 20, totalesY);
      
      doc.text('IVA', pageWidth - margin - 60, totalesY + 7);
      doc.text(iva.toLocaleString('es-CL'), pageWidth - margin - 20, totalesY + 7);
      
      doc.text('ENVÍO', pageWidth - margin - 60, totalesY + 14);
      doc.text('0', pageWidth - margin - 20, totalesY + 14);
      
      doc.text('OTRO', pageWidth - margin - 60, totalesY + 21);
      doc.text('0', pageWidth - margin - 20, totalesY + 21);

      doc.setFillColor(255, 200, 200);
      doc.rect(pageWidth - margin - 60, totalesY + 25, 60, 7, 'F');
      doc.text('TOTAL', pageWidth - margin - 58, totalesY + 30);
      doc.text(`$ ${total.toLocaleString('es-CL')}`, pageWidth - margin - 20, totalesY + 30);

      const fileName = `orden_compra_${this.pedido?.id || 'nueva'}.pdf`;
      doc.save(fileName);

      this.messageService.add({
        severity: 'success',
        summary: 'PDF Generado',
        detail: 'El documento se ha descargado correctamente'
      });
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo generar el PDF. Por favor, intente nuevamente.'
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
