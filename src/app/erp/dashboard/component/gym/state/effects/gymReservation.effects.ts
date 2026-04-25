import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { GymReservationServices } from '../service/gymReservation.service';
import * as GymReservationActions from '../actions/gymReservation.actions';

@Injectable()
export class GymReservationEffects {
    constructor(
        private actions: Actions,
        private gymReservationService: GymReservationServices
    ) {}

    getGymReservation = createEffect(() => this.actions.pipe(
        ofType(GymReservationActions.getGymReservationRequest),
        switchMap(() => this.gymReservationService.getGymReservation()
            .pipe(
                map(gymReservation => GymReservationActions.getGymReservationSuccess({ gymReservation })),
                catchError(error => of(GymReservationActions.gymReservationError({ error: error.message })))
            ))
    ));
}
