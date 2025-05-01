import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AlmacenState } from '../reducers/almacen.reducer';

export const selectState = createFeatureSelector<AlmacenState>('almacen');

export const selectAlmacen = createSelector(
   selectState,
    (state) => state.almacen
);

export const selectAlmacenError = createSelector(
   selectState,
    (state) => state.error
);
export const selectAlmacenById = createSelector(
    selectState,
    (state, props: { id: number }) => state.almacen?.find((item) => item.almacenId === props.id)
);

