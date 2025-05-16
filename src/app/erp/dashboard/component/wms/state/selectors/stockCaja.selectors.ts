import { createSelector, createFeatureSelector } from '@ngrx/store';
import { StockCajaState } from '../reducers/stockCaja.reducer';

export const selectState = createFeatureSelector<StockCajaState>('stockCaja');

export const selectStockCaja = createSelector(
   selectState,
    (state) => state.stockCaja
);

export const selectStockCajaError = createSelector(
   selectState,
    (state) => state.error
);
export const selectStockCajaById = createSelector(
    selectState,
    (state, props: { id: number }) => state.stockCaja?.find((item) => item.stockCajaId === props.id)
);

