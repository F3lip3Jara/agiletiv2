import { createSelector } from "@ngrx/store";
import { AppState } from "../../app.state";

export const selectState = (state: AppState) => state.mensajes;

export const selectMensaje = createSelector(
    selectState,
    (state) => state.mensajes
);


