import { NgModule } from "@angular/core";
import { OpcionesComponent } from "./opciones/opciones.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { AdministracionRoutingModule } from "./administracion-routing.module";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { RippleModule } from "primeng/ripple";
import { RatingModule } from "primeng/rating";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { RadioButtonModule } from "primeng/radiobutton";
import { InputNumberModule } from "primeng/inputnumber";
import { DialogModule } from "primeng/dialog";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputGroupModule } from "primeng/inputgroup";
import { ImageCropperModule } from "ngx-image-cropper";
import { AvatarModule } from "primeng/avatar";
import { FileUploadModule } from "primeng/fileupload";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FieldsetModule } from "primeng/fieldset";
import { PasswordModule } from "primeng/password";
import { AccordionModule } from "primeng/accordion";
import { ToggleButtonModule } from "primeng/togglebutton";
import { SpeedDialModule } from "primeng/speeddial"; 
import { InsOpcionesComponent } from "./opciones/ins-opciones/ins-opciones.component";
import { UpOpcionesComponent } from "./opciones/up-opciones/up-opciones.component";
import { AccionesComponent } from "./acciones/acciones.component";
import { InsAccionesComponent } from "./acciones/ins-acciones/ins-acciones.component";
import { UpAccionesComponent } from "./acciones/up-acciones/up-acciones.component";
import { TagModule } from "primeng/tag";
import { EmpresaComponent } from "./empresa/empresa.component";
import { InsEmpresaComponent } from "./empresa/ins-empresa/ins-empresa.component";
import { UpEmpresaComponent } from "./empresa/up-empresa/up-empresa.component";
import { AdmOpcionesComponent } from "./empresa/adm-opciones/adm-opciones.component";
import { PickListModule } from 'primeng/picklist';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SearchDialogComponent } from "../../generales/search-dialog/search-dialog.component";
@NgModule({
    declarations: [
        OpcionesComponent,
        InsOpcionesComponent,
        UpOpcionesComponent,
        AccionesComponent,
        InsAccionesComponent,
        UpAccionesComponent,
        EmpresaComponent,
        InsEmpresaComponent,
        UpEmpresaComponent,
        AdmOpcionesComponent
    ],
    imports: [
      CommonModule,
      AdministracionRoutingModule, 
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
      TagModule,
      PickListModule,
      SplitButtonModule,
      SearchDialogComponent
    ],
})


export class AdministracionModule { }