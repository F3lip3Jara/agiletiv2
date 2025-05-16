import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SeguridadState } from '../reducers/seguridad.reducer';

export const selectState = createFeatureSelector<SeguridadState>('seguridad');

export const selectSeguridad = createSelector(
   selectState,
    (state) => state.seguridad
);

export const selectSeguridadError = createSelector(
   selectState,
    (state) => state.error
);
export const selectSeguridadById = createSelector(
    selectState,
    (state, props: { id: number }) => state.seguridad?.find((item) => item.seguridadId === props.id)
);

