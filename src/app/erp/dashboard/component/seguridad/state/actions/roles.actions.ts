import { createAction, props } from "@ngrx/store";
import { Roles } from "../interface/roles.interface";

// Acción para iniciar la obtención de todos los elementos de Usuarios
export const getRolesRequest = createAction(
    "[Roles] Get Roles Request"  // Identificador del tipo de acción
);

// Acción para indicar la obtención exitosa de todos los elementos de Usuarios
export const getRolesSuccess = createAction(
    "[Roles] Get Roles Success",  // Identificador del tipo de acción
    props<{ roles:Roles[] }>()    // Carga útil que contiene el mensaje de error
 
)

export const rolesError = createAction(
    "[Roles] Get Roles Error",    // Identificador del tipo de acción
    props<{ error: string }>()    // Carga útil que contiene el mensaje de error
)

export const createRolesSuccess = createAction(
    "[Roles] Create Roles Request"
)

export const createRolesRequest = createAction(
    "[Roles] Create Roles Request",
    props<{ rolDes: string }>()      // Identificador del tipo de acción
   // Carga útil que contiene el mensaje de error
)

export const updateRolesRequest = createAction(
    "[Roles] Update Roles Request",
    props<{ roles:any }>()      // Identificador del tipo de acción
   // Carga útil que contiene el mensaje de error
)

export const updateRolesSuccess = createAction(
    "[Roles] Update Roles Success"
)

export const deleteRolesRequest = createAction(
    "[Roles] Delete Roles Request",
    props<{ roles:any }>()      // Identificador del tipo de acción
   // Carga útil que contiene el mensaje de error
)   

export const deleteRolesSuccess = createAction(
    "[Roles] Delete Roles Success"
)   












