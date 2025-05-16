import { createAction, props } from '@ngrx/store';


export const getParametrosRequest = createAction(
    '[Parametros] Get Parametros Request'
);

export const getParametrosSuccess = createAction(
    '[Parametros] Get Parametros Success',
    props<{ parametros: any[] }>()
);

export const parametrosError = createAction(
    '[Parametros] Parametros Error',
    props<{ error: string }>()
);
