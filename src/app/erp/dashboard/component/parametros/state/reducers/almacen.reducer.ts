import { createReducer, on } from '@ngrx/store';
import { Almacen } from '../interface/almacen.interface';
import * as AlmacenActions from '../actions/almacen.actions';
import { DataStateAlmacen } from '../../../app.state';

export interface AlmacenState {
    almacen: Almacen[];
    error: string | null;
    loading: boolean;
}

export const initialAlmacenState: DataStateAlmacen = {
    almacen: [],
    error: null,
    loading: false
};

export const _almacenReducer = createReducer(
    initialAlmacenState,
    on(AlmacenActions.getAlmacenSuccess, (state, { almacen }) => ({
        ...state,
        almacen
    })),
    on(AlmacenActions.almacenError, (state, { error }) => ({
        ...state,
        error
    }))
);
