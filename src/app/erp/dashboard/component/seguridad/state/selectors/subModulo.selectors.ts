import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SubModuloState } from '../reducers/subModulo.reducer';

export const selectState = createFeatureSelector<SubModuloState>('subModulo');

export const selectSubModulo = createSelector(
   selectState,
    (state) => state.subModulo
);

export const selectSubModuloError = createSelector(
   selectState,
    (state) => state.error
);
export const selectSubModuloById = createSelector(
    selectState,
    (state, props: { id: number }) => state.subModulo?.find((item) => item.subModuloId === props.id)
);

