import { createReducer, on } from '@ngrx/store';
import { Pais } from '../interface/pais.interface';
import * as PaisActions from '../actions/pais.actions';
import { DataStatePais } from '../../../app.state';

export interface PaisState {
    pais: Pais[];
    error: string | null;
    loading: boolean;
}

export const initialPaisState: DataStatePais = {
    pais: [],
    error: null,
    loading: false
};

export const _paisReducer = createReducer(
    initialPaisState,
    on(PaisActions.getPaisSuccess, (state, { pais }) => ({
        ...state,
        pais
    })),
    on(PaisActions.paisError, (state, { error }) => ({
        ...state,
        error
    }))
);
