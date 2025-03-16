import { createReducer, on } from '@ngrx/store';
import { SubModulo } from '../interface/subModulo.interface';
import * as SubModuloActions from '../actions/subModulo.actions';
import { DataStateSubModulo } from '../../../app.state';

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
    on(SubModuloActions.getSubModuloSuccess, (state, { subModulo }) => ({
        ...state,
        subModulo
    })),
    on(SubModuloActions.subModuloError, (state, { error }) => ({
        ...state,
        error
    }))
);
