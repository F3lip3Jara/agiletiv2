import { createAction, props } from '@ngrx/store';
import { Proveedor } from '../interface/proveedor.interface';
import { Region } from '../interface/region.interface';
import { Ciudad } from '../interface/ciudad.interface';
import { Pais } from '../interface/pais.interface';

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

export const validaProveedorRequest = createAction(
    '[Proveedor] Validación de proveedor',
    props<{ proveedor: Proveedor }>()
);

export const validaProveedorSuccess = createAction(
    '[Proveedor] Validación de proveedor exitosa',
    props<{ proveedor: any }>()
);

export const insProveedorRequest = createAction(
    '[Proveedor] Insertar proveedor',
    props<{ proveedor: Proveedor }>()
);  

export const insProveedorSuccess = createAction(
    '[Proveedor] Insertar proveedor exitosa'
);

export const updateProveedorRequest = createAction(
    '[Proveedor] Actualizar proveedor',
    props<{ proveedor: Proveedor }>()
);  

export const updateProveedorSuccess = createAction(
    '[Proveedor] Actualizar proveedor exitosa'
);





