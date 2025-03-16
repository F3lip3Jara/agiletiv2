import { createAction, props } from "@ngrx/store";
import { CreateUsuario, Usuario  , UpdateUsuario, getUsuario} from "../interface/usuarios.interface";


// Acción para iniciar la obtención de todos los elementos de Usuarios
export const getUsuariosRequest = createAction(
    "[Usuarios] Get Usuarios Request"  // Identificador del tipo de acción
);

// Acción para indicar la obtención exitosa de todos los elementos de Usuarios
export const getUsuariosSuccess = createAction(
    "[Usuarios] Get Usuarios Success",  // Identificador del tipo de acción
    props<{ usuarios: Usuario[] }>()    // Carga útil que contiene el mensaje de error
)

export const usuariosError = createAction(
    "[Usuarios] Get Usuarios Error",    // Identificador del tipo de acción
    props<{ error: string }>()    // Carga útil que contiene el mensaje de error
)

// Acción para iniciar la creación de un nuevo elemento usuario
export const createUsuarioRequest = createAction(
    "[Usuarios] Create Usuarios Request",  // Identificador del tipo de acción
    props<{ usuario: CreateUsuario }>()   // Carga útil que contiene los datos necesarios para crear un nuevo usuario
)

// Acción para indicar la creación exitosa de un nuevo elemento usuario    
export const createUsuarioSuccess = createAction(
    "[Usuarios] Create Usuarios Success"
)


// Acción para iniciar la actualización de un nuevo elemento usuario
export const updateUsuarioRequest = createAction(
    "[Usuarios] Update Usuarios Request",  // Identificador del tipo de acción
    props<{ usuario: UpdateUsuario }>()   // Carga útil que contiene los datos necesarios para crear un nuevo usuario
)

// Acción para indicar la creación exitosa de un nuevo elemento usuario    
export const updateUsuarioSuccess = createAction(
    "[Usuarios] Update Usuarios Success"    // Carga útil que contiene el usuario creado
)


// Acción para iniciar la actualización de un nuevo elemento usuario
export const dataUsuarioRequest = createAction(
    "[Usuarios] Datos Usuarios Request",  // Identificador del tipo de acción
    props<{ usuario: getUsuario }>()   // Carga útil que contiene los datos necesarios para crear un nuevo usuario
)

// Acción para indicar la creación exitosa de un nuevo elemento usuario    
export const dataUsuarioSuccess = createAction(
    "[Usuarios] Datos Usuarios Success",  // Identificador del tipo de acción
    props<{ avatar: getUsuario[] }>()         // Carga útil que contiene el usuario creado
)

export const desactivarUsuarioRequest = createAction(
    "[Usuarios] Desactivar Usuario Request",  // Identificador del tipo de acción
    props<{usuario: any }>()   // Carga útil que contiene el id del usuario a desactivar
)

export const desactivarUsuarioSuccess = createAction(
    "[Usuarios] Desactivar Usuario Success"
)

export const reiniciarUsuarioRequest = createAction(
    "[Usuarios] Reiniciar Usuario Request",  // Identificador del tipo de acción
    props<{usuario: any }>()   // Carga útil que contiene el id del usuario a desactivar
)
export const reiniciarUsuarioSuccess = createAction(
    "[Usuarios] Reiniciar Usuario Success"
)



