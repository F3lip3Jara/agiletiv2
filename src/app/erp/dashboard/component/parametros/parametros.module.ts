import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosComponent } from './productos/productos.component';
import { ParametrosRoutingModule } from './parametros-routing.module';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InsMonedaComponent } from './moneda/ins-moneda/ins-moneda.component';
import { MonedaComponent } from './moneda/moneda.component';
import { UpMonedaComponent } from './moneda/up-moneda/up-moneda.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PickListModule } from 'primeng/picklist';
import { CiudadComponent } from './ciudad/ciudad.component';
import { RegionComponent } from './region/region.component';
import { CentroComponent } from './centro/centro.component';
import { InsCentroComponent } from './centro/ins-centro/ins-centro.component';
import { FieldsetModule } from 'primeng/fieldset';
import { CalendarModule } from 'primeng/calendar';
import { GoogleMapsModule } from '@angular/google-maps';
import { SelectButtonModule } from 'primeng/selectbutton';
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
import { CheckboxModule } from 'primeng/checkbox';
import { Environment } from '../../../service/environment.service';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    ProductosComponent,
    InsMonedaComponent,
    MonedaComponent,
    UpMonedaComponent,
    CiudadComponent,
    RegionComponent,
    CentroComponent,
    InsCentroComponent,
    GrupoComponent,
    SubGrupoComponent,
    ColorComponent,
    PaisComponent,
    ComunaComponent,
    UnidadComponent,
    ClaseComponent,
    TipoPagosComponent,
    ProveedorComponent,
    InsProveedorComponent
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    InputTextModule,
    InputTextareaModule,
    RatingModule,
    RippleModule,
    ButtonModule,
    SplitButtonModule,
    SpeedDialModule,
    ScrollPanelModule,
    PickListModule,
    FieldsetModule,
    CalendarModule,
    GoogleMapsModule,
    SelectButtonModule,
    DialogModule,
    CheckboxModule,
    NgSelectModule
  ],
  providers: [
    Environment
  ]
})
export class ParametrosModule { }
