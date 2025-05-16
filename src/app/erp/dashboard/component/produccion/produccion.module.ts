import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProduccionRoutingModule } from './produccion-routing.module';
import { PedidoComponent } from './pedido/pedido.component';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { InsPedidoComponent } from './pedido/ins-pedido/ins-pedido.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { UpPedidoComponent } from './pedido/up-pedido/up-pedido.component';
import { VerPedidoComponent } from './pedido/ver-pedido/ver-pedido.component';
import { TimelineModule } from 'primeng/timeline';
import { SkeletonModule } from 'primeng/skeleton';
import { SearchDialogComponent } from '../generales/search-dialog/search-dialog.component';
import { FilterSidebarComponent } from '../generales/filter-sidebar/filter-sidebar.component';

@NgModule({
  declarations: [
    PedidoComponent,
    InsPedidoComponent,
    UpPedidoComponent,
    VerPedidoComponent
  ],
  imports: [
    CommonModule,
    ProduccionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    AutoCompleteModule,
    InputTextModule,
    InputTextareaModule,
    TableModule,
    InputNumberModule,
    OverlayPanelModule,
    DialogModule,
    FileUploadModule,
    ToastModule,
    SplitButtonModule,
    TimelineModule,
    SkeletonModule,
    SearchDialogComponent,
    FilterSidebarComponent
  ],
  providers: [
    
  ]
})
export class ProduccionModule { }
