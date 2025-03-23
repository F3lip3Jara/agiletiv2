import { createReducer, on } from '@ngrx/store';
import { Talla } from '../interface/talla.interface';
import * as TallaActions from '../actions/talla.actions';
import { DataStateTalla } from '../../../app.state';

export interface TallaState {
    talla: Talla[];
    error: string | null;
    loading: boolean;
}

export const initialTallaState: DataStateTalla = {
    talla: [],
    error: null,
    loading: false
};

export const _tallaReducer = createReducer(
    initialTallaState,
    on(TallaActions.getTallaSuccess, (state, { talla }) => ({
        ...state,
        talla
    })),
    on(TallaActions.tallaError, (state, { error }) => ({
        ...state,
        error
    }))
);
