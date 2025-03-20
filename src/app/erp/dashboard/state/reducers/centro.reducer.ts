import { createReducer, on } from '@ngrx/store';
import { Centro } from '../../component/parametros/centro/interface/centro.interface';
import * as CentroActions from '../actions/centro.actions';

export interface CentroState {
    centros: Centro[];
    loading: boolean;
    error: any;
}

export const initialState: CentroState = {
    centros: [],
    loading: false,
    error: null
};

export const centroReducer = createReducer(
    initialState,
    on(CentroActions.createCentroRequest, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(CentroActions.createCentroSuccess, (state, { centro }) => ({
        ...state,
        centros: [...state.centros, centro],
        loading: false
    })),
    on(CentroActions.CentroError, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(CentroActions.getCentroRequest, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(CentroActions.getCentroSuccess, (state, { centros }) => ({
        ...state,
        centros,
        loading: false
    })),
    on(CentroActions.updateCentroRequest, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(CentroActions.updateCentroSuccess, (state, { centro }) => ({
        ...state,
        centros: state.centros.map(c => c.centroId === centro.centroId ? centro : c),
        loading: false
    })),
    on(CentroActions.deleteCentroRequest, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(CentroActions.deleteCentroSuccess, (state, { centroId }) => ({
        ...state,
        centros: state.centros.filter(c => c.centroId !== centroId),
        loading: false
    }))
); 