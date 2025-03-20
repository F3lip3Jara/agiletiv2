import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CentroState } from '../reducers/centro.reducer';

export const selectState = createFeatureSelector<CentroState>('centro');

export const selectCentro = createSelector(
   selectState,
    (state) => state.centro
);

export const selectCentroError = createSelector(
   selectState,
    (state) => state.error
);
export const selectCentroById = createSelector(
    selectState,
    (state, props: { id: number }) => state.centro?.find((item) => item.centroId === props.id)
);

