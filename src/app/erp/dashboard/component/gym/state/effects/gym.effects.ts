import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { GymServices } from '../service/gym.service';
import * as GymActions from '../actions/gym.actions';

@Injectable()
export class GymEffects {
    constructor(
        private actions: Actions,
        private gymService: GymServices
    ) {}

    getGym = createEffect(() => this.actions.pipe(
        ofType(GymActions.getGymRequest),
        switchMap(() => this.gymService.getGym()
            .pipe(
                map(gym => GymActions.getGymSuccess({ gym })),
                catchError(error => of(GymActions.gymError({ error: error.message })))
            ))
    ));
}
