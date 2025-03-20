import { createAction, props } from '@ngrx/store';
import { Unidad } from '../interface/unidad.interface';

export const getUnidadRequest = createAction(
    '[Unidad] Get Unidad Request'
);

export const getUnidadSuccess = createAction(
    '[Unidad] Get Unidad Success',
    props<{ unidad: Unidad[] }>()
);

export const unidadError = createAction(
    '[Unidad] Unidad Error',
    props<{ error: string }>()
);
