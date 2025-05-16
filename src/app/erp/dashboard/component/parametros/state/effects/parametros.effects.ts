import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ParametrosServices } from '../service/parametros.service';
import * as ParametrosActions from '../actions/parametros.actions';

@Injectable()
export class ParametrosEffects {
    constructor(
        private actions: Actions,
        private parametrosService: ParametrosServices
    ) {}

    getParametros = createEffect(() => this.actions.pipe(
        ofType(ParametrosActions.getParametrosRequest),
        switchMap(() => this.parametrosService.getParametros()
            .pipe(
                map(parametros => ParametrosActions.getParametrosSuccess({ parametros })),
                catchError(error => of(ParametrosActions.parametrosError({ error: error.message })))
            ))
    ));
}
