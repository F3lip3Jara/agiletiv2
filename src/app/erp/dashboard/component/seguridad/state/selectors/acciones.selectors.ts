import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AccionesState } from '../reducers/acciones.reducer';

export const selectState = createFeatureSelector<AccionesState>('acciones');

export const selectAcciones = createSelector(
   selectState,
    (state) => state.acciones
);

export const selectAccionesError = createSelector(
   selectState,
    (state) => state.error
);
export const selectAccionesById = createSelector(
    selectState,
    (state, props: { id: number }) => state.acciones?.find((item) => item.accionesId === props.id)
);

