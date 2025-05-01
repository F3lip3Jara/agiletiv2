import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'WMS'
    
    
    },
    children: [
     
  
      { path: 'sd', loadChildren: () => import('./ordenes/ordenes.module').then(m => m.OrdenesModule) }
       
        
      ]
    }
  ];
    
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WmsRoutingModule {
}
