import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UnidadState } from '../reducers/unidad.reducer';

export const selectState = createFeatureSelector<UnidadState>('unidad');

export const selectUnidad = createSelector(
   selectState,
    (state) => state.unidad
);

export const selectUnidadError = createSelector(
   selectState,
    (state) => state.error
);
export const selectUnidadById = createSelector(
    selectState,
    (state, props: { id: number }) => state.unidad?.find((item) => item.unidadId === props.id)
);

