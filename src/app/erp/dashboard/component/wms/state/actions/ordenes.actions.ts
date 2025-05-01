import { createAction, props } from '@ngrx/store';
import { Ordenes } from '../interface/ordenes.interface';

export const getOrdenesRequest = createAction(
    '[Ordenes] Get Ordenes Request'
);

export const getOrdenesSuccess = createAction(
    '[Ordenes] Get Ordenes Success',
    props<{ ordenes: Ordenes[] }>()
);

export const ordenesError = createAction(
    '[Ordenes] Ordenes Error',
    props<{ error: string }>()
);


export const getOrdenEntradaDetalleRequest = createAction(
    '[Ordenes] Get Orden Entrada Detalle Request',
    props<{ orden: Ordenes }>()
);

export const getOrdenEntradaDetalleSuccess = createAction(
    '[Ordenes] Get Orden Entrada Detalle Success',
    props<{ ordenDetalle: any }>()
);

export const generarListaRequest = createAction(
    '[Ordenes] Generar Lista Request',
    props<{ ordenIds: number[] }>()
);

export const generarListaSuccess = createAction(
    '[Ordenes] Generar Lista Success'
);

export const checkListaStatusRequest = createAction(
    '[Ordenes] Check Lista Status Request',
    props<{ jobId: number }>()
);

export const checkListaStatusSuccess = createAction(
    '[Ordenes] Check Lista Status Success',
    props<{ status: string; url?: string }>()
);

export const listaCompletadaSuccess = createAction(
    '[Ordenes] Lista Completada Success',
    props<{ url: string }>()
);

export const liberarOrdenesRequest = createAction(
    '[Ordenes] Liberar Ordenes Request',
    props<{ ordenIds: number[] }>()
);

export const liberarOrdenesSuccess = createAction(
    '[Ordenes] Liberar Ordenes Success'
);








