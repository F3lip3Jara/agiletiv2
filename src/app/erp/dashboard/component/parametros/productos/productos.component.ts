import { Component } from '@angular/core';
import {  selectProductosPending } from '../state/selectors/producto.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Producto, PRODUCTOS_KEYS } from '../state/interface/producto.interface';
import { getProductosRequest } from '../state/acctions/producto.actions';
import { Table } from 'primeng/table';
import { AppState } from '../../app.state';

interface ProductoExtended extends Producto {
  imageLoaded?: boolean;
  imageError?: boolean;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {

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

  constructor(
    
    private store: Store<AppState> // Inyecta el servicio Store de NgRx para gestionar el estado de la aplicación
  ) { }
  

  ngOnInit(): void {
    this.store.dispatch(getProductosRequest())
    // llama a la acción para obtener los todos
     this.store.select(selectProductosPending).subscribe((productos : any)=>{
       this.data = productos.map((p: Producto) => ({
         ...p,
         imageLoaded: false,
         imageError: false
       }));      
     });

     this.globalFilterFields = PRODUCTOS_KEYS;
     
    // obtiene los todos pendientes
  //  this.tasksInProgress = this.store.select(selectTodosInProgress) // obtiene los todos en progreso
   // this.tasksCompleted = this.store.select(selectTodosDone) // obtiene los todos completados
  }

openNew() {  
    this.submitted     = false;
    this.productDialog = true;
}

deleteSelectedProducts() {
    this.deleteProductsDialog = true;
}

editProduct(product: Producto) {
  
}

deleteProduct(product: Producto) {
 
}

confirmDeleteSelected() {
    this.deleteProductsDialog = false;
    this.data = this.data.filter(val => !this.selectedProducts.includes(val));
   
    this.selectedProducts = [];
}

confirmDelete() {
   
}

hideDialog() {
    this.productDialog = false;
    this.submitted = false;
}

saveProduct() {
    
}

findIndexById(id: string): number {
    let index = -1;
   

    return index;
}

createId(): string {
  return '';
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
    this.previewImageLoaded = false;
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

}
