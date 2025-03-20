import { createSelector, createFeatureSelector } from '@ngrx/store';
import { GrupoState } from '../reducers/grupo.reducer';

export const selectState = createFeatureSelector<GrupoState>('grupo');

export const selectGrupo = createSelector(
   selectState,
    (state) => state.grupo
);

export const selectGrupoError = createSelector(
   selectState,
    (state) => state.error
);
export const selectGrupoById = createSelector(
    selectState,
    (state, props: { id: number }) => state.grupo?.find((item) => item.grupoId === props.id)
);

