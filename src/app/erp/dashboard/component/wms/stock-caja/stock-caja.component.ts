import { Component, ElementRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { STOCK_CAJA_KEYS, StockCaja } from '../state/interface/stockCaja.interface';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AppState } from '../../app.state';
import { Store } from '@ngrx/store';
import { ExcelService } from '../../../service/excel.service';
import { Actions, ofType } from '@ngrx/effects';
import { incrementarRequest } from '../../state/actions/estado.actions';
import { getStockCajaRequest, getStockCajaSuccess } from '../state/actions/stockCaja.actions';



interface StockExtended extends StockCaja {
  imageLoaded?: boolean;
  imageError?: boolean;
}


@Component({
  selector: 'app-stock-caja',
  templateUrl: './stock-caja.component.html',
  styleUrl: './stock-caja.component.scss'
})
export class StockCajaComponent {

  @ViewChild('searchInput') searchInput!: ElementRef;
  stock               : Observable<StockCaja[]>    = new Observable;
  loading             : Observable<any>        = new Observable;
  productDialog       : boolean                = false;
  deleteProductDialog : boolean                = false;
  deleteProductsDialog: boolean                = false;
  data                : StockExtended[]        = [];
  selectedProducts    : StockCaja[]                = [];
  submitted           : boolean                = false;
  cols                : any[]                  = [];
  statuses            : any[]                  = [];
  rowsPerPageOptions                           = [5, 10, 20];
  globalFilterFields  : string[]               = [];
  previewVisible: boolean                      = false;
  selectedImage: StockExtended | null          = null;
  previewImageLoaded: boolean                  = false;
  actionItems: MenuItem[]                      = [];
  selectedRow: any                             = null;
  

     // Propiedades para el diálogo de búsqueda
 showSearchDialog: boolean = false;
 dt!: Table;
 sidebarVisible = false;
 colums: any[] = [];
 COMPONENT_SELECTOR = 'app-stock-caja';
  
constructor(
  private router: Router,
  private store: Store<AppState>,
  private excelService: ExcelService,
  private actions$: Actions
) {


  this.actionItems = [
          
    ];      
 }  

ngOnInit(): void {
  this.store.dispatch(incrementarRequest({request: 1}));
  this.store.dispatch(getStockCajaRequest())
  // llama a la acción para obtener los todos

   this.actions$.pipe(
    ofType(getStockCajaSuccess)
  ).subscribe((stock : any) => {

   this.data = stock.stockCaja.map((p: StockCaja) => ({
      ...p,
      imageLoaded: false,
      imageError: false
    }));
   // console.log(productos.colums);
  
   this.colums = stock.colums;
  });

  this.globalFilterFields = Object.values(STOCK_CAJA_KEYS);
  
}



hideDialog() {
  this.productDialog = false;
  this.submitted = false;
}



onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}

onImageLoad(item: StockExtended) {
  item.imageLoaded = true;
  item.imageError = false;
}

onImageError(item: StockExtended) {
  item.imageLoaded = true;
  item.imageError = true;
}

showPreview(item: StockExtended) {
  console.log(item);
  this.selectedImage = item;
  this.previewVisible = true;
  //this.previewImageLoaded = false;
}

downloadImage(item: StockExtended) {
  if (!item?.url) return;
  
  const link = document.createElement('a');
  link.href = item.url;
  link.download = `producto-${item.cod_pareo}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

shareImage(item: StockExtended) {
  if (!item?.url) return;
  
  if (navigator.share) {
    navigator.share({
      title: `Producto ${item.cod_pareo}`,
      text: `Producto ${item.cod_pareo} - Talla: ${item.talla}`,
      url: item.url
    }).catch((error) => console.log('Error compartiendo:', error));
  }
}


exportCSV() {
  this.excelService.exportAsExcelFile(this.data, 'roles');
}

refresh() {
  this.store.dispatch(incrementarRequest({request: 1}));
  this.store.dispatch(getStockCajaRequest());
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
 // this.store.dispatch(aplicarFiltrosRequest({filtros: filters}));
  /*this.actions$.pipe(
    ofType(aplicarFiltrosSuccess)
  ).subscribe((productos : any) => {
    this.data = productos.productos.map((p: Producto) => ({
      ...p,
      imageLoaded: false,
      imageError: false
    }));
   // console.log(productos.colums);
   this.colums = productos.colums;
  });*/
}

}

