import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { StockCajaServices } from '../service/stockCaja.service';
import * as StockCajaActions from '../actions/stockCaja.actions';

@Injectable()
export class StockCajaEffects {
    constructor(
        private actions: Actions,
        private stockCajaService: StockCajaServices
    ) {}

    getStockCaja = createEffect(() => this.actions.pipe(
        ofType(StockCajaActions.getStockCajaRequest),
        switchMap(() => this.stockCajaService.getStockCaja()
            .pipe(
                map(stockCaja => StockCajaActions.getStockCajaSuccess({ stockCaja : stockCaja.data, colums : stockCaja.columns })),
                catchError(error => of(StockCajaActions.stockCajaError({ error: error.message })))
            ))
    ));
}
