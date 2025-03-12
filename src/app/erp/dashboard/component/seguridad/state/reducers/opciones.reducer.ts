import { createReducer, on } from '@ngrx/store';
import * as OpcionesActions from '../actions/opciones.actions';
import { DataStateOpciones } from '../../../app.state';

export interface OpcionesState {
    opciones: any[];
    error: string | null;
}

export const initialOpcionesState: DataStateOpciones = {
    opciones: [],
    error: null,
    loading: false
};

export const _opcionesReducer = createReducer(
    initialOpcionesState,
    on(OpcionesActions.getOpcionesSuccess, (state, { opciones }) => ({
        ...state,
        opciones
    })),
    on(OpcionesActions.opcionesError, (state, { error }) => ({
        ...state,
        error
    }))
);
