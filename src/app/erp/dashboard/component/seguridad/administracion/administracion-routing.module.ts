import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OpcionesComponent } from './opciones/opciones.component';
import { InsOpcionesComponent } from './opciones/ins-opciones/ins-opciones.component';
import { UpOpcionesComponent } from './opciones/up-opciones/up-opciones.component';
import { AccionesComponent } from './acciones/acciones.component';
import { InsAccionesComponent } from './acciones/ins-acciones/ins-acciones.component';
import { UpAccionesComponent } from './acciones/up-acciones/up-acciones.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { InsEmpresaComponent } from './empresa/ins-empresa/ins-empresa.component';
import { UpEmpresaComponent } from './empresa/up-empresa/up-empresa.component';
import { AdmOpcionesComponent } from './empresa/adm-opciones/adm-opciones.component';
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
      },
      {
        path: 'empresa',
        component:EmpresaComponent
      },
      {
        path: 'empresa/ins-empresa',
        component:InsEmpresaComponent
      },
      {
        path: 'empresa/up-empresa/:empresa',
        component:UpEmpresaComponent
      },
      {
        path: 'empresa/adm-opciones/:empresa',
        component:AdmOpcionesComponent
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
