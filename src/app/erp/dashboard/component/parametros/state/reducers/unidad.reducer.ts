import { createReducer, on } from '@ngrx/store';
import { Unidad } from '../interface/unidad.interface';
import * as UnidadActions from '../actions/unidad.actions';
import { DataStateUnidad } from '../../../app.state';

export interface UnidadState {
    unidad: Unidad[];
    error: string | null;
    loading: boolean;
}

export const initialUnidadState: DataStateUnidad = {
    unidad: [],
    error: null,
    loading: false
};

export const _unidadReducer = createReducer(
    initialUnidadState,
    on(UnidadActions.getUnidadSuccess, (state, { unidad }) => ({
        ...state,
        unidad
    })),
    on(UnidadActions.unidadError, (state, { error }) => ({
        ...state,
        error
    }))
);
