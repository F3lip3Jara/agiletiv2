import { createAction, props } from '@ngrx/store';
import { Pais } from '../interface/pais.interface';

export const getPaisRequest = createAction(
    '[Pais] Get Pais Request'
);

export const getPaisSuccess = createAction(
    '[Pais] Get Pais Success',
    props<{ pais: Pais[] }>()
);

export const paisError = createAction(
    '[Pais] Pais Error',
    props<{ error: string }>()
);
