import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ParametrosState } from '../reducers/parametros.reducer';

export const selectState = createFeatureSelector<ParametrosState>('parametros');

export const selectParametros = createSelector(
   selectState,
    (state) => state.parametros
);

export const selectParametrosError = createSelector(
   selectState,
    (state) => state.error
);
export const selectParametrosById = createSelector(
    selectState,
    (state, props: { id: number }) => state.parametros?.find((item) => item.parametrosId === props.id)
);

