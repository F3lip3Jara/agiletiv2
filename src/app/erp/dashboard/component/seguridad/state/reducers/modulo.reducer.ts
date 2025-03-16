import { createReducer, on } from '@ngrx/store';
import { Modulo } from '../interface/modulo.interface';
import * as ModuloActions from '../actions/modulo.actions';
import { DataStateModulo } from '../../../app.state';

export interface ModuloState {
    modulo: Modulo[];
    error: string | null;
    loading: boolean;
    roles: any[];
    opciones : any[];
}

export const initialModuloState: DataStateModulo = {
    modulo: [],
    error: null,
    loading: false,
    roles: [],
    opciones : []
};

export const _moduloReducer = createReducer(
    initialModuloState,
    on(ModuloActions.getModuloSuccess, (state, { modulo }) => ({
        ...state,
        modulo
    })),
    on(ModuloActions.moduloError, (state, { error }) => ({
        ...state,
        error
    }))
);
