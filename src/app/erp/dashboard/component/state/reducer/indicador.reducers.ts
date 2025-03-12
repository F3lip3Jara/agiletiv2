import { createReducer, on } from "@ngrx/store";
import {  DataStateIndicadores } from "../../app.state";
import { getIndicadorRequest, getIndicadorSuccess, indicadorError , } from "../actions/indicador.actions";


export const initialState: DataStateIndicadores = {
    indicadores: [],
    loading: false,
    error: null
};

export const _indicadoresReducer = createReducer(
    initialState,      
    on(getIndicadorRequest, (state) => ({
        ...state, // Se regresa el mismo estado
    })),

    on(getIndicadorSuccess, (state, { indicadores }) => ({
        ...state, // Se regresa el mismo estado
        indicadores, // Se actualiza el estado con los Roles obtenidos
        })),
    on(indicadorError, (state, { error }) => ({
            ...state, // Se regresa el mismo estado
            error, // Se actualiza el estado con el error
             }))    
)

