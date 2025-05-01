import { createAction, props } from '@ngrx/store';
import { Almacen } from '../interface/almacen.interface';

export const getAlmacenRequest = createAction(
    '[Almacen] Get Almacen Request',
    props<{ centro: any }>()
);

export const getAlmacenSuccess = createAction(
    '[Almacen] Get Almacen Success',
    props<{ almacen: Almacen[] }>()
);

export const almacenError = createAction(
    '[Almacen] Almacen Error',
    props<{ error: string }>()
);

export const createAlmacenRequest = createAction(
    '[Almacen] Create Almacen Request',
    props<{ almacen: Almacen }>()
);

export const createAlmacenSuccess = createAction(
    '[Almacen] Create Almacen Success'
);

export const updateAlmacenRequest = createAction(
    '[Almacen] Update Almacen Request',
    props<{ almacen: Almacen }>()
);

export const updateAlmacenSuccess = createAction(
    '[Almacen] Update Almacen Success'
);





