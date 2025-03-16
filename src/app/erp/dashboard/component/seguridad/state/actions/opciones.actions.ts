import { createAction, props } from '@ngrx/store';
import { Opciones } from '../interface/opciones.interface';

export const getOpcionesRequest = createAction(
    '[Opciones] Get Opciones Request'
);

export const getOpcionesSuccess = createAction(
    '[Opciones] Get Opciones Success',
    props<{ opciones: Opciones[] }>()
);

export const opcionesError = createAction(
    '[Opciones] Opciones Error',
    props<{ error: string }>()
);

export const updateOpcionesRequest = createAction(
    '[Opciones] Update Opciones Request',
    props<{ opciones: any }>()
);

export const updateOpcionesSuccess = createAction(
    '[Opciones] Update Opciones Success'
);

export const insertOpcionesRequest = createAction(
    '[Opciones] Insert Opciones Request',
    props<{ opciones: any }>()
);  

export const insertOpcionesSuccess = createAction(
    '[Opciones] Insert Opciones Success'
);

export const deleteOpcionesRequest = createAction(
    '[Opciones] Delete Opciones Request',
    props<{ opciones: any }>()
);

export const deleteOpcionesSuccess = createAction(
    '[Opciones] Delete Opciones Success'
);







