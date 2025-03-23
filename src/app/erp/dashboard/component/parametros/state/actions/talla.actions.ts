import { createAction, props } from '@ngrx/store';
import { Talla } from '../interface/talla.interface';

export const getTallaRequest = createAction(
    '[Talla] Get Talla Request'
);

export const getTallaSuccess = createAction(
    '[Talla] Get Talla Success',
    props<{ talla: Talla[] }>()
);

export const tallaError = createAction(
    '[Talla] Talla Error',
    props<{ error: string }>()
);

export const insTallaRequest = createAction(
    '[Talla] Ins Talla Request',
    props<{ talla: Talla }>()
);


export const insTallaSuccess = createAction(
    '[Talla] Ins Talla Success'
);

export const upTallaRequest = createAction(
    '[Talla] Up Talla Request',
    props<{ talla: Talla }>()
);  

export const upTallaSuccess = createAction(
    '[Talla] Up Talla Success'
);







