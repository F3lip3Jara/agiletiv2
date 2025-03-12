import { createReducer, on } from "@ngrx/store";
import { DataStateRoles } from "../../../app.state";
import {  createRolesRequest, createRolesSuccess, deleteRolesRequest, getRolesRequest, getRolesSuccess, rolesError, updateRolesRequest } from "../actions/roles.actions";


export const initialState: DataStateRoles = {
    roles: [],
    error: '',
    loading: false
};

export const _rolesReducer = createReducer(
    initialState,    
    on(getRolesRequest, (state) => ({
        ...state, // Se regresa el mismo estado
    })),

    on(getRolesSuccess, (state, { roles }) => ({
        ...state, // Se regresa el mismo estado
        roles, // Se actualiza el estado con los Roles obtenidos
        })),

    on(createRolesRequest, (state, { rolDes }) => ({
            ...state, // Se regresa el mismo estado
            rolDes, // Se actualiza el estado con los Roles obtenidos
     })),

     on(updateRolesRequest, (state, { roles }) => ({
        ...state, // Se regresa el mismo estado
        roles, // Se actualiza el estado con los Roles obtenidos
    })),
    on(deleteRolesRequest, (state, { roles }) => ({
        ...state, // Se regresa el mismo estado
        roles, // Se actualiza el estado con los Roles obtenidos
    })),


    on(rolesError, (state, { error }) => ({
        ...state, // Se regresa el mismo estado
        error, // Se actualiza el estado con el error
         })),

  

)