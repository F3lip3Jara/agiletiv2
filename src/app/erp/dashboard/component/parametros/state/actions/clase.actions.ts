import { createAction, props } from '@ngrx/store';
import { Clase } from '../interface/clase.interface';

export const getClaseRequest = createAction(
    '[Clase] Get Clase Request'
);

export const getClaseSuccess = createAction(
    '[Clase] Get Clase Success',
    props<{ clase: Clase[] }>()
);

export const claseError = createAction(
    '[Clase] Clase Error',
    props<{ error: string }>()
);
