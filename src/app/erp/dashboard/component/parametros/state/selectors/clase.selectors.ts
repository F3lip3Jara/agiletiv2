import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ClaseState } from '../reducers/clase.reducer';

export const selectState = createFeatureSelector<ClaseState>('clase');

export const selectClase = createSelector(
   selectState,
    (state) => state.clase
);

export const selectClaseError = createSelector(
   selectState,
    (state) => state.error
);
export const selectClaseById = createSelector(
    selectState,
    (state, props: { id: number }) => state.clase?.find((item) => item.claseId === props.id)
);

