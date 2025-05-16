import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AvatarModule } from 'primeng/avatar';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FieldsetModule } from 'primeng/fieldset';
import { PasswordModule } from 'primeng/password';
import { AccordionModule } from 'primeng/accordion';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PickListModule } from 'primeng/picklist';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { WmsRoutingModule } from './wms-routing.module';
import { TimelineModule } from 'primeng/timeline';
import { SkeletonModule } from 'primeng/skeleton';
import { FilterSidebarComponent } from '../generales/filter-sidebar/filter-sidebar.component';
import { StockComponent } from './stock/stock.component';
import { SearchDialogComponent } from '../generales/search-dialog/search-dialog.component';
import { StockCajaComponent } from './stock-caja/stock-caja.component';
  @NgModule({
  declarations: [
    StockComponent,
    StockCajaComponent

  ],
  imports: [
    WmsRoutingModule,
    CommonModule, 
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
    TimelineModule,
    SkeletonModule,
    FilterSidebarComponent,
    SearchDialogComponent
  ]
})
export class WmsModule { }
