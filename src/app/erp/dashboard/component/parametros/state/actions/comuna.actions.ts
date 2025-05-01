import { createAction, props } from '@ngrx/store';
import { Comuna } from '../interface/comuna.interface';

export const getComunaRequest = createAction(
    '[Comuna] Get Comuna Request'
);

export const getComunaSuccess = createAction(
    '[Comuna] Get Comuna Success',
    props<{ comuna: Comuna[] }>()
);

export const comunaError = createAction(
    '[Comuna] Comuna Error',
    props<{ error: string }>()
);

export const getComunaByCiudadRequest = createAction(
    '[Comuna] Get Comuna By Ciudad Request',
    props<{ ciudad: any ,  region: any , pais: any }>()
);

export const getComunaByCiudadSuccess = createAction(
    '[Comuna] Get Comuna By Ciudad Success',
    props<{ comuna: Comuna[] }>()
);




