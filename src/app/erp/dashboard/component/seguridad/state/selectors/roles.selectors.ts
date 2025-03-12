
import { createSelector } from "@ngrx/store";
import { AppState } from "../../../app.state";

// Selector para obtener el estado de los todos
export const selectState = (state: AppState) => state.roles;



// Selector para obtener los  usuarios
export const selectRoles = createSelector(
    selectState, // Selecciona el estado de los roles   
    (state) => state.roles
);

export const selectRolesById = createSelector(
    selectState,
    (state, props: { id: number }) => state.roles?.find((item) => item.rolId === props.id)
  );


 
// Selector para obtener el estado de error
export const selectError = createSelector(
    selectState, // Selecciona el estado de los roles
    // Función que devuelve la propiedad `error` del estado de los roles
    (state) => state.error
);