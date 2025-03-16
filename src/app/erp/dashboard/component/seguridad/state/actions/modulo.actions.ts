import { createAction, props } from '@ngrx/store';
import { Modulo } from '../interface/modulo.interface';

export const getModuloRequest = createAction(
    '[Modulo] Get Modulo Request'
);

export const getModuloSuccess = createAction(
    '[Modulo] Get Modulo Success',
    props<{ modulo: Modulo[] }>()
);

export const moduloError = createAction(
    '[Modulo] Modulo Error',
    props<{ error: string }>()
);

export const getOpcionesModuloByIdRequest = createAction(
    '[Modulo] Get Opciones Modulo  Request',
    props<{ id: number }>()
);

export const getOpcionesModuloByIdSuccess = createAction(
    '[Modulo] Get Opciones Modulo Success',
    props<{ opciones: any }>()
);

export const getModuloRolByIdRequest = createAction(
    '[Modulo] Get Modulo Rol Request',
    props<{ id: number }>()
);


export const getModuloRolByIdSuccess = createAction(
    '[Modulo] Get Modulo Rol Success',
    props<{ roles: any }>()
);



export const getOpcionesNoAsignadasModuloByIdRequest = createAction(
    '[Modulo] Get Opciones No Asignadas Modulo Request',
    props<{ id: number }>()
);

export const getOpcionesNoAsignadasModuloByIdSuccess = createAction(
    '[Modulo] Get Opciones No Asignadas Modulo Success',
    props<{ opciones: any }>()
);

export const getRolesNoAsignadasModuloByIdRequest = createAction(
    '[Modulo] Get Roles No Asignadas Modulo Request',
    props<{ id: number }>()
);


export const getRolesNoAsignadasModuloByIdSuccess = createAction(
    '[Modulo] Get Roles No Asignadas Modulo Success',
    props<{ roles: any }>()
);

export const createModuloRequest = createAction(
    '[Modulo] Create Modulo Request',
    props<{modulo : any}>()
);

export const createModuloSuccess = createAction(
    '[Modulo] Create Modulo Success',
   
);

export const updateModuloRequest = createAction(
    '[Modulo] Update Modulo Request',
    props<{modulo : any}>()
);

export const updateModuloSuccess = createAction(
    '[Modulo] Update Modulo Success'
);

export const deleteModuloRequest = createAction(
    '[Modulo] Delete Modulo Request',
    props<{modulo : any}>()
);

export const deleteModuloSuccess = createAction(
    '[Modulo] Delete Modulo Success'
);









