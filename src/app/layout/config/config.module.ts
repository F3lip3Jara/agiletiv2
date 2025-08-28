import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SidebarModule } from 'primeng/sidebar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AppConfigComponent } from './app.config.component';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { MessagesModule } from 'primeng/messages';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { IndicatorsComponent } from './indicators.component';
import { DashboardWidgetsComponent } from './dashboard-widgets.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        SidebarModule,
        RadioButtonModule,
        ButtonModule,
        InputSwitchModule,
        TooltipModule,
        TabViewModule,
        AvatarModule,
        MessagesModule,
        CalendarModule,
        SelectButtonModule,
        ProgressBarModule,
    ],
    declarations: [
        AppConfigComponent,
        IndicatorsComponent,
        DashboardWidgetsComponent
    ],
    exports: [
        AppConfigComponent
    ]
})
export class AppConfigModule { }
