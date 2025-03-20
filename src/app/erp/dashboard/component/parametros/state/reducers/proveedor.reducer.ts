import { createReducer, on } from '@ngrx/store';
import { Proveedor } from '../interface/proveedor.interface';
import * as ProveedorActions from '../actions/proveedor.actions';
import { DataStateProveedor } from '../../../app.state';

export interface ProveedorState {
    proveedor: Proveedor[];
    error: string | null;
    loading: boolean;
}

export const initialProveedorState: DataStateProveedor = {
    proveedor: [],
    error: null,
    loading: false
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
    }))
);
