import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Store } from '@ngrx/store';
import { getGymSlotRequest } from '../state/actions/gymSlot.actions';
import { selectGymSlot } from '../state/selectors/gymSlot.selectors';
import { getGymReservationRequest } from '../state/actions/gymReservation.actions';
import { GymReservationServices } from '../state/service/gymReservation.service';
import { MessageService } from 'primeng/api';
import { AppState } from '../../app.state';

import { getGymBranchRequest } from '../state/actions/gymBranch.actions';
import { selectGymBranch } from '../state/selectors/gymBranch.selectors';

@Component({
    selector: 'app-student-calendar',
    standalone: false,
    templateUrl: './student-calendar.component.html',
    styleUrl: './student-calendar.component.scss',
    providers: [MessageService],
})
export class StudentCalendarComponent implements OnInit {
    calendarOptions: CalendarOptions = {
        initialView: 'timeGridWeek',
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay',
        },
        allDaySlot: false,
        slotMinTime: '06:00:00',
        slotMaxTime: '23:00:00',
        events: [],
        eventClick: this.handleEventClick.bind(this),
        locales: [esLocale],
        locale: 'es',
        height: 'auto',
    };

    showDialog: boolean = false;
    selectedSlot: any = null;
    loading: boolean = false;
    
    branches: any[] = [];
    selectedBranchId: number | null = null;

    constructor(
        private store: Store<AppState>,
        private reservationService: GymReservationServices,
        private messageService: MessageService,
    ) {}

    ngOnInit(): void {
        // Cargar sedes primero
        this.store.dispatch(getGymBranchRequest());
        this.store.select(selectGymBranch).subscribe((data: any[]) => {
            if (data && data.length > 0) {
                // TODO: Idealmente, filtrar aquí por las restricciones del alumno
                this.branches = data;
            }
        });

        this.store.dispatch(getGymReservationRequest()); // Cargar reservas del usuario

        // Suscribirse a los bloques del gimnasio
        this.store.select(selectGymSlot).subscribe((slots: any[]) => {
            if (slots) {
                const events = slots.map((slot) => {
                    const isAvailable = slot.available_quota > 0;
                    return {
                        id: slot.id,
                        title: isAvailable
                            ? `Disponible: ${slot.available_quota}`
                            : 'Agotado',
                        start: `${slot.date}T${slot.start_time}`,
                        end: `${slot.date}T${slot.end_time}`,
                        backgroundColor: isAvailable ? '#22c55e' : '#ef4444',
                        borderColor: isAvailable ? '#16a34a' : '#dc2626',
                        extendedProps: {
                            slotData: slot,
                            isAvailable: isAvailable,
                        },
                    };
                });

                this.calendarOptions = {
                    ...this.calendarOptions,
                    events: events,
                };
            }
        });
    }
    
    onBranchSelect() {
        if (this.selectedBranchId) {
            this.store.dispatch(getGymSlotRequest({ branch_id: this.selectedBranchId }));
        }
    }

    handleEventClick(clickInfo: any) {
        const slotData = clickInfo.event.extendedProps['slotData'];
        const isAvailable = clickInfo.event.extendedProps['isAvailable'];

        if (!isAvailable) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Agotado',
                detail: 'Este bloque ya no tiene cupos disponibles.',
            });
            return;
        }

        this.selectedSlot = slotData;
        this.showDialog = true;
    }

    confirmReservation() {
        if (!this.selectedSlot) return;

        this.loading = true;
        this.reservationService
            .createGymReservation(this.selectedSlot.id)
            .subscribe({
                next: (res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Reserva confirmada correctamente.',
                    });
                    this.showDialog = false;
                    this.loading = false;
                    // Refrescar datos
                    if (this.selectedBranchId) {
                        this.store.dispatch(getGymSlotRequest({ branch_id: this.selectedBranchId }));
                    }
                    this.store.dispatch(getGymReservationRequest());
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail:
                            err.error?.error ||
                            'No se pudo procesar la reserva.',
                    });
                    this.loading = false;
                },
            });
    }
}
