import { createReducer, on } from '@ngrx/store';
import { SubModulo } from '../interface/submodulo.interface';
import { DataStateSubModulo } from '../../../app.state';
import { subModuloError } from  '../actions/submodulo.actions';
import { getSubModuloSuccess } from '../actions/submodulo.actions';

export interface SubModuloState {
    subModulo: SubModulo[];
    error: string | null;
    loading: boolean;
}

export const initialSubModuloState: DataStateSubModulo = {
    subModulo: [],
    error: null,
    loading: false
};

export const _subModuloReducer = createReducer(
    initialSubModuloState,
    on(getSubModuloSuccess, (state, { subModulo }) => ({
        ...state,
        subModulo
    })),
    on(subModuloError, (state, { error }) => ({
        ...state,
        error
    }))
);
