import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeguridadRoutingModule } from './seguridad-routing.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { InsUsuariosComponent } from './usuarios/ins-usuarios/ins-usuarios.component';
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AvatarModule } from 'primeng/avatar';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FieldsetModule } from 'primeng/fieldset';
import { UpUsuariosComponent } from './usuarios/up-usuarios/up-usuarios.component';
import { PasswordModule } from 'primeng/password';
import { AccordionModule } from 'primeng/accordion';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RolesComponent } from './roles/roles.component';
import { InsRolesComponent } from './roles/ins-roles/ins-roles.component';
import { UpRolesComponent } from './roles/up-roles/up-roles.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ModuloComponent } from './modulo/modulo.component';
import { InsModuloComponent } from './modulo/ins-modulo/ins-modulo.component';
import { PickListModule } from 'primeng/picklist';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { UpModuloComponent } from './modulo/up-modulo/up-modulo.component';
import { SubModuloComponent } from './modulo/sub-modulo/sub-modulo.component';
import { SeguridadComponent } from './seguridad/seguridad.component';
import { InsSubmoduloComponent } from './modulo/sub-modulo/ins-submodulo/ins-submodulo.component';
import { UpSubModuloComponent } from './modulo/sub-modulo/up-sub-modulo/up-sub-modulo.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SearchDialogComponent } from '../generales/search-dialog/search-dialog.component';
import { ConfiguracionFieldComponent } from './configuracion-field/configuracion-field.component';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { FilterSidebarComponent } from '../generales/filter-sidebar/filter-sidebar.component';
import { TagModule } from 'primeng/tag';
import { LogComponent } from './log/log.component';
@NgModule({
  declarations: [
    UsuariosComponent,
    InsUsuariosComponent,
    UpUsuariosComponent,
    RolesComponent,
    InsRolesComponent,
    UpRolesComponent,
    ModuloComponent,
    InsModuloComponent,
    UpModuloComponent,
    SubModuloComponent,
    InsSubmoduloComponent,  
    UpSubModuloComponent,
    SeguridadComponent,
    ConfiguracionFieldComponent,
    LogComponent
  ],
  imports: [
    CommonModule,
    SeguridadRoutingModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,        
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    CalendarModule,
    ChipsModule,
    DropdownModule,
    InputMaskModule,    
    CascadeSelectModule,
    InputGroupAddonModule,
    InputGroupModule,
    NgSelectModule,
    ImageCropperModule,
    AvatarModule,
    FileUploadModule,    
    ConfirmPopupModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ButtonModule,
    FieldsetModule,
    PasswordModule,
    AccordionModule,
    ToggleButtonModule,
    SpeedDialModule,
    SplitButtonModule,
    PickListModule,
    ScrollPanelModule,
    ProgressSpinnerModule,
    SearchDialogComponent,
    MessageModule,
    MessagesModule,
    FilterSidebarComponent,
    TagModule
  ]
})
export class SeguridadModule { }
