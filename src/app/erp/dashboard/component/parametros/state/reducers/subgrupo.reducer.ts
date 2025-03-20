import { createReducer, on } from '@ngrx/store';
import { Subgrupo } from '../interface/subgrupo.interface';
import { DataStateSubGrupo } from '../../../app.state';
import { subgrupoError } from '../actions/subgrupo.actions';
import { getSubgrupoSuccess } from '../actions/subgrupo.actions';

export interface SubgrupoState {
    subGrupo: Subgrupo[];
    error: string | null;
    loading: boolean;
}

export const initialSubgrupoState: DataStateSubGrupo = {
    subGrupo: [],
    error: null,
    loading: false
};

export const _subgrupoReducer = createReducer(
    initialSubgrupoState,
    on(getSubgrupoSuccess, (state, { subGrupo }) => ({
        ...state,
        subGrupo
    })),
    on(subgrupoError, (state, { error }) => ({
        ...state,
        error
    }))
);
