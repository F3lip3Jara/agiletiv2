import { createAction, props } from '@ngrx/store';
import { Proveedor } from '../interface/proveedor.interface';

export const getProveedorRequest = createAction(
    '[Proveedor] Get Proveedor Request'
);

export const getProveedorSuccess = createAction(
    '[Proveedor] Get Proveedor Success',
    props<{ proveedor: Proveedor[] }>()
);

export const proveedorError = createAction(
    '[Proveedor] Proveedor Error',
    props<{ error: string }>()
);
