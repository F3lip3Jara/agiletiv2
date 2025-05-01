import { createReducer, on } from '@ngrx/store';
import { Ciudad } from '../interface/ciudad.interface';
import * as CiudadActions from '../actions/ciudad.actions';
import { DataStateCiudad } from '../../../app.state';

export interface CiudadState {
    ciudad: Ciudad[];
    error: string | null;
    loading: boolean;
}

export const initialCiudadState: DataStateCiudad = {
    ciudad: [],
    error: null,
    loading: false
};

export const _ciudadReducer = createReducer(
    initialCiudadState,
    on(CiudadActions.getCiudadSuccess, (state, { ciudad }) => ({
        ...state,
        ciudad
    })),
    on(CiudadActions.ciudadError, (state, { error }) => ({
        ...state,
        error
    })),
    on(CiudadActions.getCiudadByRegionSuccess, (state, { ciudad }) => ({
        ...state,
        ciudad
    }))
);
