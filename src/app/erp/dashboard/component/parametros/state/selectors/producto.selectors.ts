import { createSelector } from "@ngrx/store";
import { AppState } from "../../../app.state";


// Selector para obtener el estado de los todos
export const selectTodoState = (state: AppState) => state.productos;



// Selector para obtener los todos pendientes
export const selectProductosPending = createSelector(
    selectTodoState, // Selecciona el estado de los todos
    (state) => state.productos
);



// Selector para obtener el estado de error
export const selectError = createSelector(
    selectTodoState, // Selecciona el estado de los todos
    // Función que devuelve la propiedad `error` del estado de los todos
    (state) => state.error
);