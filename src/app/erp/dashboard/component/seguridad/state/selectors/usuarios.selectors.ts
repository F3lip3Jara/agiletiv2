
import { createSelector } from "@ngrx/store";
import { AppState } from "../../../app.state";

// Selector para obtener el estado de los todos
export const selectState = (state: AppState) => state.usuarios;

// Selector para obtener los  usuarios
export const selectUsuarios = createSelector(
    selectState, // Selecciona el estado de los todos
    (state) => state
);

export const selectUsuarioById = createSelector(
    selectState,
    (state, props: { id: number }) => state.usuarios?.find((item) => item.id === props.id)
  );

  export const selectUsuarioName = createSelector(
    selectState,
    (state, props: {name: string}) => state.usuarios?.find((item) => item.name === props.name)
  );

  export const selectUsuarioAvatar = createSelector(
    selectState,
    (state, props: {id: number}) => state.avatar?.find((item) => item.id === props.id)
  );

// Selector para obtener el estado de error
export const selectError = createSelector(
    selectState, // Selecciona el estado de los todos
    // Función que devuelve la propiedad `error` del estado de los todos
    (state) => state.error
);