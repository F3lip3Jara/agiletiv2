import { createAction, props } from '@ngrx/store';
import { Acciones } from '../interface/acciones.interface';

export const getAccionesRequest = createAction(
    '[Acciones] Get Acciones Request',
    props<{ optId: number }>()
);

export const getAccionesSuccess = createAction(
    '[Acciones] Get Acciones Success',
    props<{ acciones: Acciones[] }>()
);

export const accionesError = createAction(
    '[Acciones] Acciones Error',
    props<{ error: string }>()
);

export const accionesInsertRequest = createAction(
    '[Acciones] Ins Acciones Request',
    props<{ acciones: any }>()
);

export const accionesInsertSuccess = createAction(
    '[Acciones] Ins Acciones Success'
);  

export const accionesUpdateRequest = createAction(
    '[Acciones] Up Acciones Request',
    props<{ acciones: any }>()
);

export const accionesUpdateSuccess = createAction(
    '[Acciones] Up Acciones Success'
);  

export const accionesDeleteRequest = createAction(
    '[Acciones] Del Acciones Request',
    props<{ acciones: any }>()
);  

export const accionesDeleteSuccess = createAction(
    '[Acciones] Del Acciones Success'
);    







