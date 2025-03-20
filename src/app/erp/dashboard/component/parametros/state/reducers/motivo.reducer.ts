import { createReducer, on } from '@ngrx/store';
import { Motivo } from '../interface/motivo.interface';
import * as MotivoActions from '../actions/motivo.actions';
import { DataStateMotivo } from '../../../app.state';

export interface MotivoState {
    motivo: Motivo[];
    error: string | null;
}

export const initialMotivoState: DataStateMotivo = {
    motivo: [],
    error: null
};

export const _motivoReducer = createReducer(
    initialMotivoState,
    on(MotivoActions.getMotivoSuccess, (state, { motivo }) => ({
        ...state,
        motivo
    })),
    on(MotivoActions.motivoError, (state, { error }) => ({
        ...state,
        error
    }))
);
