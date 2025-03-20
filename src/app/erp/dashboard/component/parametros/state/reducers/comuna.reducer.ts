import { createReducer, on } from '@ngrx/store';
import { Comuna } from '../interface/comuna.interface';
import * as ComunaActions from '../actions/comuna.actions';
import { DataStateComuna } from '../../../app.state';

export interface ComunaState {
    comuna: Comuna[];
    error: string | null;
    loading: boolean;
}

export const initialComunaState: DataStateComuna = {
    comuna: [],
    error: null,
    loading: false
};

export const _comunaReducer = createReducer(
    initialComunaState,
    on(ComunaActions.getComunaSuccess, (state, { comuna }) => ({
        ...state,
        comuna
    })),
    on(ComunaActions.comunaError, (state, { error }) => ({
        ...state,
        error
    }))
);
