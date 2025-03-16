import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ModuloState } from '../reducers/modulo.reducer';

export const selectState = createFeatureSelector<ModuloState>('modulo');

export const selectModulo = createSelector(
   selectState,
    (state) => state.modulo
);

export const selectModuloError = createSelector(
   selectState,
    (state) => state.error
);
export const selectModuloById = createSelector(
    selectState,
    (state, props: { id: number }) => state.modulo?.find((item) => item.moduloId === props.id)
);

