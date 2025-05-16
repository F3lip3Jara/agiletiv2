import { createReducer, on } from '@ngrx/store';
import { Stock } from '../interface/stock.interface';
import * as StockActions from '../actions/stock.actions';
import { DataStateStock } from '../../../app.state';

export interface StockState {
    stock: Stock[];
    error: string | null;
    loading: boolean;
    colums: any[];
}

export const initialStockState: DataStateStock = {
    stock: [],
    error: null,
    loading: false,
    colums: []
};

export const _stockReducer = createReducer(
    initialStockState,
    on(StockActions.getStockSuccess, (state, { stock }) => ({
        ...state,
        stock
    })),
    on(StockActions.stockError, (state, { error }) => ({
        ...state,
        error
    }))
);
