import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { StockServices } from '../service/stock.service';
import * as StockActions from '../actions/stock.actions';

@Injectable()
export class StockEffects {
    constructor(
        private actions: Actions,
        private stockService: StockServices
    ) {}

    getStock = createEffect(() => this.actions.pipe(
        ofType(StockActions.getStockRequest),
        switchMap(() => this.stockService.getStock()
            .pipe(
                map(stock => StockActions.getStockSuccess({ stock: stock.data, colums: stock.columns })),
                catchError(error => of(StockActions.stockError({ error: error.message })))
            ))
    ));
}
