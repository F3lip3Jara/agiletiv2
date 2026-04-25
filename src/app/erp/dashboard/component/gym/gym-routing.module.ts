import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentCalendarComponent } from './student-calendar/student-calendar.component';
import { AdminCalendarComponent } from './admin-calendar/admin-calendar.component';
import { GymManagementComponent } from './gym-management/gym-management.component';

const routes: Routes = [
    { path: 'reservas', component: StudentCalendarComponent },
    { path: 'admin', component: AdminCalendarComponent },
    { path: 'sedes', component: GymManagementComponent },
    { path: '', redirectTo: 'reservas', pathMatch: 'full' },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GymRoutingModule {}
