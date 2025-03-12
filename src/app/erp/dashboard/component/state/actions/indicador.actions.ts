import { createAction, props } from "@ngrx/store";


export const getIndicadorRequest = createAction(
    "[Indicador] Get Indicador Request"
)

export const getIndicadorSuccess =createAction(
   "[Indicador] Get Indicador Success",  // Identificador del tipo de acción
    props<{ indicadores: any[]}>()    // Carga útil que contiene el mensaje de error
)


export const indicadorError = createAction(
    "[Indicador]  Indicador Error",    // Identificador del tipo de acción
    props<{ error: string }>()    // Carga útil que contiene el mensaje de error
)
