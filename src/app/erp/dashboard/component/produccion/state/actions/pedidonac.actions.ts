import { createAction, props } from '@ngrx/store';
import { Pedidonac } from '../interface/pedidonac.interface';

export const getPedidonacRequest = createAction(
    '[Pedidonac] Get Pedidonac Request'
);

export const getPedidonacSuccess = createAction(
    '[Pedidonac] Get Pedidonac Success',
    props<{ pedidonac: Pedidonac[] }>()
);

export const pedidonacError = createAction(
    '[Pedidonac] Pedidonac Error',
    props<{ error: string }>()
);

export const createPedidonacRequest = createAction(
    '[Pedidonac] Create Pedidonac Request',
    props<{ pedidonac: any }>()
);

export const createPedidonacSuccess =  createAction(
    '[Pedidonac] Create Pedidonac Success'
);

export const updatePedidonacRequest = createAction(
    '[Pedidonac] Update Pedidonac Request',
    props<{ pedidonac: any }>()
);

export const updatePedidonacSuccess = createAction(
    '[Pedidonac] Update Pedidonac Success'
);
export const getEmpresaPdfRequest = createAction(
    '[Pedidonac] Obtener empresa para PDF',
);

export const getEmpresaPdfSuccess = createAction(
    '[Pedidonac] Obtener empresa para PDF exitosa',
    props<{ empresa: any }>()
);

export const getPedidoProductosRequest = createAction(
    '[Pedidonac] Obtener pedido productos',
    props<{ pedido: any }>()
);

export const getPedidoProductosSuccess = createAction(
    '[Pedidonac] Obtener pedido productos exitosa',
    props<{ productos: any }>()
);


export const recepcionarPedidoRequest = createAction(
    '[Pedidonac] Recepcionar pedido',
    props<{ pedido: any }>()
);

export const recepcionarPedidoSuccess = createAction(
    '[Pedidonac] Recepcionar pedido exitosa'
);

