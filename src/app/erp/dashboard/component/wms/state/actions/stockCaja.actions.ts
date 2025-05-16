import { createAction, props } from '@ngrx/store';
import { StockCaja } from '../interface/stockCaja.interface';

export const getStockCajaRequest = createAction(
    '[StockCaja] Get StockCaja Request'
);

export const getStockCajaSuccess = createAction(
    '[StockCaja] Get StockCaja Success',
    props<{ stockCaja: StockCaja[]  , colums: any[]}>()
);

export const stockCajaError = createAction(
    '[StockCaja] StockCaja Error',
    props<{ error: string }>()
);
