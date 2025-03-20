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
