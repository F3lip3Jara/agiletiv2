import { createReducer, on } from '@ngrx/store';
import { Ubicaciones } from '../interface/ubicaciones.interface';
import * as UbicacionesActions from '../actions/ubicaciones.actions';
import { DataStateUbicaciones } from '../../../app.state';

export interface UbicacionesState {
    ubicaciones: Ubicaciones[];
    error: string | null;
    loading: boolean;
}

export const initialUbicacionesState: DataStateUbicaciones = {
    ubicaciones: [],
    error: null,
    loading: false
};

export const _ubicacionesReducer = createReducer(
    initialUbicacionesState,
    on(UbicacionesActions.getUbicacionesSuccess, (state, { ubicaciones }) => ({
        ...state,
        ubicaciones
    })),
    on(UbicacionesActions.ubicacionesError, (state, { error }) => ({
        ...state,
        error
    }))
);
