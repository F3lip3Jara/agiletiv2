import { createAction, props } from "@ngrx/store";
import { Mensajes } from "../interface/mensajes.interface";


export const getMensajesSuccess =createAction(
   "[Mensajes] Get Mensajes Success",  // Identificador del tipo de acción
    props<{ mensaje: any}>()    // Carga útil que contiene el mensaje de error
)


export const mensajesError = createAction(
    "[Mensajes]  Mensajes Error",    // Identificador del tipo de acción
    props<{ error: string }>()    // Carga útil que contiene el mensaje de error
)


export const loadMensajeRequest = createAction(
    "[Mensajes] Load Mensaje Request",
    props<{ mensajes: Mensajes}>()
)

export const readMensajeRequest = createAction(
    "[Mensajes] Read Mensaje Request"
)

