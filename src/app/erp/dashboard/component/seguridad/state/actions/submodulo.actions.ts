import { createAction, props } from '@ngrx/store';
import { SubModulo } from '../interface/submodulo.interface';

export const getSubModuloRequest = createAction(
    '[SubModulo] Get SubModulo Request',
    props<{ modulo: any }>()
);

export const getSubModuloSuccess = createAction(
    '[SubModulo] Get SubModulo Success',
    props<{ subModulo: SubModulo[] }>()
);

export const subModuloError = createAction(
    '[SubModulo] SubModulo Error',
    props<{ error: string }>()
);

export const getOpcionesNoAsignadasSubModuloByIdRequest = createAction(
    '[SubModulo] Get Opciones No Asignadas Sub Modulo Request',
    props<{ modulo: any }>()
);

export const getOpcionesNoAsignadasSubModuloByIdSuccess = createAction(
    '[SubModulo] Get Opciones No Asignadas Sub Modulo Success',
    props<{ opciones: any }>()
);

export const getOpcionesAsignadasSubModuloByIdRequest = createAction(
    '[SubModulo] Get Opciones Asignadas Sub Modulo Request',
    props<{ modulo: any , molsId : number }>()
);

export const getOpcionesAsignadasSubModuloByIdSuccess = createAction(
    '[SubModulo] Get Opciones Asignadas Sub Modulo Success',
    props<{ opciones: any  }>()
);

export const createSubModuloRequest = createAction(
    '[SubModulo] Create SubModulo Request',
    props<{ submodulo: SubModulo }>()
);

export const createSubModuloSuccess = createAction(
    '[SubModulo] Create SubModulo Success'
);

export const updateSubModuloRequest = createAction(
    '[SubModulo] Update SubModulo Request',
    props<{ submodulo: SubModulo }>()
);

export const updateSubModuloSuccess = createAction(
    '[SubModulo] Update SubModulo Success'
);


export const deleteSubModuloRequest = createAction(
    '[SubModulo] Delete SubModulo Request',
    props<{ submodulo: any }>()
);

export const deleteSubModuloSuccess = createAction(
    '[SubModulo] Delete SubModulo Success'
);







