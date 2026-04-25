import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { GymSlotServices } from '../service/gymSlot.service';
import * as GymSlotActions from '../actions/gymSlot.actions';

@Injectable()
export class GymSlotEffects {
    constructor(
        private actions: Actions,
        private gymSlotService: GymSlotServices
    ) {}

    getGymSlot = createEffect(() => this.actions.pipe(
        ofType(GymSlotActions.getGymSlotRequest),
        switchMap(() => this.gymSlotService.getGymSlot()
            .pipe(
                map(gymSlot => GymSlotActions.getGymSlotSuccess({ gymSlot })),
                catchError(error => of(GymSlotActions.gymSlotError({ error: error.message })))
            ))
    ));
}
