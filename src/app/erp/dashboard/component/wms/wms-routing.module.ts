import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StockComponent } from './stock/stock.component';
import { StockCajaComponent } from './stock-caja/stock-caja.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'WMS'
    
    
    },
    children: [
     
  
      { path: 'sd', loadChildren: () => import('./ordenes/ordenes.module').then(m => m.OrdenesModule) },
      { path: 'stock', component: StockComponent},
      { path: 'stockcaja', component: StockCajaComponent}
       
        
      ]
    }
  ];
    
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WmsRoutingModule {
}
