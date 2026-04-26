import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getGymSlotRequest } from '../state/actions/gymSlot.actions';
import { selectGymSlot } from '../state/selectors/gymSlot.selectors';
import { getGymReservationRequest } from '../state/actions/gymReservation.actions';
import { selectGymReservation } from '../state/selectors/gymReservation.selectors';
import { AppState } from '../../app.state';

@Component({
    selector: 'app-admin-calendar',
    standalone: false,
    templateUrl: './admin-calendar.component.html',
    styleUrl: './admin-calendar.component.scss',
})
export class AdminCalendarComponent implements OnInit {
    slots: any[] = [];
    reservations: any[] = [];
    loading: boolean = true;

    constructor(private store: Store<AppState>) {}

    ngOnInit(): void {
        this.store.dispatch(getGymSlotRequest({}));
        this.store.dispatch(getGymReservationRequest());

        this.store.select(selectGymSlot).subscribe((data) => {
            if (data) {
                this.slots = data;
                this.loading = false;
            }
        });

        this.store.select(selectGymReservation).subscribe((data) => {
            if (data) {
                this.reservations = data;
            }
        });
    }

    getReservationsForSlot(slotId: number) {
        return this.reservations.filter((r) => r.gym_slot_id === slotId);
    }
}
