import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { InsUsuariosComponent } from './usuarios/ins-usuarios/ins-usuarios.component';
import { UpUsuariosComponent } from './usuarios/up-usuarios/up-usuarios.component';
import { RolesComponent } from './roles/roles.component';
import { InsRolesComponent } from './roles/ins-roles/ins-roles.component';
import { UpRolesComponent } from './roles/up-roles/up-roles.component';
import { ModuloComponent } from './modulo/modulo.component';
import { InsModuloComponent } from './modulo/ins-modulo/ins-modulo.component';
import { UpModuloComponent } from './modulo/up-modulo/up-modulo.component';
import { SubModuloComponent } from './modulo/sub-modulo/sub-modulo.component';
import { InsSubmoduloComponent } from './modulo/sub-modulo/ins-submodulo/ins-submodulo.component';
import { SeguridadComponent } from './seguridad/seguridad.component';
import { UpSubModuloComponent } from './modulo/sub-modulo/up-sub-modulo/up-sub-modulo.component';
import { ConfiguracionFieldComponent } from './configuracion-field/configuracion-field.component';

interface DashboardSeguridad {
  estadisticasUsuarios: {
    totalUsuarios: number;
    usuariosActivos: number;
    usuariosInactivos: number;
    distribucionRoles: Array<{
      rol: string;
      cantidad: number;
    }>;
  };
  
  estadisticasActividad: {
    sesionesUltimaSemana: number;
    tiempoPromedioSesion: string;
    usuariosMasActivos: Array<{
      usuario: string;
      sesiones: number;
    }>;
  };
  
  estadisticasSeguridad: {
    intentosFallidos: number;
    ubicacionesAcceso: Array<{
      ubicacion: string;
      cantidad: number;
    }>;
    erroresPlataforma: number;
  };
}

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Seguridad'
    
    
    },
    children: [
      {
        path: '',
        component:SeguridadComponent
      },
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
      {
        path: 'modulos',
        component:ModuloComponent 
      },
      {
        path: 'modulos/insmodulo',
        component:InsModuloComponent
      },
      {
        path: 'modulos/upmodulo/:modulo',
        component:UpModuloComponent
      },
      {
        path: 'modulos/submodulos/:modulo',
        component:SubModuloComponent
      },
      {
        path: 'modulos/submodulos/inssubmodulo/:modulo',
        component:InsSubmoduloComponent
      },
      {
        path: 'modulos/submodulos/upsubmodulo/:submodulo',
        component:UpSubModuloComponent
      },
      {
        path: 'fieldnegocio',
        component:ConfiguracionFieldComponent
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
