import { createReducer, on } from "@ngrx/store";
import { createUsuarioSuccess, dataUsuarioRequest, dataUsuarioSuccess, desactivarUsuarioRequest, desactivarUsuarioSuccess, getUsuariosRequest , getUsuariosSuccess, usuariosError} from "../actions/usuarios.actions";
import { DataStateUsuarios } from "../../../app.state";

export const initialState: DataStateUsuarios = {
    usuarios: [],
    avatar: [],
    error: '',
    loading: false
};

export const _usuarioReducer = createReducer(
    initialState,    
    on(getUsuariosRequest, (state) => ({
        ...state, // Se regresa el mismo estado
        loading: true // Se cambia el estado para indicar que se están cargando los TODOS desde la API
    })),

    on(getUsuariosSuccess, (state, { usuarios }) => ({
        ...state, // Se regresa el mismo estado
        usuarios,
        loading: false // Se actualiza el estado con los TODOS obtenidos
      })),

    on(createUsuarioSuccess, (state, { usuario }) => ({
        ...state, // Se regresa el mismo estado
        usuario,
         // Se actualiza el estado con el usuario creado
      })),

    on(dataUsuarioRequest, (state) => ({
        ...state, // Se regresa el mismo estado
      })),
      
    on(dataUsuarioSuccess, (state, { avatar }) => ({
        ...state,
        avatar, // Se actualiza el estado con el usuario creado
      })),

      on(desactivarUsuarioRequest, (state, {usuario}) => ({
        ...state,
        usuario,
        loading: true
      })),
    on(desactivarUsuarioSuccess, (state, ) => ({
        ...state,
        loading: false
      })),
    on(usuariosError, (state, { error }) => ({
        ...state, // Se regresa el mismo estado
        error, // Se actualiza el estado con el error
      })),
   
)