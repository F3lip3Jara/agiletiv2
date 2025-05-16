import { createReducer, on } from '@ngrx/store';

import * as ParametrosActions from '../actions/parametros.actions';
import { DataStateParametros } from '../../../app.state';

export interface ParametrosState {
    parametros: any[];
    error: string | null;
    loading: boolean;
}

export const initialParametrosState: DataStateParametros = {
    parametros: [],
    error: null,
    loading: false
};

export const _parametrosReducer = createReducer(
    initialParametrosState,
    on(ParametrosActions.getParametrosSuccess, (state, { parametros }) => ({
        ...state,
        parametros
    })),
    on(ParametrosActions.parametrosError, (state, { error }) => ({
        ...state,
        error
    }))
);
