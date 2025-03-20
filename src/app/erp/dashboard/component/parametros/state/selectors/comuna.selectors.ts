import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ComunaState } from '../reducers/comuna.reducer';

export const selectState = createFeatureSelector<ComunaState>('comuna');

export const selectComuna = createSelector(
   selectState,
    (state) => state.comuna
);

export const selectComunaError = createSelector(
   selectState,
    (state) => state.error
);
export const selectComunaById = createSelector(
    selectState,
    (state, props: { id: number }) => state.comuna?.find((item) => item.comunaId === props.id)
);

