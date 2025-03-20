import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashBoardRoutingModule } from './dashboard-routing.module';
import { MenubarModule } from 'primeng/menubar';
import { HomeComponent } from './home/home.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    DashBoardRoutingModule,
    MenubarModule,
    GoogleMapsModule
  ]
})
export class DashboardModule { }
