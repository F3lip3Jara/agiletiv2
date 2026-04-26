import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GymRoutingModule } from './gym-routing.module';
import { StudentCalendarComponent } from './student-calendar/student-calendar.component';
import { AdminCalendarComponent } from './admin-calendar/admin-calendar.component';

// FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { _gymSlotReducer } from './state/reducers/gymSlot.reducer';
import { GymSlotEffects } from './state/effects/gymSlot.effects';
import { _gymReservationReducer } from './state/reducers/gymReservation.reducer';
import { GymReservationEffects } from './state/effects/gymReservation.effects';
import { _gymReducer } from './state/reducers/gym.reducer';
import { GymEffects } from './state/effects/gym.effects';
import { _gymBranchReducer } from './state/reducers/gymBranch.reducer';
import { GymBranchEffects } from './state/effects/gymBranch.effects';

// PrimeNG Inputs
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { GymManagementComponent } from './gym-management/gym-management.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { TeacherStudentsComponent } from './teacher-students/teacher-students.component';
import { AdminConfigComponent } from './admin-config/admin-config.component';

@NgModule({
    declarations: [
        StudentCalendarComponent,
        AdminCalendarComponent,
        GymManagementComponent,
        StudentProfileComponent,
        TeacherStudentsComponent,
        AdminConfigComponent
    ],
    imports: [
        CommonModule,
        GymRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        FullCalendarModule,
        DialogModule,
        ButtonModule,
        TableModule,
        ToastModule,
        DropdownModule,
        TagModule,
        ToolbarModule,
        InputTextModule,
        InputNumberModule,
        InputTextareaModule,
        StoreModule.forFeature('gymSlot', _gymSlotReducer),
        StoreModule.forFeature('gymReservation', _gymReservationReducer),
        StoreModule.forFeature('gym', _gymReducer),
        StoreModule.forFeature('gymBranch', _gymBranchReducer),
        EffectsModule.forFeature([GymSlotEffects, GymReservationEffects, GymEffects, GymBranchEffects])
    ],
})
export class GymModule {}
