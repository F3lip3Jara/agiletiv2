import { createAction, props } from '@ngrx/store';
import { Empresa } from '../interface/empresa.interface';

export const getEmpresaRequest = createAction(
    '[Empresa] Get Empresa Request'
);

export const getEmpresaSuccess = createAction(
    '[Empresa] Get Empresa Success',
    props<{ empresa: Empresa[] }>()
);

export const empresaError = createAction(
    '[Empresa] Empresa Error',
    props<{ error: string }>()
);

export const createEmpresaRequest = createAction(
    '[Empresa] Create Empresa Request',
    props<{ empresa: Empresa }>()
);

export const createEmpresaSuccess = createAction(
    '[Empresa] Create Empresa Success'
);

export const updateEmpresaRequest = createAction(
    '[Empresa] Update Empresa Request',
    props<{ empresa: Empresa }>()
);

export const updateEmpresaSuccess = createAction(
    '[Empresa] Update Empresa Success'
);

export const logoEmpresaRequest = createAction(
    '[Empresa] Logo Empresa Request',
    props<{ id: number }>()
);


export const logoEmpresaSuccess = createAction(
    '[Empresa] Logo Empresa Success',
    props<{ logo: any }>()
);

export const getOpcionesAsignadasRequest = createAction(
    '[Empresa] Get Opciones Asignadas Request',
    props<{ id: number }>()
);

export const getOpcionesAsignadasSuccess = createAction(
    '[Empresa] Get Opciones Asignadas Success',
    props<{ opciones: any[] }>()
);

export const getOpcionesNoAsignadasRequest = createAction(
    '[Empresa] Get Opciones No Asignadas Request',
    props<{ id: number }>()
);  

export const getOpcionesNoAsignadasSuccess = createAction(
    '[Empresa] Get Opciones No Asignadas Success',
    props<{ opciones: any[] }>()
);

export const createOpcionAsignadaRequest = createAction(
    '[Empresa] Create Opcion Asignada Request',
    props<{ empId: number, asig: any[] }>()
);

export const createOpcionAsignadaSuccess = createAction(
    '[Empresa] Create Opcion Asignada Success'
);


















