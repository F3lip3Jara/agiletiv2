import { createReducer, on } from '@ngrx/store';
import { Ordenes } from '../interface/ordenes.interface';
import * as OrdenesActions from '../actions/ordenes.actions';


export interface OrdenesState {
    ordenes: Ordenes[];
    error: string | null;
    loading: boolean;
    empresa: any;
    productos: any[];
    jobId: number;
    status: string;
    url: string;
    colums: any[];
}

export const initialOrdenesState: OrdenesState = {
    ordenes: [],
    error: null,
    loading: false,
    empresa: null,
    productos: [],
    jobId: 0,
    status: '',
    url: '',
    colums: []
};

export const _ordenesReducer = createReducer(
    initialOrdenesState,
    on(OrdenesActions.getOrdenesSuccess, (state, { ordenes, colums }) => ({
        ...state,
        ordenes,
        colums
    })),
    on(OrdenesActions.ordenesError, (state, { error }) => ({
        ...state,
        error
    })),
    on(OrdenesActions.checkListaStatusRequest, (state, { jobId }) => ({
        ...state,
        jobId
    })),
    on(OrdenesActions.checkListaStatusSuccess, (state, { status, url }) => ({
        ...state,
        status,
        url
    })),
    on(OrdenesActions.listaCompletadaSuccess, (state, { url }) => ({
        ...state,
        url
    }))
);
