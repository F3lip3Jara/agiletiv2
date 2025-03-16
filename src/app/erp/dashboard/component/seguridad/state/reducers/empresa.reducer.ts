import { createReducer, on } from '@ngrx/store';
import { Empresa } from '../interface/empresa.interface';
import * as EmpresaActions from '../actions/empresa.actions';
import { DataStateEmpresa } from '../../../app.state';


export const initialEmpresaState: DataStateEmpresa = {
    empresa: [],
    error: null,
    loading: false,
    logo: '',
    opcionesAsignadas: [],
    opcionesNoAsignadas: []
};

export const _empresaReducer = createReducer(
    initialEmpresaState,
    on(EmpresaActions.getEmpresaSuccess, (state, { empresa }) => ({
        ...state,
        empresa
    })),
    on(EmpresaActions.logoEmpresaSuccess, (state, { logo }) => ({
        ...state,
        logo
    })),
    on(EmpresaActions.empresaError, (state, { error }) => ({
        ...state,
        error
    })),

    on(EmpresaActions.getOpcionesAsignadasSuccess, (state, { opciones }) => ({
        ...state,
        opcionesAsignadas: opciones
    })),
    on(EmpresaActions.getOpcionesNoAsignadasSuccess, (state, { opciones }) => ({
        ...state,
        opcionesNoAsignadas: opciones
    }))
);
