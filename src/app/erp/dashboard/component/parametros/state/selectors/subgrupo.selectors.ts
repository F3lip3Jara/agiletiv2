import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SubgrupoState } from '../reducers/subgrupo.reducer';

export const selectState = createFeatureSelector<SubgrupoState>('subGrupo');

export const selectSubgrupo = createSelector(
   selectState,
    (state) => state.subGrupo
);

export const selectSubgrupoError = createSelector(
   selectState,
    (state) => state.error
);
export const selectSubgrupoById = createSelector(
    selectState,
    (state, props: { id: number }) => state.subGrupo?.find((item) => item.grpsId === props.id)
);

