import { createReducer, on } from '@ngrx/store';
import { Clase } from '../interface/clase.interface';
import * as ClaseActions from '../actions/clase.actions';
import { DataStateClase } from '../../../app.state';

export interface ClaseState {
    clase: Clase[];
    error: string | null;
    loading: boolean;
}

export const initialClaseState: DataStateClase = {
    clase: [],
    error: null,
    loading: false
};

export const _claseReducer = createReducer(
    initialClaseState,
    on(ClaseActions.getClaseSuccess, (state, { clase }) => ({
        ...state,
        clase
    })),
    on(ClaseActions.claseError, (state, { error }) => ({
        ...state,
        error
    }))
);
