import { ActionReducerMap  } from "@ngrx/store";
import { _usuarioReducer } from "./seguridad/state/reducers/usuarios.reducers";
import { _rolesReducer } from "./seguridad/state/reducers/roles.reducers";
import { _productoReducer } from "./parametros/state/reducers/producto.reducers";
import { _mensajeReducer } from "./state/reducer/mensaje.reducers";
import { _estadoReducer } from "./state/reducer/estado.reducers";
import { Estado } from "./state/interface/estado.interface";
import { _opcionesReducer } from "./seguridad/state/reducers/opciones.reducer";
import { _accionesReducer } from "./seguridad/state/reducers/acciones.reducer";
import { _indicadoresReducer } from "./state/reducer/indicador.reducers";

export interface AppState {
    usuarios    : DataStateUsuarios,
    productos   : DataStateProductos,
    roles       : DataStateRoles,
    mensajes    : DataStateMensajes,
    estado      : DataStateEstado,
    opciones    : DataStateOpciones,   
    acciones    : DataStateAcciones,
    indicadores : DataStateIndicadores
}

export interface DataStateUsuarios {
    usuarios: any[],
    avatar: any[],
    loading: boolean,
    error?: string
}

export interface DataStateProductos {
    productos: any[],
    error?: string
}

export interface DataStateRoles {
    roles: any[],
    error?: string,
    loading: boolean,
}


export interface DataStateMensajes {
    mensajes: any[],
}


export interface DataStateEstado {
    estado: Estado;
}

export interface DataStateOpciones {
    opciones: any[],
    error?: string,
    loading: boolean,
}

export interface DataStateAcciones {
    acciones: any[],
    error?: string,
    loading: boolean,
}

export interface DataStateIndicadores {
    indicadores: any[],
    error?: string,
    loading: boolean,
}

export const ROOT_APP_REDUCER: ActionReducerMap<AppState> = {
    usuarios : _usuarioReducer, 
    productos:_productoReducer,
    roles    :_rolesReducer,
    mensajes : _mensajeReducer,
    estado   : _estadoReducer,
    opciones : _opcionesReducer,
    acciones : _accionesReducer,
    indicadores : _indicadoresReducer
  };