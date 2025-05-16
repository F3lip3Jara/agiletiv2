import { createReducer, on } from '@ngrx/store';
import { Pedidonac } from '../interface/pedidonac.interface';
import * as PedidonacActions from '../actions/pedidonac.actions';
import { DataStatePedidonac } from '../../../app.state';

export interface PedidonacState {
    pedidonac: Pedidonac[];
    error: string | null;
    loading: boolean;
    empresa: any;
    productos: any[];
    colums: any[];
}

export const initialPedidonacState: DataStatePedidonac = {
    pedidonac: [],
    error: null,
    loading: false,
    empresa: null,
    productos: [],
    colums: []
};

export const _pedidonacReducer = createReducer(
    initialPedidonacState,
    on(PedidonacActions.getPedidonacSuccess, (state, { pedidonac, colums }) => ({
        ...state,
        pedidonac,
        colums
    })),
    on(PedidonacActions.pedidonacError, (state, { error }) => ({
        ...state,
        error
    })),
    on(PedidonacActions.getEmpresaPdfSuccess, (state, { empresa }) => ({
        ...state,
        empresa : empresa
    })),
    on(PedidonacActions.getPedidoProductosSuccess, (state, { productos }) => ({
        ...state,
        productos : productos
    }))
);
