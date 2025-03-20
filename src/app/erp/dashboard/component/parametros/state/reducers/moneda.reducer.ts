import { createReducer, on } from '@ngrx/store';
import { Moneda } from '../interface/moneda.interface';
import * as MonedaActions from '../actions/moneda.actions';
import { DataStateMoneda } from '../../../app.state';

export interface MonedaState {
    moneda: Moneda[];
    error: string | null;
    loading: boolean;
}

export const initialMonedaState: DataStateMoneda = {
    moneda: [],
    error: null,
    loading: false
};

export const _monedaReducer = createReducer(
    initialMonedaState,
    on(MonedaActions.getMonedaSuccess, (state, { moneda }) => ({
        ...state,
        moneda
    })),
    on(MonedaActions.monedaError, (state, { error }) => ({
        ...state,
        error
    }))
);
