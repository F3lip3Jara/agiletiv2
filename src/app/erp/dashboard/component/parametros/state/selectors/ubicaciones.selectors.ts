import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UbicacionesState } from '../reducers/ubicaciones.reducer';

export const selectState = createFeatureSelector<UbicacionesState>('ubicaciones');

export const selectUbicaciones = createSelector(
   selectState,
    (state) => state.ubicaciones
);

export const selectUbicacionesError = createSelector(
   selectState,
    (state) => state.error
);
export const selectUbicacionesById = createSelector(
    selectState,
    (state, props: { id: number }) => state.ubicaciones?.find((item) => item.ubicacionesId === props.id)
);

