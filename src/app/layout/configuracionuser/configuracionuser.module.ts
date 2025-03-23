import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfiguracionuserComponent } from './configuracionuser.component';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ConfiguracionuserRoutingModule } from './configuracionuser.routing';
import { FieldsetModule } from 'primeng/fieldset';
@NgModule({
  declarations: [
    ConfiguracionuserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    CheckboxModule,
    PasswordModule,
    AvatarModule,
    DialogModule,
    DividerModule,
    ToastModule,
    ImageCropperModule,
    ConfiguracionuserRoutingModule,
    FieldsetModule
  ]
  
})
export class ConfiguracionuserModule { } 