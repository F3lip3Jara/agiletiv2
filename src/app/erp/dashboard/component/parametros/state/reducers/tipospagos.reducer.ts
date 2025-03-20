import { createReducer, on } from '@ngrx/store';
import { Tipospagos } from '../interface/tipospagos.interface';
import * as TipospagosActions from '../actions/tipospagos.actions';
import { DataStateTipoPagos } from '../../../app.state';

export interface TipospagosState {
    tipospagos: Tipospagos[];
    error: string | null;
    loading: boolean;
}

export const initialTipospagosState: DataStateTipoPagos = {
    tipospagos: [],
    error: null,
    loading: false
};

export const _tipospagosReducer = createReducer(
    initialTipospagosState,
    on(TipospagosActions.getTipospagosSuccess, (state, { tipospagos }) => ({
        ...state,
        tipospagos
    })),
    on(TipospagosActions.tipospagosError, (state, { error }) => ({
        ...state,
        error
    }))
);
