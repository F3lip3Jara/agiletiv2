import { createReducer, on } from "@ngrx/store";
import { DataStateMensajes } from "../../app.state";
import { getMensajesSuccess, loadMensajeRequest, readMensajeRequest } from "../actions/mensajes.actions";


export const initialState: DataStateMensajes = {
    mensajes: []
};

export const _mensajeReducer = createReducer(
    initialState,      
   
    on(loadMensajeRequest, ( state,{ mensajes} : any) => ({
        ...state,
        mensajes: [...state.mensajes, mensajes]
    })),

    on(readMensajeRequest, (state) => ({
        ...state,
        mensajes: state.mensajes.map((mensaje: any) => ({
            ...mensaje,
            read: true
        }))
    }))

)