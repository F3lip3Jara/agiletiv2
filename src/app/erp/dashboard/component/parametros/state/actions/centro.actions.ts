import { createAction, props } from '@ngrx/store';
import { Centro } from '../interface/centro.interface';

export const getCentroRequest = createAction(
    '[Centro] Get Centro Request'
);

export const getCentroSuccess = createAction(
    '[Centro] Get Centro Success',
    props<{ centro: Centro[] }>()
);

export const centroError = createAction(
    '[Centro] Centro Error',
    props<{ error: string }>()
);
