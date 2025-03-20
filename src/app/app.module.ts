import { LOCALE_ID, NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy, registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './erp/auth/notfound/notfound.component';
import { IconService } from './erp/service/icon.service';
import { NodeService } from './erp/service/node.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorsErrorService } from './erp/interceptors/interceptors-error.service';
import { EffectsModule } from '@ngrx/effects';
import { ProductoEffects } from './erp/dashboard/component/parametros/state/effects/producto.effects';
import { UserEffects } from './erp/dashboard/component/seguridad/state/effects/usuarios.effects';
import { RolesEffects } from './erp/dashboard/component/seguridad/state/effects/roles.effects';
import { StoreModule } from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import { MessageService } from 'primeng/api';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ROOT_APP_REDUCER } from './erp/dashboard/component/app.state';
import { ImageCropperModule } from 'ngx-image-cropper';
import { OpcionesEffects } from './erp/dashboard/component/seguridad/state/effects/opciones.effects';
import { AccionesEffects } from './erp/dashboard/component/seguridad/state/effects/acciones.effects';
import { IndicadorEffects } from './erp/dashboard/component/state/effects/indicador.effects';
import { MensajeEffects } from './erp/dashboard/component/state/effects/mensaje.efffects';
import { EmpresaEffects } from './erp/dashboard/component/seguridad/state/effects/empresa.effects';
import { UserIdleConfig } from 'angular-user-idle';
import { ModuloEffects } from './erp/dashboard/component/seguridad/state/effects/modulo.effects';
import { SubModuloEffects } from './erp/dashboard/component/seguridad/state/effects/submodulo.effects';
import { MonedaEffects } from './erp/dashboard/component/parametros/state/effects/moneda.effects';
import { CiudadEffects } from './erp/dashboard/component/parametros/state/effects/ciudad.effects';
import { RegionEffects } from './erp/dashboard/component/parametros/state/effects/region.effects';
import { CentroEffects } from './erp/dashboard/component/parametros/state/effects/centro.effects';
import { GrupoEffects } from './erp/dashboard/component/parametros/state/effects/grupo.effects';
import { SubgrupoEffects } from './erp/dashboard/component/parametros/state/effects/subgrupo.effects';
import { ColorEffects } from './erp/dashboard/component/parametros/state/effects/color.effects';
import { PaisEffects } from './erp/dashboard/component/parametros/state/effects/pais.effects';
import { ComunaEffects } from './erp/dashboard/component/parametros/state/effects/comuna.effects';
import { UnidadEffects } from './erp/dashboard/component/parametros/state/effects/unidad.effects';
import { ClaseEffects } from './erp/dashboard/component/parametros/state/effects/clase.effects';
import { TipospagosEffects } from './erp/dashboard/component/parametros/state/effects/tipospagos.effects';
import { ProveedorEffects } from './erp/dashboard/component/parametros/state/effects/proveedor.effects';
@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [  AppRoutingModule, 
                AppLayoutModule ,               
                StoreModule.forRoot(ROOT_APP_REDUCER),
                EffectsModule.forRoot([ProductoEffects,
                    UserEffects , 
                    RolesEffects , 
                    OpcionesEffects , 
                    AccionesEffects,
                    IndicadorEffects,
                    MensajeEffects,
                    EmpresaEffects,
                    ModuloEffects,
                    SubModuloEffects,
                    MonedaEffects,
                    CiudadEffects,
                    RegionEffects,
                    CentroEffects,
                    GrupoEffects,
                    SubgrupoEffects,
                    ColorEffects,
                    PaisEffects,
                    ComunaEffects,
                    UnidadEffects,
                    ClaseEffects,
                    TipospagosEffects,
                    ProveedorEffects
                ]),
                StoreDevtoolsModule.instrument(),
                FontAwesomeModule,
                ImageCropperModule
    ] ,
    providers: [
        { provide: LocationStrategy,  useClass: HashLocationStrategy},
        IconService, NodeService,
        { provide: LOCALE_ID, useValue: 'es-ES' },
        { provide: HTTP_INTERCEPTORS,
          useClass: InterceptorsErrorService,
          multi: true
         },
         MessageService,
         {
            provide: UserIdleConfig,
            useValue: { idle:900, timeout:60, ping: 120 }
         }
        
      
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
