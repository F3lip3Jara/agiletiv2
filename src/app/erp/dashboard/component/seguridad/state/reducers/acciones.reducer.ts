import { createReducer, on } from '@ngrx/store';
import { Acciones } from '../interface/acciones.interface';
import * as AccionesActions from '../actions/acciones.actions';
import { DataStateAcciones } from '../../../app.state';

export interface AccionesState {
    acciones: Acciones[];
    error: string | null;
}

export const initialAccionesState: DataStateAcciones = {
    acciones: [],
    error: null,
    loading: false
};

export const _accionesReducer = createReducer(
    initialAccionesState,
    on(AccionesActions.getAccionesSuccess, (state, { acciones }) => ({
        ...state,
        acciones
    })),
    on(AccionesActions.accionesError, (state, { error }) => ({
        ...state,
        error
    }))
);
