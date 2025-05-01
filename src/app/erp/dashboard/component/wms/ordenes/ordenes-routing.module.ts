import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrdenesEntradaComponent } from './ordenes-entrada/ordenes-entrada.component';
import { OrdenesSalidaComponent } from './ordenes-salida/ordenes-salida.component';
import { VerOrdenentradaComponent } from './ordenes-entrada/ver-ordenentrada/ver-ordenentrada.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Ordenes'
    
    
    },
    children: [
     
          {  path:'orden_entrada',
            component:OrdenesEntradaComponent },
          {  path:'orden_entrada/ver/:orden',
            component:VerOrdenentradaComponent },
          {  path:'salidas',
            component:OrdenesSalidaComponent }
        
      ]
    }
  ];
    
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdenesRoutingModule {
}
