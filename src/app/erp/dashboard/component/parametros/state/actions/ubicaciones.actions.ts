import { createAction, props } from '@ngrx/store';
import { Ubicaciones } from '../interface/ubicaciones.interface';

export const getUbicacionesRequest = createAction(
    '[Ubicaciones] Get Ubicaciones Request',
    props<{ sectorId: any }>()
);

export const getUbicacionesSuccess = createAction(
    '[Ubicaciones] Get Ubicaciones Success',
    props<{ ubicaciones: any[] }>()
);

export const ubicacionesError = createAction(
    '[Ubicaciones] Ubicaciones Error',
    props<{ error: string }>()
);

export const createUbicacionesRequest = createAction(
    '[Ubicaciones] Create Ubicaciones Request',
    props<{ datos: any }>()
);

export const createUbicacionesSuccess = createAction(
    '[Ubicaciones] Create Ubicaciones Success'
);