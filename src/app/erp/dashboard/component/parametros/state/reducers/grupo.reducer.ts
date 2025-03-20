import { createReducer, on } from '@ngrx/store';
import { Grupo } from '../interface/grupo.interface';
import * as GrupoActions from '../actions/grupo.actions';
import { DataStateGrupo } from '../../../app.state';

export interface GrupoState {
    grupo: Grupo[];
    error: string | null;
    loading: boolean;
}

export const initialGrupoState: DataStateGrupo = {
    grupo: [],
    error: null,
    loading: false
};

export const _grupoReducer = createReducer(
    initialGrupoState,
    on(GrupoActions.getGrupoSuccess, (state, { grupo }) => ({
        ...state,
        grupo
    })),
    on(GrupoActions.grupoError, (state, { error }) => ({
        ...state,
        error
    }))
);
