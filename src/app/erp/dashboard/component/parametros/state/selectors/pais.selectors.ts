import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PaisState } from '../reducers/pais.reducer';

export const selectState = createFeatureSelector<PaisState>('pais');

export const selectPais = createSelector(
   selectState,
    (state) => state.pais
);

export const selectPaisError = createSelector(
   selectState,
    (state) => state.error
);
export const selectPaisById = createSelector(
    selectState,
    (state, props: { id: number }) => state.pais?.find((item) => item.paisId === props.id)
);

