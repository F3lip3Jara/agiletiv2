import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductosComponent } from './productos/productos.component';
import { MonedaComponent } from './moneda/moneda.component';
import { CiudadComponent } from './ciudad/ciudad.component';
import { RegionComponent } from './region/region.component';
import { CentroComponent } from './centro/centro.component';
import { InsCentroComponent } from './centro/ins-centro/ins-centro.component';
import { GrupoComponent } from './grupo/grupo.component';
import { SubGrupoComponent } from './sub-grupo/sub-grupo.component';
import { ColorComponent } from './color/color.component';
import { PaisComponent } from './pais/pais.component';
import { ComunaComponent } from './comuna/comuna.component';
import { UnidadComponent } from './unidad/unidad.component';
import { ClaseComponent } from './clase/clase.component';
import { TipoPagosComponent } from './tipo-pagos/tipo-pagos.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { InsProveedorComponent } from './proveedor/ins-proveedor/ins-proveedor.component';

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
      },
      {
        path: 'moneda',
        component: MonedaComponent
      },      
      {
        path: 'centro',
        component: CentroComponent
      },
      {
        path: 'centro/inscentro',
        component: InsCentroComponent
      },
      {
        path: 'grupo',
        component: GrupoComponent
      },
      {
        path: 'sub_grupo',
        component: SubGrupoComponent
      },
      {
        path: 'color',
        component: ColorComponent
      },
      {
        path: 'pais',
        component: PaisComponent
      },
      {
        path: 'region',
        component: RegionComponent
      },
      {
        path: 'ciudad',
        component: CiudadComponent
      },
      {
        path: 'comuna',
        component: ComunaComponent
      },
      {
        path: 'unidad',
        component: UnidadComponent
      },
      {
        path: 'clase',
        component: ClaseComponent
      },
      {
        path: 'tipo_pago',
        component: TipoPagosComponent
      },
      {
        path: 'proveedor',
        component: ProveedorComponent
      },
      {
        path: 'proveedor/insproveedor',
        component: InsProveedorComponent  
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
