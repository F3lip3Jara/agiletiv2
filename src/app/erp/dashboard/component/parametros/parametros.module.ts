import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosComponent } from './productos/productos.component';
import { ParametrosRoutingModule } from './parametros-routing.module';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { FileUploadModule } from 'primeng/fileupload';
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
import { UpCentroComponent } from './centro/up-centro/up-centro.component';
import { InsClaseComponent } from './clase/ins-clase/ins-clase.component';
import { UpClaseComponent } from './clase/up-clase/up-clase.component';
import { InsColorComponent } from './color/ins-color/ins-color.component';
import { ColorPickerModule } from 'primeng/colorpicker';
import { UpColorComponent } from './color/up-color/up-color.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ParametrosComponent } from './parametros/parametros.component';
import { MessageModule } from 'primeng/message';
import { InsGrupoComponent } from './grupo/ins-grupo/ins-grupo.component';
import { UpGrupoComponent } from './grupo/up-grupo/up-grupo.component';
import { InsSubgrupoComponent } from './sub-grupo/ins-subgrupo/ins-subgrupo.component';
import { UpSubgrupoComponent } from './sub-grupo/up-subgrupo/up-subgrupo.component';
import { InsProductosComponent } from './productos/ins-productos/ins-productos.component';
import { TallaComponent } from './talla/talla.component';
import { InsTallaComponent } from './talla/ins-talla/ins-talla.component';
import { UpTallaComponent } from './talla/up-talla/up-talla.component';
import { EditorModule } from 'primeng/editor';
import { ChipModule } from 'primeng/chip';
import { TabViewModule } from 'primeng/tabview';
import { DragDropModule } from '@angular/cdk/drag-drop';
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
import { SearchDialogComponent } from '../generales/search-dialog/search-dialog.component';
import { FilterSidebarComponent } from '../generales/filter-sidebar/filter-sidebar.component';

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
    InsProveedorComponent,
    UpCentroComponent,
    InsClaseComponent,
    UpClaseComponent,
    InsColorComponent,
    UpColorComponent,
    ParametrosComponent,
    InsGrupoComponent,
    UpGrupoComponent,
    InsSubgrupoComponent,
    UpSubgrupoComponent,
    InsProductosComponent,
    TallaComponent, 
    InsTallaComponent,
    UpTallaComponent,
    UpProductosComponent,
    UpProveedorComponent,
    InsTipopagosComponent,
    UpTipospagosComponent,
    AlmacenComponent,
    InsAlmacenComponent,
    UpAlmacenComponent,
    WorkflowComponent,
    SectorComponent,
    InsSectorComponent,
    UpSectorComponent
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    TreeTableModule,
    FileUploadModule,
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
    CheckboxModule,
    NgSelectModule,
    ColorPickerModule,
    ProgressSpinnerModule,
    MessageModule,
    EditorModule,
    ChipModule,
    TabViewModule,
    DragDropModule,
    SearchDialogComponent,
    FilterSidebarComponent
  ],
  providers: [
    Environment
  ]
})
export class ParametrosModule { } 