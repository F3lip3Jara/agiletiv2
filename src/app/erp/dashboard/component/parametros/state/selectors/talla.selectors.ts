import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TallaState } from '../reducers/talla.reducer';

export const selectState = createFeatureSelector<TallaState>('talla');

export const selectTalla = createSelector(
   selectState,
    (state) => state.talla
);

export const selectTallaError = createSelector(
   selectState,
    (state) => state.error
);
export const selectTallaById = createSelector(
    selectState,
    (state, props: { id: number }) => state.talla?.find((item) => item.tallaId === props.id)
);

