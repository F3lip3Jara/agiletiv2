import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import {  selectProductosPending } from '../state/selectors/producto.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Producto, PRODUCTOS_KEYS } from '../state/interface/producto.interface';
import { aplicarFiltrosRequest, aplicarFiltrosSuccess, getProductosRequest, getProductoSuccess } from '../state/actions/producto.actions';
import { Table } from 'primeng/table';
import { AppState } from '../../app.state';
import { Router } from '@angular/router'; 
import { incrementarRequest } from '../../state/actions/estado.actions';
import { ExcelService } from '../../../service/excel.service';
import { MenuItem } from 'primeng/api';
import { Actions, ofType } from '@ngrx/effects';
interface ProductoExtended extends Producto {
  imageLoaded?: boolean;
  imageError?: boolean;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  
     @ViewChild('searchInput') searchInput!: ElementRef;
    productos             : Observable<Producto[]> = new Observable;
    loading               : Observable<any>        = new Observable;
    productDialog       : boolean                = false;
    deleteProductDialog : boolean                = false;
    deleteProductsDialog: boolean                = false;
    data                : ProductoExtended[]     = [];
    selectedProducts    : Producto[]             = [];
    submitted           : boolean                = false;
    cols                : any[]                  = [];
    statuses            : any[]                  = [];
    rowsPerPageOptions                           = [5, 10, 20];
    globalFilterFields  : string[]               = [];
    previewVisible: boolean = false;
    selectedImage: ProductoExtended | null = null;
    previewImageLoaded: boolean = false;
    actionItems: MenuItem[] = [];
    selectedRow: any = null;
  
  
       // Propiedades para el diálogo de búsqueda
   showSearchDialog: boolean = false;
   dt!: Table;
   sidebarVisible = false;
   colums: any[] = [];
   COMPONENT_SELECTOR = 'app-productos';
    
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private excelService: ExcelService,
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
      ];      
   }  

  ngOnInit(): void {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getProductosRequest())
    // llama a la acción para obtener los todos
   /*  this.store.select(selectProductosPending).subscribe((productos : any)=>{
       this.data = productos.map((p: Producto) => ({
         ...p,
         imageLoaded: false,
         imageError: false
       }));      
     });*/
     this.actions$.pipe(
      ofType(getProductoSuccess)
    ).subscribe((productos : any) => {

     // console.log(productos);
      this.data = productos.productos.map((p: Producto) => ({
        ...p,
        imageLoaded: false,
        imageError: false
      }));
     // console.log(productos.colums);
     this.colums = productos.colums;
    });

     this.globalFilterFields = Object.values(PRODUCTOS_KEYS);
     
    // obtiene los todos pendientes
  //  this.tasksInProgress = this.store.select(selectTodosInProgress) // obtiene los todos en progreso
   // this.tasksCompleted = this.store.select(selectTodosDone) // obtiene los todos completados
  }

openNew() {  
  this.router.navigate(['desk/parametros/productos/insproducto']);
}



edit(product: Producto) {
   let producto = btoa(JSON.stringify(product));
    this.router.navigate(['desk/parametros/productos/upproducto',producto]);  
}

hideDialog() {
    this.productDialog = false;
    this.submitted = false;
}



  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onImageLoad(item: ProductoExtended) {
    item.imageLoaded = true;
    item.imageError = false;
  }

  onImageError(item: ProductoExtended) {
    item.imageLoaded = true;
    item.imageError = true;
  }

  showPreview(item: ProductoExtended) {
    this.selectedImage = item;
    this.previewVisible = true;
   // this.previewImageLoaded = false;
  }

  downloadImage(item: ProductoExtended) {
    if (!item?.url) return;
    
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `producto-${item.cod_pareo}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  shareImage(item: ProductoExtended) {
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
    this.store.dispatch(getProductosRequest());
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
    this.store.dispatch(aplicarFiltrosRequest({filtros: filters}));
    this.actions$.pipe(
      ofType(aplicarFiltrosSuccess)
    ).subscribe((productos : any) => {
      this.data = productos.productos.map((p: Producto) => ({
        ...p,
        imageLoaded: false,
        imageError: false
      }));
     // console.log(productos.colums);
     this.colums = productos.colums;
    });
  }

}
