import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { GymBranchServices } from '../service/gymBranch.service';
import * as GymBranchActions from '../actions/gymBranch.actions';

@Injectable()
export class GymBranchEffects {
    constructor(
        private actions: Actions,
        private gymBranchService: GymBranchServices
    ) {}

    getGymBranch = createEffect(() => this.actions.pipe(
        ofType(GymBranchActions.getGymBranchRequest),
        switchMap(() => this.gymBranchService.getGymBranch()
            .pipe(
                map(gymBranch => GymBranchActions.getGymBranchSuccess({ gymBranch })),
                catchError(error => of(GymBranchActions.gymBranchError({ error: error.message })))
            ))
    ));
}
