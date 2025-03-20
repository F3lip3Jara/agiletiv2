import { createReducer, on } from '@ngrx/store';
import { Centro } from '../interface/centro.interface';
import * as CentroActions from '../actions/centro.actions';
import { DataStateCentro } from '../../../app.state';

export interface CentroState {
    centro: Centro[];
    error: string | null;
    loading: boolean;
}

export const initialCentroState: DataStateCentro = {
    centro: [],
    error: null,
    loading: false
};

export const _centroReducer = createReducer(
    initialCentroState,
    on(CentroActions.getCentroSuccess, (state, { centro }) => ({
        ...state,
        centro
    })),
    on(CentroActions.centroError, (state, { error }) => ({
        ...state,
        error
    }))
);
