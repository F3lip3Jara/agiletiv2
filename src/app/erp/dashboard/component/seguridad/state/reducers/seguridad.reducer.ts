import { createReducer, on } from '@ngrx/store';
import * as SeguridadActions from '../actions/seguridad.actions';
import { DataStateSeguridad } from '../../../app.state';

export interface SeguridadState {
    seguridad: any;
    error: string | null;
    loading: boolean;
}

export const initialSeguridadState: DataStateSeguridad = {
    seguridad: [],
    error: null,
    loading: false
};

export const _seguridadReducer = createReducer(
    initialSeguridadState,
    on(SeguridadActions.getSeguridadSuccess, (state, { seguridad }) => ({
        ...state,
        seguridad
    })),
    on(SeguridadActions.seguridadError, (state, { error }) => ({
        ...state,
        error
    }))
);
