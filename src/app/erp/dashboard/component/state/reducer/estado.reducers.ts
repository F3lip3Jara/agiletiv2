import { createReducer, on } from "@ngrx/store";
import { DataStateEstado } from "../../app.state";
import { decrementarRequest, incrementarRequest, setAltura, setEstadoLoading } from "../actions/estado.actions";


export const initialState: DataStateEstado = {
    estado: {loading : false, resquest: 0, response: 0 , altura: 0}
};

export const _estadoReducer = createReducer(
    initialState,      
   

    on(decrementarRequest, (state) => {
        const newRequestCount = state.estado.resquest > 0 ? state.estado.resquest - 1 : 0 ;
        return {
          ...state,
          estado: {
            ...state.estado,
            resquest: newRequestCount,
            loading: newRequestCount > 0 // Cambia a false solo si resquest es 0
          }
          // Si aún hay requests en curso, sigue en loading
        };
      }),

      on(incrementarRequest, (state, { request }) => {
        return {
            ...state,
            estado: {
                ...state.estado,
                resquest: state.estado.resquest + request,
                loading: true   
            }
        };
      }),

      on(setAltura, (state, { altura }) => {
        return {
          ...state,
          estado: {
            ...state.estado,
            altura: altura
          }
        };
      })
      
      

)