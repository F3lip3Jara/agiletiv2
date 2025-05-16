import { createReducer, on } from '@ngrx/store';
import { StockCaja } from '../interface/stockCaja.interface';
import * as StockCajaActions from '../actions/stockCaja.actions';
import { DataStateStockCaja } from '../../../app.state';

export interface StockCajaState {
    stockCaja: StockCaja[];
    error: string | null;
    loading: boolean;
    colums: any[];
}

export const initialStockCajaState: DataStateStockCaja = {
    stockCaja: [],
    error: null,
    loading: false,
    colums: []
};

export const _stockCajaReducer = createReducer(
    initialStockCajaState,
    on(StockCajaActions.getStockCajaSuccess, (state, { stockCaja }) => ({
        ...state,
        stockCaja
    })),
    on(StockCajaActions.stockCajaError, (state, { error }) => ({
        ...state,
        error
    }))
);
