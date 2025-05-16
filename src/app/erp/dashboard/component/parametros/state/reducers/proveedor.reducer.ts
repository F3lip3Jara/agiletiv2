import { createReducer, on } from '@ngrx/store';
import { Proveedor } from '../interface/proveedor.interface';
import * as ProveedorActions from '../actions/proveedor.actions';
import { DataStateProveedor } from '../../../app.state';

export interface ProveedorState {
    proveedor: any[];
    error: string | null;
    loading: boolean;
    colums: any[];
}

export const initialProveedorState: DataStateProveedor = {
    proveedor: [],
    error: null,
    loading: false,
    colums: []
};

export const _proveedorReducer = createReducer(
    initialProveedorState,
    on(ProveedorActions.getProveedorSuccess, (state, { proveedor }) => ({
        ...state,
        proveedor
    })),
    on(ProveedorActions.proveedorError, (state, { error }) => ({
        ...state,
        error
    })),
    on(ProveedorActions.validaProveedorSuccess, (state, { proveedor }) => ({
        ...state,
        proveedor
    }))
 );


