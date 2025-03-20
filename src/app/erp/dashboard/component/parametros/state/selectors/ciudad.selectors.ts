import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CiudadState } from '../reducers/ciudad.reducer';

export const selectState = createFeatureSelector<CiudadState>('ciudad');

export const selectCiudad = createSelector(
   selectState,
    (state) => state.ciudad
);

export const selectCiudadError = createSelector(
   selectState,
    (state) => state.error
);
export const selectCiudadById = createSelector(
    selectState,
    (state, props: { id: number }) => state.ciudad?.find((item) => item.ciudadId === props.id)
);

