import { createReducer, on } from "@ngrx/store";
import {  getProductosRequest, getProductoSuccess, productoError} from "../actions/producto.actions";
import { DataStateProductos } from "../../../app.state";


export const initialState: DataStateProductos = {
    productos: [],
    error: '',
    loading: false,
    colums: [] 
    
};

export const _productoReducer = createReducer(
    initialState,
    on(getProductosRequest, (state) => ({
        ...state, // Se regresa el mismo estado
        })),

    on(getProductoSuccess, (state, { productos }) => ({
        ...state, // Se regresa el mismo estado
        productos, // Se actualiza el estado con los TODOS obtenidos
       })),

    on(productoError, (state, { error }) => ({
        ...state, // Se regresa el mismo estado
        error, // Se actualiza el estado con el error
      }))

  

)