import { createSelector } from "@ngrx/store";
import { AppState } from "../../app.state";

export const selectState = (state: AppState) => state.indicadores;

export const selectIndicador = createSelector(
    selectState,
    (state) => state.indicadores
);


