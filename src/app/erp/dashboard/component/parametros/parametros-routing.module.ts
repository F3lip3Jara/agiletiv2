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
import { UpCentroComponent } from './centro/up-centro/up-centro.component';
import { InsClaseComponent } from './clase/ins-clase/ins-clase.component';
import { UpClaseComponent } from './clase/up-clase/up-clase.component';
import { InsColorComponent } from './color/ins-color/ins-color.component';
import { UpColorComponent } from './color/up-color/up-color.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { InsGrupoComponent } from './grupo/ins-grupo/ins-grupo.component';
import { UpGrupoComponent } from './grupo/up-grupo/up-grupo.component';
import { InsSubgrupoComponent } from './sub-grupo/ins-subgrupo/ins-subgrupo.component';
import { UpSubgrupoComponent } from './sub-grupo/up-subgrupo/up-subgrupo.component';
import { InsProductosComponent } from './productos/ins-productos/ins-productos.component';
import { TallaComponent } from './talla/talla.component';
import { InsTallaComponent } from './talla/ins-talla/ins-talla.component';
import { UpTallaComponent } from './talla/up-talla/up-talla.component';
import { UpProductosComponent } from './productos/up-productos/up-productos.component';
import { UpProveedorComponent } from './proveedor/up-proveedor/up-proveedor.component';
import { InsTipopagosComponent } from './tipo-pagos/ins-tipopagos/ins-tipopagos.component';
import { UpTipospagosComponent } from './tipo-pagos/up-tipospagos/up-tipospagos.component';
import { AlmacenComponent } from './centro/almacen/almacen.component';
import { InsAlmacenComponent } from './centro/almacen/ins-almacen/ins-almacen.component';
import { UpAlmacenComponent } from './centro/almacen/up-almacen/up-almacen.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { SectorComponent } from './centro/almacen/sector/sector.component';
import { InsSectorComponent } from './centro/almacen/sector/ins-sector/ins-sector.component';
import { UpSectorComponent } from './centro/almacen/sector/up-sector/up-sector.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Parametros',
    },
    children: [
      {
        path: '',
        component: ParametrosComponent
      },
      {
        path: 'productos',
        component: ProductosComponent
      },
      {
        path: 'productos/insproducto',
        component: InsProductosComponent
      },
      {
        path: 'productos/upproducto/:producto',
        component: UpProductosComponent
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
        path: 'centro/upcentro/:centro',
        component: UpCentroComponent
      },
      {
        path: 'centro/almacen/:centro',
        component: AlmacenComponent
      },  
      {
        path: 'centro/almacen/insalmacen/:centro',
        component: InsAlmacenComponent
      },
      {
        path: 'centro/almacen/upalmacen/:almacen',
        component: UpAlmacenComponent
      },
      {
        path: 'centro/almacen/sector/:almacen',
        component: SectorComponent
      },  
      {
        path: 'centro/almacen/sector/inssector/:almacen',
        component: InsSectorComponent
      },
      {
        path: 'centro/almacen/sector/upsector/:almacen',
        component: UpSectorComponent  
      },

      {
        path: 'grupo',
        component: GrupoComponent
      },
      {
        path: 'grupo/insgrupo',
        component: InsGrupoComponent  
      },
      {
        path: 'grupo/upgrupo/:grupo',
        component: UpGrupoComponent
      },
      {
        path: 'sub_grupo',
        component: SubGrupoComponent
      },
      {
        path: 'sub_grupo/inssubgrupo',
        component: InsSubgrupoComponent
      },
      {
        path: 'sub_grupo/upsubgrupo/:subgrupo',
        component: UpSubgrupoComponent
      },
      {
        path: 'color',
        component: ColorComponent
      },
      {
        path: 'color/inscolor',
        component: InsColorComponent
      },
      {
        path: 'color/upcolor/:color',
        component: UpColorComponent
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
        path: 'clase/insclase',
        component: InsClaseComponent
      },
      {
        path: 'clase/upclase/:clase',
        component: UpClaseComponent
      },
      {
        path: 'clase/workflow/:clase',
        component: WorkflowComponent
      },
      {
        path: 'tipo_pago',
        component: TipoPagosComponent
      },
      {
        path: 'tipo_pago/instipopagos',
        component: InsTipopagosComponent  
      },
      {
        path: 'tipo_pago/uptipopagos/:tipopago',
        component: UpTipospagosComponent
      },
      {
        path: 'proveedor',
        component: ProveedorComponent
      },     
      {
        path: 'proveedor/insproveedor',
        component: InsProveedorComponent  
      },
      {
        path: 'proveedor/upproveedor/:proveedor',
        component: UpProveedorComponent
      },
      {
        path: 'talla',
        component: TallaComponent
      },
      {
        path: 'talla/installa',
        component: InsTallaComponent  
      },
      {
        path: 'talla/uptalla/:talla',
        component: UpTallaComponent
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
