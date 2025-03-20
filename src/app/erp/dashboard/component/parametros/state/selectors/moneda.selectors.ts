import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MonedaState } from '../reducers/moneda.reducer';

export const selectState = createFeatureSelector<MonedaState>('moneda');

export const selectMoneda = createSelector(
   selectState,
    (state) => state.moneda
);

export const selectMonedaError = createSelector(
   selectState,
    (state) => state.error
);
export const selectMonedaById = createSelector(
    selectState,
    (state, props: { id: number }) => state.moneda?.find((item) => item.monedaId === props.id)
);

