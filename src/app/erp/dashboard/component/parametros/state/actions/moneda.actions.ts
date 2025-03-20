import { createAction, props } from '@ngrx/store';
import { Moneda } from '../interface/moneda.interface';

export const getMonedaRequest = createAction(
    '[Moneda] Get Moneda Request'
);

export const getMonedaSuccess = createAction(
    '[Moneda] Get Moneda Success',
    props<{ moneda: Moneda[] }>()
);

export const monedaError = createAction(
    '[Moneda] Moneda Error',
    props<{ error: string }>()
);
