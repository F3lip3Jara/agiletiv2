import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { InsUsuariosComponent } from './usuarios/ins-usuarios/ins-usuarios.component';
import { UpUsuariosComponent } from './usuarios/up-usuarios/up-usuarios.component';
import { RolesComponent } from './roles/roles.component';
import { InsRolesComponent } from './roles/ins-roles/ins-roles.component';
import { UpRolesComponent } from './roles/up-roles/up-roles.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Seguridad',
    },
    children: [
    
      {
        path: 'usuarios',
       component:UsuariosComponent
      },
      {
        path: 'usuarios/insusuarios',
       component:InsUsuariosComponent
      },
      {
        path: 'usuarios/upusuarios/:usuario',
       component:UpUsuariosComponent
      },
      {
        path: 'roles',
        component:RolesComponent
      },
      {
        path: 'roles/insroles',
       component:InsRolesComponent
      },
      {
        path: 'roles/uproles/:roles',
       component:UpRolesComponent
      },     
        
        { path: 'administracion', loadChildren: () => import('./administracion/administracion.module').then(m => m.AdministracionModule) }
        
      ]
    }
  ];
    
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SeguridadRoutingModule {
}
