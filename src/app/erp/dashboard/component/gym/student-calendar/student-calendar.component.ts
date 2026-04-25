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

    constructor(
        private store: Store<AppState>,
        private reservationService: GymReservationServices,
        private messageService: MessageService,
    ) {}

    ngOnInit(): void {
        // Cargar bloques de tiempo
        this.store.dispatch(getGymSlotRequest());
        this.store.dispatch(getGymReservationRequest()); // Cargar también reservas del usuario

        // Suscribirse a los bloques del gimnasio para armar el calendario
        this.store.select(selectGymSlot).subscribe((slots: any[]) => {
            if (slots && slots.length > 0) {
                const events = slots.map((slot) => {
                    // Si available_quota es mayor a 0, el color es verde, si no, es gris/rojo
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
                    this.store.dispatch(getGymSlotRequest());
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
