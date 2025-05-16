import { createAction, props } from '@ngrx/store';


export const getSeguridadRequest = createAction(
    '[Seguridad] Get Seguridad Request'
);

export const getSeguridadSuccess = createAction(
    '[Seguridad] Get Seguridad Success',
    props<{ seguridad: any }>()
);

export const seguridadError = createAction(
    '[Seguridad] Seguridad Error',
    props<{ error: string }>()
);
