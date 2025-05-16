import { createSelector, createFeatureSelector } from '@ngrx/store';
import { StockState } from '../reducers/stock.reducer';

export const selectState = createFeatureSelector<StockState>('stock');

export const selectStock = createSelector(
   selectState,
    (state) => state.stock
);

export const selectStockError = createSelector(
   selectState,
    (state) => state.error
);
export const selectStockById = createSelector(
    selectState,
    (state, props: { id: number }) => state.stock?.find((item) => item.stockId === props.id)
);

