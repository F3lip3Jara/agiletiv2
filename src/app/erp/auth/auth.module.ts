import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CambiodepassComponent } from './login/cambiodepass/cambiodepass.component';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        PasswordModule,
        CheckboxModule,
        ButtonModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        DividerModule,
        MessageModule
    ]
})
export class AuthModule { }
