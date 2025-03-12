import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OpcionesComponent } from './opciones/opciones.component';
import { InsOpcionesComponent } from './opciones/ins-opciones/ins-opciones.component';
import { UpOpcionesComponent } from './opciones/up-opciones/up-opciones.component';
import { AccionesComponent } from './acciones/acciones.component';
import { InsAccionesComponent } from './acciones/ins-acciones/ins-acciones.component';
import { UpAccionesComponent } from './acciones/up-acciones/up-acciones.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Administracion',
    },
    children: [
    
      {
        path: 'opciones',
       component:OpcionesComponent
      },
      {
        path: 'opciones/ins-opciones',
        component:InsOpcionesComponent
      },
      {
        path: 'opciones/up-opciones/:opcion',
        component:UpOpcionesComponent
      },
      {
        path: 'opciones/acciones/:opcion',
        component:AccionesComponent
      },
      {
        path: 'opciones/acciones/ins-acciones/:opcion',
        component:InsAccionesComponent
      },
      {
        path: 'opciones/acciones/up-acciones/:accion',
        component:UpAccionesComponent
      }
    ]
  }
];
    
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministracionRoutingModule {
}
