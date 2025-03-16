import { createSelector } from "@ngrx/store";
import { AppState } from "../../app.state";

export const selectState = (state: AppState) => state.estado;

export const selectEstado = createSelector(
    selectState,
    (state) => state.estado
);

export const selectToken = createSelector(
    selectState,
    (state) => {
        return state.estado.token;
    }
);

