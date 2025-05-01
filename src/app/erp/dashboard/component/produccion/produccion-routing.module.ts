import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PedidoComponent } from './pedido/pedido.component';
import { InsPedidoComponent } from './pedido/ins-pedido/ins-pedido.component';
import { UpPedidoComponent } from './pedido/up-pedido/up-pedido.component';
import { VerPedidoComponent } from './pedido/ver-pedido/ver-pedido.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Producción',
    },
    children: [
      {
        path: 'orden_nacional',
        component: PedidoComponent
      },
      {
        path: 'orden_nacional/inspedido',
        component: InsPedidoComponent
      },
      {
        path: 'orden_nacional/uppedido/:pedido',
        component: UpPedidoComponent
      },
      {
        path: 'orden_nacional/verpedido/:pedido',
        component: VerPedidoComponent
      }
      
    ]
  }
];
    
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProduccionRoutingModule {
}
