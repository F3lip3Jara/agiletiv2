import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentCalendarComponent } from './student-calendar/student-calendar.component';
import { AdminCalendarComponent } from './admin-calendar/admin-calendar.component';
import { GymManagementComponent } from './gym-management/gym-management.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { TeacherStudentsComponent } from './teacher-students/teacher-students.component';
import { AdminConfigComponent } from './admin-config/admin-config.component';

const routes: Routes = [
    { path: 'perfil', component: StudentProfileComponent },
    { path: 'reservas', component: StudentCalendarComponent },
    { path: 'profesor/alumnos', component: TeacherStudentsComponent },
    { path: 'admin', component: AdminCalendarComponent },
    { path: 'sedes', component: GymManagementComponent },
    { path: 'horarios', component: AdminConfigComponent },
    { path: '', redirectTo: 'reservas', pathMatch: 'full' },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GymRoutingModule {}
