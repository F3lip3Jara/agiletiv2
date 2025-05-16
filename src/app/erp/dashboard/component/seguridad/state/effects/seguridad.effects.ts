import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SeguridadServices } from '../service/seguridad.service';
import * as SeguridadActions from '../actions/seguridad.actions';

@Injectable()
export class SeguridadEffects {
    constructor(
        private actions: Actions,
        private seguridadService: SeguridadServices
    ) {}

    getSeguridad = createEffect(() => this.actions.pipe(
        ofType(SeguridadActions.getSeguridadRequest),
        switchMap(() => this.seguridadService.getSeguridad()
            .pipe(
                map(seguridad => SeguridadActions.getSeguridadSuccess({ seguridad })),
                catchError(error => of(SeguridadActions.seguridadError({ error: error.message })))
            ))
    ));
}
