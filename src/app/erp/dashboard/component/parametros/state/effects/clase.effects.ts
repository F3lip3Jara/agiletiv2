import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ClaseServices } from '../service/clase.service';
import * as ClaseActions from '../actions/clase.actions';

@Injectable()
export class ClaseEffects {
    constructor(
        private actions: Actions,
        private claseService: ClaseServices
    ) {}

    getClase = createEffect(() => this.actions.pipe(
        ofType(ClaseActions.getClaseRequest),
        switchMap(() => this.claseService.getClase()
            .pipe(
                map(clase => ClaseActions.getClaseSuccess({ clase })),
                catchError(error => of(ClaseActions.claseError({ error: error.message })))
            ))
    ));
}
