import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { MonedaSerivices } from '../service/moneda.service';
import * as MonedaActions from '../actions/moneda.actions';

@Injectable()
export class MonedaEffects {
    constructor(
        private actions: Actions,
        private monedaService: MonedaSerivices
    ) {}

    getMoneda = createEffect(() => this.actions.pipe(
        ofType(MonedaActions.getMonedaRequest),
        switchMap(() => this.monedaService.getMoneda()
            .pipe(
                map(moneda => MonedaActions.getMonedaSuccess({ moneda })),
                catchError(error => of(MonedaActions.monedaError({ error: error.message })))
            ))
    ));
}
