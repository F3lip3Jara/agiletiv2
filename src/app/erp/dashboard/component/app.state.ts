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
import { _empresaReducer } from "./seguridad/state/reducers/empresa.reducer";
import { _moduloReducer } from "./seguridad/state/reducers/modulo.reducer";
import { _subModuloReducer } from "./seguridad/state/reducers/submodulo.reducer";
import { _monedaReducer } from "./parametros/state/reducers/moneda.reducer";
import { _ciudadReducer } from "./parametros/state/reducers/ciudad.reducer";
import { _regionReducer } from "./parametros/state/reducers/region.reducer";
import { _centroReducer } from "./parametros/state/reducers/centro.reducer";
import { _grupoReducer } from "./parametros/state/reducers/grupo.reducer";
import { _subgrupoReducer } from "./parametros/state/reducers/subgrupo.reducer";
import { _colorReducer } from "./parametros/state/reducers/color.reducer";
import { _paisReducer } from "./parametros/state/reducers/pais.reducer";
import { _comunaReducer } from "./parametros/state/reducers/comuna.reducer";
import { _unidadReducer } from "./parametros/state/reducers/unidad.reducer";
import { _claseReducer } from "./parametros/state/reducers/clase.reducer";
import { _tipospagosReducer } from "./parametros/state/reducers/tipospagos.reducer";
import { _proveedorReducer } from "./parametros/state/reducers/proveedor.reducer";
import { _tallaReducer } from "./parametros/state/reducers/talla.reducer";
export interface AppState {
    usuarios    : DataStateUsuarios,
    productos   : DataStateProductos,
    roles       : DataStateRoles,
    mensajes    : DataStateMensajes,
    estado      : DataStateEstado,
    opciones    : DataStateOpciones,   
    acciones    : DataStateAcciones,
    indicadores : DataStateIndicadores,
    empresa     : DataStateEmpresa,
    modulo      : DataStateModulo,
    subModulo   : DataStateSubModulo,
    moneda      : DataStateMoneda,
    ciudad      : DataStateCiudad,
    region      : DataStateRegion,
    centro      : DataStateCentro,
    grupo       : DataStateGrupo,
    subGrupo    : DataStateSubGrupo,
    color       : DataStateColor,
    pais        : DataStatePais,
    comuna      : DataStateComuna,
    unidad      : DataStateUnidad,
    clase       : DataStateClase,
    tipospagos   : DataStateTipoPagos,
    proveedor    : DataStateProveedor,
    talla        : DataStateTalla
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

export interface DataStateEmpresa {
    empresa: any[],
    logo: string,
    error?: string,
    loading: boolean,
    opcionesAsignadas: any[],
    opcionesNoAsignadas: any[]
}   

export interface DataStateModulo {
    modulo: any[],
    error?: string,
    loading: boolean,
    roles: any[],
    opciones : any[]
}

export interface DataStateSubModulo {
    subModulo: any[],
    error?: string,
    loading: boolean,
}

export interface DataStateMoneda {
    moneda: any[],
    error?: string,
    loading: boolean,
}

export interface DataStateCiudad {
    ciudad: any[],
    error?: string,
    loading: boolean,
}   

export interface DataStateRegion {
    region: any[],
    error?: string,
    loading: boolean,
}

export interface DataStateCentro {
    centro: any[],
    error?: string,
    loading: boolean,
}

export interface DataStateGrupo {
    grupo: any[],
    error?: string,
    loading: boolean,
}

export interface DataStateSubGrupo {
    subGrupo: any[],
    error?: string,
    loading: boolean,
}

export interface DataStateColor {
    color: any[],
    error?: string,
    loading: boolean,
}

export interface DataStatePais {
    pais: any[],
    error?: string,
    loading: boolean,
}

export interface DataStateComuna {
    comuna: any[],
    error?: string,
    loading: boolean,
}

export interface DataStateUnidad {
    unidad: any[],
    error?: string,
    loading: boolean,
}

export interface DataStateClase {
    clase: any[],
    error?: string,
    loading: boolean,
}

export interface DataStateTipoPagos {
    tipospagos: any[],
    error?: string,
    loading: boolean,
}

export interface DataStateProveedor {
    proveedor: any[],
    error?: string,
    loading: boolean,
}

export interface DataStateTalla {
    talla: any[],
    error?: string,
    loading: boolean,
}

export const ROOT_APP_REDUCER: ActionReducerMap<AppState> = {
    usuarios    : _usuarioReducer, 
    productos   :_productoReducer,
    roles       :_rolesReducer,
    mensajes    : _mensajeReducer,
    estado      : _estadoReducer,
    opciones    : _opcionesReducer,
    acciones    : _accionesReducer,
    indicadores : _indicadoresReducer,
    empresa     : _empresaReducer,
    modulo      : _moduloReducer,
    subModulo   : _subModuloReducer,
    moneda      : _monedaReducer,
    ciudad      : _ciudadReducer,
    region      : _regionReducer,
    centro      : _centroReducer,
    grupo       : _grupoReducer ,
    subGrupo    : _subgrupoReducer,
    color       : _colorReducer,
    pais        : _paisReducer,
    comuna      : _comunaReducer,
    unidad      : _unidadReducer,
    clase       : _claseReducer,
    tipospagos  : _tipospagosReducer,
    proveedor   : _proveedorReducer,
    talla       : _tallaReducer
  };