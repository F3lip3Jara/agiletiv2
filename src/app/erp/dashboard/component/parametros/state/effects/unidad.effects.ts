import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { UnidadServices } from '../service/unidad.service';
import * as UnidadActions from '../actions/unidad.actions';

@Injectable()
export class UnidadEffects {
    constructor(
        private actions: Actions,
        private unidadService: UnidadServices
    ) {}

    getUnidad = createEffect(() => this.actions.pipe(
        ofType(UnidadActions.getUnidadRequest),
        switchMap(() => this.unidadService.getUnidad()
            .pipe(
                map(unidad => UnidadActions.getUnidadSuccess({ unidad })),
                catchError(error => of(UnidadActions.unidadError({ error: error.message })))
            ))
    ));
}
