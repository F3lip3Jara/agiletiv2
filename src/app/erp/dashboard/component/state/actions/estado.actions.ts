import { createAction, props } from "@ngrx/store"
import { Estado } from "../interface/estado.interface"

export const setEstadoLoading =createAction(
    "[Estado] Set Estado Loadng",  // Identificador del tipo de acción
     props<{ estado: Estado}>()    // Carga útil que contiene el mensaje de error
 )
 
 
 export const estadoError = createAction(
     "[Estado]  Estado Error",    // Identificador del tipo de acción
     props<{ error: string }>()    // Carga útil que contiene el mensaje de error
 )

 export const incrementarRequest = createAction('[Estado] Incrementar Request',
                                                 props<{ request: number }>());

 export const decrementarRequest = createAction('[Estado] Decrementar Request');

export const setAltura           = createAction('[Estado] Set Altura',
                                        props<{ altura: number }>());
 
