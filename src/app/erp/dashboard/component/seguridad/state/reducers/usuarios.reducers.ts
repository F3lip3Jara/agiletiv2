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

    on(getUsuariosSuccess, (state, { usuarios }) => ({
        ...state, // Se regresa el mismo estado
        usuarios,
        loading: false // Se actualiza el estado con los TODOS obtenidos
      })),
     
      
    on(dataUsuarioSuccess, (state, { avatar }) => ({
        ...state,
        avatar, // Se actualiza el estado con el usuario creado
      })),

     
    on(usuariosError, (state, { error }) => ({
        ...state, // Se regresa el mismo estado
        error, // Se actualiza el estado con el error
      })),
   
)