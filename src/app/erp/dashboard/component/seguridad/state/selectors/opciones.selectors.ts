import { createSelector, createFeatureSelector } from '@ngrx/store';
import { OpcionesState } from '../reducers/opciones.reducer';
import { AppState } from '../../../app.state';

export const selectState = (state: AppState) => state.opciones;

export const selectOpciones = createSelector(
    selectState,
    (state) => state.opciones
);

export const selectOpcionesError = createSelector(
    selectState,
    (state) => state.error
);

export const selectOpcionesById = createSelector(
    selectState,
    (state, props: { id: number }) => state.opciones?.find((item) => item.optId === props.id)
);
