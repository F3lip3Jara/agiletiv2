import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductosComponent } from './productos/productos.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Parametros',
    },
    children: [
    
      {
        path: 'productos',
        component: ProductosComponent
      }
        
      ]
    }
  ];
    
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ParametrosRoutingModule {
}
