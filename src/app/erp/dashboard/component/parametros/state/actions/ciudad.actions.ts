import { createAction, props } from '@ngrx/store';
import { Ciudad } from '../interface/ciudad.interface';

export const getCiudadRequest = createAction(
    '[Ciudad] Get Ciudad Request'
);

export const getCiudadSuccess = createAction(
    '[Ciudad] Get Ciudad Success',
    props<{ ciudad: Ciudad[] }>()
);

export const ciudadError = createAction(
    '[Ciudad] Ciudad Error',
    props<{ error: string }>()
);
